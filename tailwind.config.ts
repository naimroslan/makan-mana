/** @type {import('tailwindcss').Config} */

import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        funnel: ['"Funnel Display"', "serif"],
      },
      colors: {
        primary: "#111111",
        secondary: "#1068CC",

        "primary-light": "#EDEDED",
        light: "#FAFAFA",

        muted: "#A0A0A0",
        border: "#E5E5E5",

        danger: "#FF4C4C",

        dark: "#222222",
        text: "#6B7280",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      backdropBlur: {
        sm: "4px",
        md: "8px",
      },
    },
  },
  plugins: [],
} satisfies Config;
