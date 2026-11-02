/**
 * 微软 Edge TTS 的 Sec-MS-GEC v2 令牌生成（浏览器可用的纯 JS 实现）。
 *
 * 背景（2026-10 起微软收紧了 DRM，见 rany2/edge-tts #490 / PR #492）：
 *   - 旧 v1 令牌（64 位 hex、Sec-MS-GEC-Version=1-x）服务端已**全部拒绝**（403）；
 *   - 新 v2 令牌格式为 `<16 hex CS64>-<64 hex SHA256>`，Sec-MS-GEC-Version 前缀 `2-`；
 *   - 微软**只校验令牌本身**，不校验客户端指纹 —— 用真 Edge 抓包得到的 v2 令牌在
 *     Python/Node 里重放同样能拿到音频（PR #492 用 Wireshark + 重放实验证实），
 *     因此浏览器网页前端（无法设置自定义请求头）依然可用。
 *
 * 算法移植自 edge-tts（MIT）src/edge_tts/drm.py 的 generate_sec_ms_gec_v2 及其内部
 * _sha256_* / _cs64_* 辅助函数。黄金测试向量逐字节对齐（出自 PR #492，Edge 155
 * 在线上真实发出的令牌，锚定 2026-10-13T10:40:00Z 起的 5 分钟窗口）：
 *   gecV2('1791888000') === '492D7694A183A45E-56E821F95D4579C5B7C7E33DC7303FF379EC36D510213555BBBB9EB17EF15876'
 *
 * ⚠️ 两处与「直觉实现」不同、移植时最容易踩的坑：
 *   1. u32 乘法必须用 Math.imul（(a*b) mod 2^32），普通 `*` 会丢精度；
 *   2. ticks 字符串必须走 IEEE754 浮点路径（与 Python 的 f"{ticks:.0f}" 完全一致），
 *      不能用 BigInt 整数重算 —— PR #492 特意保留浮点路径，整数重算会在某些时间戳
 *      上与原生实现差一位。
 */

export const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'

/** Sec-MS-GEC-Version 的值：v2 令牌必须配 `2-` 前缀（`1-` 已被服务端拒绝）。
 *  版本号本身不参与令牌运算，取一个较新的 Edge 完整版本号即可。 */
export const SEC_MS_GEC_VERSION = '2-155.0.4283.45'

const WIN_EPOCH = 11644473600
const S_TO_NS_DIV_100 = 1e7 // Python: S_TO_NS / 100

// ---------- FIPS 180-4 常量表 + 微软的「调整版」常量（与 drm.py 逐字对应） ----------
const SHA256_INITIAL = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]
const SHA256_STATE = [
  0xfd9fbea2, 0x91243ce7, 0xbe499094, 0xcd2e1e0a, 0x6c006f49, 0x04bd35ab, 0xfeb0a7e4, 0x03effbd2,
]
const SHA256_SCHEDULE = [
  0xeb24bf9e, 0x1558691f, 0xa0c09ee2, 0x0cfa32ba, 0xa622ee8c, 0xd1dd9491, 0xc0dd25a0, 0xf9e70ab6,
  0xf0c31573, 0x7058ce4e, 0x7188e606, 0x00e5ab33, 0xd258b060, 0x72766564,
]
const SHA256_ROUND_CONSTANTS = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]
const SHA256_ADJUSTMENT = 0xc9dc06a7
/** 第 14 轮的常量被换成了调整值（恢复「被预吸收的首块」的贡献） */
const SHA256_BLOCK_CONSTANTS = [
  ...SHA256_ROUND_CONSTANTS.slice(0, 14),
  SHA256_ADJUSTMENT,
  ...SHA256_ROUND_CONSTANTS.slice(15),
]
const SHA256_SIGMA0_ADJUSTMENT = 0x059c0b80
const SHA256_SIGMA1_ADJUSTMENT = 0x000b92c0

const CS64_COEFFICIENTS: ReadonlyArray<readonly [number, number]> = [
  [0xe82e91b1, 0xb32700d0],
  [0x44de24c6, 0x88dff51d],
  [0x3beb65bc, 0x29514038],
  [0xc89c5933, 0xb328cbdf],
  [0x8d1ec211, 0xd405b4d5],
  [0x314ef5d5, 0x26e55f3c],
  [0xe92491b1, 0x607801c6],
  [0xf0a5b9d5, 0x82b2c1fb],
  [0x06064cf3, 0xfa51a3da],
  [0xda79fa60, 0x207cc464],
  [0xbed20560, 0x3c3c74f3],
  [0x89f9c9f8, 0xd2d14b61],
  [0x35fa38c6, 0xbb04a2c1],
  [0xcb49e3c6, 0xc5626167],
]
const CS64_FACTOR = 0x82893933
const CS64_ADJUSTMENT0 = 0xf2f90b1a
const CS64_ADJUSTMENT1 = 0x0b1a0000

/** 32 位循环右移 */
function rotr(x: number, n: number): number {
  return ((x >>> n) | (x << (32 - n))) >>> 0
}

/** 32 位循环左移 16 位（等价于高低 16 位对调） */
function rol16(value: number): number {
  return ((value << 16) | (value >>> 16)) >>> 0
}

/** SHA-256 小 σ0（drm.py 版本：先合并旋转再一次性截断，与标准实现 mod 2^32 等价） */
function sigma0(value: number): number {
  const v = value >>> 0
  return ((v >>> 7) ^ (v << 25) ^ (v >>> 18) ^ (v << 14) ^ (v >>> 3)) >>> 0
}

/** SHA-256 小 σ1 */
function sigma1(value: number): number {
  const v = value >>> 0
  return ((v >>> 17) ^ (v << 15) ^ (v >>> 19) ^ (v << 13) ^ (v >>> 10)) >>> 0
}

/** 标准 SHA-256 消息扩展（words 由调用方持有并原地追加到 64 个） */
function expandSchedule(words: number[], firstWord = 16): void {
  for (let index = firstWord; index < 64; index++) {
    const x = words[index - 2] >>> 0
    const y = words[index - 15] >>> 0
    const s1 = ((x >>> 17) ^ (x << 15) ^ (x >>> 19) ^ (x << 13) ^ (x >>> 10)) >>> 0
    const s0 = ((y >>> 7) ^ (y << 25) ^ (y >>> 18) ^ (y << 14) ^ (y >>> 3)) >>> 0
    words.push((s1 + words[index - 7] + s0 + words[index - 16]) >>> 0)
  }
}

/**
 * SHA-256 压缩轮。drm.py 的「乘 2^32+1 重复寄存器」技巧只是 Python 大整数的加速
 * 手法，数学上与标准轮函数完全等价（高位经掩码丢弃、异或不进位），故这里直接
 * 写标准形式。
 */
function sha256Rounds(state: readonly number[], words: readonly number[], firstRound = 0): number[] {
  let a = state[0]
  let b = state[1]
  let c = state[2]
  let d = state[3]
  let e = state[4]
  let f = state[5]
  let g = state[6]
  let h = state[7]
  const constants = firstRound === 14 ? SHA256_BLOCK_CONSTANTS : SHA256_ROUND_CONSTANTS
  for (let i = firstRound; i < 64; i++) {
    const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0
    const ch = ((e & f) ^ (~e & g)) >>> 0
    const t1 = (h + S1 + ch + constants[i] + (words[i] >>> 0)) >>> 0
    const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0
    const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0
    const t2 = (S0 + maj) >>> 0
    h = g
    g = f
    f = e
    e = (d + t1) >>> 0
    d = c
    c = b
    b = a
    a = (t1 + t2) >>> 0
  }
  return [a, b, c, d, e, f, g, h]
}

/**
 * 「预吸收首块」的 SHA-256 初始状态：drm.py 用调整过的初始状态 + 调整过的
 * 第 14 轮常量 + 调整过的消息扩展，把「首块」的贡献折进来，让令牌散列
 * （首 7 字节进这个伪初始状态，其余字节走标准压缩）只需处理第二块起的数据。
 */
function sha256Init(data7: Uint8Array): number[] {
  const words: number[] = new Array<number>(16).fill(0)
  // data7 恰好 7 字节：前 3 字节、后 4 字节各成一个 big-endian u32，落进 w14/w15
  words[14] = ((data7[0] << 16) | (data7[1] << 8) | data7[2]) >>> 0
  words[15] =
    (((data7[3] << 24) | (data7[4] << 16) | (data7[5] << 8) | data7[6]) >>> 0) >>> 0
  for (let index = 16; index <= 29; index++) {
    let value = SHA256_SCHEDULE[index - 16]
    if (index - 2 >= 14) {
      value +=
        index === 16
          ? sigma1(words[index - 2]) ^ SHA256_SIGMA1_ADJUSTMENT
          : sigma1(words[index - 2])
    }
    if (index - 7 >= 14) value += words[index - 7]
    if (index - 15 >= 14) {
      value +=
        index === 29
          ? sigma0(words[index - 15]) ^ SHA256_SIGMA0_ADJUSTMENT
          : sigma0(words[index - 15])
    }
    words[index] = value >>> 0
  }
  // w30：标准扩展公式（w28/w23/w15/w14）+ 调整值 − 第 14 轮常量（可为负 → ToUint32 与
  // Python 的 & mask 对负数同为 mod 2^32，结果一致）
  words[30] =
    (sigma1(words[28]) +
      words[23] +
      sigma0(words[15]) +
      words[14] +
      SHA256_ADJUSTMENT -
      SHA256_ROUND_CONSTANTS[14]) >>>
    0
  expandSchedule(words, 31)
  const working = sha256Rounds(SHA256_STATE, words, 14)
  const out = new Array<number>(8)
  for (let i = 0; i < 8; i++) out[i] = (SHA256_INITIAL[i] + working[i]) >>> 0
  return out
}

/** 对令牌字符串做「微软变体」SHA-256（首 7 字节走 sha256Init，其余走标准压缩） */
function sha256Digest(data: Uint8Array): Uint8Array {
  const length = 57 + data.length
  // Python 的 % 对负被除数返回非负值，这里用双取模对齐
  const zeros = (((55 - length) % 64) + 64) % 64
  const padded = new Uint8Array(data.length - 7 + 1 + zeros + 8)
  padded.set(data.subarray(7), 0)
  padded[data.length - 7] = 0x80
  const bitLen = length * 8
  const dv = new DataView(padded.buffer)
  dv.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000))
  dv.setUint32(padded.length - 4, bitLen >>> 0)

  const state = sha256Init(data.subarray(0, 7))
  for (let offset = 0; offset < padded.length; offset += 64) {
    const words: number[] = []
    for (let i = 0; i < 16; i++) words.push(dv.getUint32(offset + i * 4))
    expandSchedule(words)
    const working = sha256Rounds(state, words)
    for (let i = 0; i < 8; i++) state[i] = (state[i] + working[i]) >>> 0
  }
  const out = new Uint8Array(32)
  const odv = new DataView(out.buffer)
  for (let i = 0; i < 8; i++) odv.setUint32(i * 4, state[i] >>> 0)
  return out
}

/** 数据按 4 字节小端切成 u32 数组，补零到偶数个字（drm.py 的 _words_le4_even） */
function wordsLe4Even(data: Uint8Array): number[] {
  // Python 的 (-len) % 4 恒非负；JS 的 % 保留被除数符号，必须换算成等价的正向补零
  const pad = (4 - (data.length % 4)) % 4
  const paddedLen = data.length + pad
  const words: number[] = []
  for (let i = 0; i < paddedLen; i += 4) {
    words.push(
      (((data[i] ?? 0) |
        ((data[i + 1] ?? 0) << 8) |
        ((data[i + 2] ?? 0) << 16) |
        ((data[i + 3] ?? 0) << 24)) >>>
        0),
    )
  }
  if (words.length % 2) words.push(0)
  return words
}

/** CS64 校验和（微软专有算法）：输入令牌字符串与 SHA256 摘要，输出两个 u32 */
function cs64Digest(data: Uint8Array, digest: Uint8Array): [number, number] {
  const ddv = new DataView(digest.buffer, digest.byteOffset, digest.byteLength)
  const keyA = (ddv.getUint32(0, true) | 1) >>> 0 // little-endian u32，置最低位为 1
  const keyB = (ddv.getUint32(4, true) | 1) >>> 0
  const factorA = Math.imul(keyA, CS64_FACTOR) >>> 0
  const factorB = Math.imul(keyB, CS64_FACTOR) >>> 0

  const terms: number[] = CS64_COEFFICIENTS.map(([coef], i) =>
    Math.imul(coef, i % 2 === 0 ? factorA : factorB) >>> 0,
  )
  const offsets: number[] = CS64_COEFFICIENTS.map(([, off]) => off)

  // drm.py：切词前先拼一个 0x00 前缀（b"\x00" + data），漏掉它结果就完全不对
  const wordsData = new Uint8Array(data.length + 1)
  wordsData[0] = 0
  wordsData.set(data, 1)
  const words = wordsLe4Even(wordsData)
  for (let index = 0; index < words.length; index++) {
    const word = words[index]
    let term = Math.imul(word, index % 2 === 0 ? keyA : keyB) >>> 0
    let offset = Math.imul(rol16(word), index % 2 === 0 ? 0xef0569fb : 0xc31713db) >>> 0
    if (index === 0) {
      term = (term + Math.imul(CS64_ADJUSTMENT0, factorA)) >>> 0
      offset = (offset + CS64_ADJUSTMENT1) >>> 0
    }
    terms.push(term)
    offsets.push(offset)
  }

  let swapAcc = 0
  let swapLast = 0
  let state = 0
  let acc = 0
  for (let index = 0; index < terms.length; index += 2) {
    const x = terms[index]
    const y = terms[index + 1]
    let t = rol16((offsets[index] + x) >>> 0)
    let q = Math.imul(t, 0x76f50f34) >>> 0
    swapAcc += (Math.imul(rol16(q), 0xc3efea97) + q) >>> 0
    t = rol16((offsets[index + 1] + y) >>> 0)
    q = Math.imul(t, 0x1881ce3c) >>> 0
    swapLast = (Math.imul(rol16(q), 0x35bd1ec9) + q) >>> 0
    swapAcc = (swapAcc + swapLast) >>> 0

    state = (Math.imul(state, keyA) + x) >>> 0
    state = Math.imul(rol16(state), 0xcf98b111) >>> 0
    state = Math.imul(rol16(state), 0x87085b9f) >>> 0
    state = Math.imul(rol16(state), 0x12ceb96d) >>> 0
    state = Math.imul(rol16(state), 0x257e1d83) >>> 0
    acc = (acc + state) >>> 0
    const t2 = (Math.imul(state, keyB) + y) >>> 0
    const t3 = Math.imul(rol16(t2), 0xa27416f5) >>> 0
    const t4 = Math.imul(rol16(t3), 0xd38396ff) >>> 0
    state = Math.imul(rol16(Math.imul(rol16(t4), 0x7c932b89) >>> 0), 0xbfa49f69) >>> 0
    acc = (acc + state) >>> 0
  }
  return [(swapLast ^ state) >>> 0, (swapAcc ^ acc) >>> 0]
}

function bytesToHex(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += b.toString(16).padStart(2, '0')
  return s.toUpperCase()
}

/** 把 45 字节令牌串的 SHA256 摘要前 8 字节按小端打包成两个 u32 的 16 位大写 hex */
function cs64Hex(data: Uint8Array, digest: Uint8Array): string {
  const [w1, w2] = cs64Digest(data, digest)
  const buf = new Uint8Array(8)
  const dv = new DataView(buf.buffer)
  dv.setUint32(0, w1, true)
  dv.setUint32(4, w2, true)
  return bytesToHex(buf)
}

/**
 * 生成 v2 Sec-MS-GEC 令牌：`<16 hex CS64>-<64 hex SHA256>`。
 * @param unixSeconds 可选的 Unix 秒（测试用）；默认当前时间
 */
export function generateSecMsGecV2(unixSeconds?: number): string {
  let ticks = unixSeconds ?? Date.now() / 1000
  ticks += WIN_EPOCH
  ticks -= ticks % 300
  ticks *= S_TO_NS_DIV_100
  // 与 Python f"{ticks:.0f}" 一致：对浮点值做十进制整串化（不用 BigInt 重算，见文件头注释）
  const ticksStr = ticks.toFixed(0)
  const strBytes = new TextEncoder().encode(`${ticksStr}${TRUSTED_CLIENT_TOKEN}`)
  const digest = sha256Digest(strBytes)
  return `${cs64Hex(strBytes, digest)}-${bytesToHex(digest)}`
}
