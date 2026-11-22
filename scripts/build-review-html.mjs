// 把 review-data.json 注入 review-template.html -> 自包含单文件 HTML
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const tpl = readFileSync(resolve(root, 'scripts/review-template.html'), 'utf8')
const data = readFileSync(resolve(root, 'review-data.json'), 'utf8')
// 防止数据里的 </script> 提前闭合
const safe = data.replace(/<\/script/gi, '<\\/script')
const html = tpl.replace('__DATA__', safe)
const dest = resolve(root, '前三单元复习测验.html')
writeFileSync(dest, html, 'utf8')
console.log('生成:', dest, (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB')
