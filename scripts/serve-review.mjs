// 极简本地服务器:把 / 指向复习测验 HTML,仅用于浏览器验证
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const file = resolve(import.meta.dirname, '..', '前三单元复习测验.html')
const html = readFileSync(file)
createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(html)
}).listen(8899, '127.0.0.1', () => console.log('http://127.0.0.1:8899/'))
