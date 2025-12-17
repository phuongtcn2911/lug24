import themes from 'daisyui/theme/object';
import { transform } from 'framer-motion';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
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
        slideOutLeft: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        expand: {
          "0%": { maxHeight: "0", opacity: "0", transform: "translateY(-12px)" },
          "100%": { maxHeight: "400px", opacity: "1", transform: "translateY(0)" },
        },
        collapse: {
          "0%": {maxHeight: "400px",opacity: "1",transform: "translateY(0)"},
          "100%": {maxHeight: "0",opacity: "0",transform: "translateY(-12px)"},
        }
      },
      animation: {
        scan: "scan 5s linear infinite",
        detect: "detect 0.6s ease-out forwards",
        slideOutLeft: "slideOutLeft 0.3s ease-in-out forwards",
        slideInRight: "slideInRight 0.3s ease-in-out forwards",
        slideOutRight: "slideOutRight 0.3s ease-in-out forwards",
        slideInLeft: "slideInLeft 0.3s ease-in-out forwards",
        expand:"expand 0.35s ease-out forwards",
        collapse:"collapse 0.25s ease-in forwards",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("flowbite/plugin")
  ],
  daisyui: {
    themes: ["light"],
  }

}

