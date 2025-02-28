/** @type {import('tailwindcss').Config} */

import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#6F5643',
        'secondary': '#CC6B49',
        'primary-light': '#D2A24C',
        'light': '#ECE6C2',
        'bluesky': '#73BDA8'
      }
    },
  },
  plugins: [],
} satisfies Config;
