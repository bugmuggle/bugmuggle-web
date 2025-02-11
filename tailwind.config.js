/** @type {import('tailwindcss').Config} */
import { themes } from './themes'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
