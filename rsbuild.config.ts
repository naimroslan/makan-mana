import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx'
    },
    define: {
      'process.env.MAKANMANA_API_URL': JSON.stringify(process.env.MAKANMANA_API_URL),
    }
  },
  html: {
    title: 'makanmana'
  }
});
