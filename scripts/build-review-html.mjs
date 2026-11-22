// 把 review-data.json 注入 review-template.html -> 自包含单文件 HTML
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const tpl = readFileSync(resolve(root, 'scripts/review-template.html'), 'utf8')
const data = readFileSync(resolve(root, 'review-data.json'), 'utf8')
// 防止数据里的 </script> 提前闭合
const safe = data.replace(/<\/script/gi, '<\\/script')
const html = tpl.replace('__DATA__', safe)
const kb = (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB'
// 根目录文件：本地双击离线用
const dest = resolve(root, '前三单元复习测验.html')
writeFileSync(dest, html, 'utf8')
console.log('生成:', dest, kb)
// public/ 副本：Vite 构建时原样进 dist/，供线上首页链接访问
const publicDest = resolve(root, 'public/review.html')
writeFileSync(publicDest, html, 'utf8')
console.log('生成:', publicDest, kb)
