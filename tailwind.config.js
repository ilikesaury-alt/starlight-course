/** @type {import('tailwindcss').Config} */

// 主题色与 src/styles/_tokens.scss 完全对齐（SCSS 为唯一真源）。
// 注：本项目入口样式未使用 @tailwind 指令，此处仅作主题对齐参考，
// 若日后启用 Tailwind 工具类，可直接复用这些设计令牌。
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        // 与 src/styles/_tokens.scss 对齐
        brand: { DEFAULT: "#5bc0eb", 2: "#3ca7e0", soft: "#e0f2fe", deep: "#0284c7" },
        sun:   { DEFAULT: "#fbbf24", soft: "#fef3c7", deep: "#f59e0b", ink: "#92400e" },
        leaf:  { DEFAULT: "#34d399", soft: "#d1fae5", deep: "#065f46" },
        rose:  { DEFAULT: "#f472b6", soft: "#fce7f3" },
        grape: { DEFAULT: "#a78bfa", soft: "#ede9fe", 500: "#8b5cf6", 700: "#7c3aed", deep: "#6d28d9" },
        coral: { DEFAULT: "#fb7185", soft: "#ffe4e6" },
        ok:    { DEFAULT: "#10b981", soft: "#d1fae5" },
        no:    { DEFAULT: "#ef4444", soft: "#fee2e2" },
        ink:   { DEFAULT: "#1f2937", soft: "#6b7280", mute: "#9ca3af" },
        paper: "#FFF9F0",
        line:  { DEFAULT: "#f3f4f6", 2: "#e5e7eb" },
      },
      fontFamily: {
        cute: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', "sans-serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "28px",
        pill: "999px",
        blob: "28px",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(91, 192, 235, 0.08)",
        DEFAULT: "0 4px 16px rgba(91, 192, 235, 0.12)",
        lg: "0 8px 24px rgba(91, 192, 235, 0.16)",
        pop: "0 10px 30px rgba(251, 191, 36, 0.25)",
      },
    },
  },
  plugins: [],
};
