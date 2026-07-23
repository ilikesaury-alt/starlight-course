/** @type {import('tailwindcss').Config} */

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
        // 童趣配色
        sun: {
          DEFAULT: "#FFC93C",
          50: "#FFF8E0",
          100: "#FFEFB3",
          200: "#FFE080",
          300: "#FFD14D",
          400: "#FFC93C",
          500: "#F5B017",
          600: "#D49000",
        },
        sky2: {
          DEFAULT: "#5BC0EB",
          50: "#EAF8FD",
          100: "#D2EFFB",
          200: "#A6E0F7",
          300: "#79D1F3",
          400: "#5BC0EB",
          500: "#2A9FD4",
          600: "#1A7EAB",
        },
        mint: {
          DEFAULT: "#9BE564",
          50: "#F2FCE6",
          100: "#E2F8C6",
          200: "#C8EF97",
          300: "#9BE564",
          400: "#7CCB3F",
          500: "#5FA524",
        },
        coral: {
          DEFAULT: "#FF6B6B",
          50: "#FFE8E8",
          100: "#FFCFCF",
          200: "#FF9E9E",
          300: "#FF6B6B",
          400: "#F04848",
          500: "#C72828",
        },
        paper: "#FFF9F0",
        ink: "#2D4059",
        coffee: "#E8D5B7",
      },
      fontFamily: {
        cute: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', "sans-serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "28px",
      },
      boxShadow: {
        sticker: "0 4px 0 rgba(45, 64, 89, 0.12), 0 8px 20px rgba(45, 64, 89, 0.08)",
        pop: "0 6px 0 rgba(45, 64, 89, 0.18), 0 12px 28px rgba(45, 64, 89, 0.12)",
        soft: "0 8px 24px rgba(45, 64, 89, 0.10)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        rise: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        sparkle: {
          "0%, 100%": { transform: "scale(1) rotate(0)", opacity: "1" },
          "50%": { transform: "scale(1.2) rotate(15deg)", opacity: "0.8" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateY(120vh) rotate(720deg)", opacity: "0" },
        },
      },
      animation: {
        wiggle: "wiggle 1.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        pop: "pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        rise: "rise 0.5s ease-out both",
        sparkle: "sparkle 1.2s ease-in-out infinite",
        confetti: "confetti 2.5s linear forwards",
      },
    },
  },
  plugins: [],
};
