import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages 部署时自动设置子路径,本地开发/Cloudflare Pages 用根路径
// GITHUB_REPOSITORY 格式为 "用户名/仓库名",提取仓库名作为 base
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''
const base = repoName && repoName !== `${process.env.GITHUB_REPOSITORY?.split('/')[0]}.github.io`
  ? `/${repoName}/`
  : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 显式使用 sass 包（而非 sass-embedded），build 与 dev 行为一致
        api: 'modern',
      },
    },
  },
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        // 框架代码单独分包:业务页面迭代时 vendor chunk 哈希不变,客户端缓存命中率更高
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand', 'framer-motion', 'lucide-react'],
        },
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Starlight 英语小课堂',
        short_name: 'Starlight',
        description: '配合菲教一对一课程的英语听说预习与复习小帮手',
        theme_color: '#5BC0EB',
        background_color: '#FFF9F0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        lang: 'zh-CN',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 预缓存所有静态资源,支持离线使用
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,woff,woff2}'],
        // 让新的 Service Worker 立即激活并接管所有客户端,
        // 避免"必须关闭所有标签页再重开才能更新"的问题
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // HTML 文档使用 NetworkFirst,确保用户能快速拿到最新版本
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            // Google 字体离线缓存
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // 有道词典 TTS 音频降级播放缓存
            urlPattern: /^https:\/\/dict\.youdao\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'youdao-tts-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      devOptions: {
        // 默认开发环境启用,方便在局域网真机测试。
        // 但本仓库 E2E 通过 PW_TEST=1 关闭 dev SW——沙箱里 vite-plugin-pwa
        // 写 dev-dist/sw.js 会被 EPERM 拒绝并弹出错误覆盖层,干扰 Playwright 点击。
        enabled: process.env.PW_TEST !== '1',
      },
    }),
  ],
})
