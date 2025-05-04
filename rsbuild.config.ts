import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

// Default API URL if environment variable is not set
const API_URL = process.env.MAKANMANA_API_URL;

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx'
    },
    define: {
      'process.env.MAKANMANA_API_URL': JSON.stringify(API_URL),
    }
  },
  html: {
    title: 'makanmana',
    favicon: './favicon.png'
  }
});
