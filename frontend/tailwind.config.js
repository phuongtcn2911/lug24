import { transform } from 'framer-motion';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scan: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(14rem)" },
          "0%": { transform: "translateY(0)" },
        },
        detect: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "80%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },

      },
      animation: {
        scan: "scan 5s linear infinite",
        detect: "detect 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
}

