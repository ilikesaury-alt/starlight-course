// Electron preload：把「数据落盘」这一件事以**最小权限面**暴露给渲染进程。
//
// 安全口径（与 main.cjs 的 nodeIntegration:false + contextIsolation:true 配套）：
// - 渲染进程拿不到 require / fs / path，只能调用这里显式列出的 3 个方法；
// - 每个方法背后都是主进程里一个固定路径 + 固定行为的 IPC handler，
//   渲染进程**无法指定任意路径**（否则等于把整个文件系统交出去）；
// - 不暴露任何通用的 invoke(channel, ...)，channel 名在这里写死。
//
// 渲染侧的消费方是 src/utils/storage.ts（浏览器里 window.starlightStore 不存在，
// 自动退回 localStorage，因此同一份前端产物在网页版照常工作）。

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('starlightStore', {
  /** 读整份学习数据；文件不存在时返回 null（调用方据此走迁移） */
  read: () => ipcRenderer.invoke('starlight-store:read'),
  /** 覆盖写整份学习数据（原子写：临时文件 + rename） */
  write: (json) => ipcRenderer.invoke('starlight-store:write', json),
  /** 数据文件绝对路径（界面展示「数据存在哪」，方便家长自己备份） */
  path: () => ipcRenderer.invoke('starlight-store:path'),
})
