import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Shrikhand"', "serif"],
        sans: ['"Saira"', "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        scriblo: {
          primary: "#000000",
          "primary-content": "#ffffff",
          secondary: "#ffffff",
          "secondary-content": "#000000",
          accent: "#b5d77f",
          "accent-content": "#000000",
          neutral: "#000000",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#e3efc9",
          "base-300": "#d2e4ad",
          "base-content": "#000000",
          info: "#3b82f6",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",
          "--rounded-box": "0",
          "--rounded-btn": "0",
          "--rounded-badge": "0",
          "--border-btn": "2px",
        },
      },
    ],
  },
};