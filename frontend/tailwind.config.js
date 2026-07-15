/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  // Enable class-based dark mode so we can toggle it with js
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        accent: {
          DEFAULT: "#14B8A6",
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
        },
        background: "#F8FAFC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "glow-teal": "0 0 20px rgba(20, 184, 166, 0.35)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.35)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.35)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
