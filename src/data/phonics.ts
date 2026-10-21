// ============================================================
//  自然拼读（Phonics）辅助：音素 → 字母 的轻量桥接
//  ------------------------------------------------------------
//  定位：孩子两年听力启蒙，但"音→形"的反向编码（拼写）缺练。
//  本文件不追求语言学精确，只做"把声音段对应到字母段"的可视化拆分，
//  配合听写页的「音素格子 / 金字塔拼写」提示，补上自然拼读这座桥。
//
//  规则覆盖（面向三年级上册 CVC / 常见词）：
//    - 元音 a e i o u
//    - 常见辅音连缀 / digraph：th sh ch ph wh ck ng qu
//    - 魔术 e（a_e / i_e / o_e / u_e / e_e）：silent e 不入格
//    - 双写辅音（ss ll ff tt 等）按一个音处理，但字母仍各占一格
//    - 其余单辅音每字母一格
// ============================================================

/** 把单词切成「音素格子」对应的字母片段（用于 Elkonin 音盒可视化）。 */
export function phonemeBoxes(word: string): string[] {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return []
  const boxes: string[] = []
  let i = 0
  const vowel = (c: string) => 'aeiou'.includes(c)

  while (i < w.length) {
    // 末位是 silent e（前一个是有元音的音节且 e 前是辅音）：不单独成格
    if (w[i] === 'e' && i === w.length - 1 && i - 1 >= 0 && !vowel(w[i - 1])) {
      // silent e：吞进前一个格子末尾（如 "cake" -> ca / ke）
      if (boxes.length > 0) boxes[boxes.length - 1] += 'e'
      break
    }
    // digraph / 连缀：两个字母一个音
    const two = w.slice(i, i + 2)
    if (['th', 'sh', 'ch', 'ph', 'wh', 'ck', 'ng', 'qu', 'ee', 'oo', 'oa', 'ai', 'ea', 'ou', 'ow'].includes(two)) {
      boxes.push(two)
      i += 2
      continue
    }
    // 单字母
    boxes.push(w[i])
    i += 1
  }
  return boxes
}

/** 金字塔拼写阶梯：c / ca / cat（逐步展开一阶，作为记不住拼写时的提示梯）。 */
export function spellingPyramid(word: string): string[] {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return []
  const steps: string[] = []
  for (let n = 1; n <= w.length; n++) steps.push(w.slice(0, n))
  return steps
}

/** 本词是否适合做「音素格子」练习（短词优先，建立信心）。 */
export function isShortWord(word: string, max = 4): boolean {
  const w = word.replace(/[^a-z]/gi, '')
  return w.length <= max
}

/** 给一个不会拼的词的「拼读提示阶梯」文本，供反馈区展示。 */
export function phonicsHint(word: string): string {
  const boxes = phonemeBoxes(word)
  if (boxes.length === 0) return ''
  return boxes.map((b) => b.toUpperCase()).join(' · ')
}
