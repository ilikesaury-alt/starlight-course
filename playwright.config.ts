import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright 端到端测试配置（针对 starlight-course）
 *
 * 关键点：
 * - 本应用使用 HashRouter，所有路由形如 `#/courses`、`#/starlight`，
 *   baseURL 指向本地 dev 服务器根路径，测试里用 `page.goto('#/courses')` 跳转。
 * - webServer 复用 `npm run dev`（Vite），playwright 会自动等它就绪。
 * - headless 模式下 speechSynthesis 不可用，用例已在 fixture 中 mock 掉，
 *   避免首页/课程页的朗读逻辑在 CI 中不稳定。
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    // 每个用例启动前注入：mock speechSynthesis，headless 浏览器无此 API。
    // 同时屏蔽 service worker 注册噪音（dev 下 PWA 已启用），让测试更干净。
    initScript: `(() => {
      if (!('speechSynthesis' in window)) {
        Object.defineProperty(window, 'speechSynthesis', {
          value: {
            speak() {},
            cancel() {},
            pause() {},
            resume() {},
            getVoices() { return [] },
            addEventListener() {},
            removeEventListener() {},
          },
          configurable: true,
        })
      }
      // 屏蔽 PWA 自动更新导致的不可预期 reload
      try {
        Object.defineProperty(navigator.serviceWorker, 'register', {
          value: () => Promise.resolve({ scope: '/', addEventListener() {} }),
          configurable: true,
        })
      } catch (e) { /* ignore */ }
    })()`,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    // PW_TEST=1 → vite.config.ts 关闭 dev Service Worker，避免沙箱 EPERM 弹错覆盖层。
    // 用 env 注入（而非命令前缀），兼容 Windows cmd 拉起 webServer。
    env: { ...process.env, PW_TEST: '1' },
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
