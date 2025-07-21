import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// Default API URL if environment variable is not set
const API_URL = process.env.MAKANMANA_BACKEND_URL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const REACT_MAKANMANA_VERSION = process.env.REACT_MAKANMANA_VERSION;

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: "./src/main.tsx",
    },
    define: {
      "process.env.MAKANMANA_BACKEND_URL": JSON.stringify(API_URL),
      "process.env.SUPABASE_URL": JSON.stringify(SUPABASE_URL),
      "process.env.SUPABASE_ANON_KEY": JSON.stringify(SUPABASE_ANON_KEY),
      "process.env.REACT_MAKANMANA_VERSION": JSON.stringify(
        REACT_MAKANMANA_VERSION,
      ),
    },
  },
  html: {
    title: "makanmana",
    template: "./index.html",
  },
  output: {
    copy: [
      { from: "public/manifest.json", to: "manifest.json" },
      { from: "public/sw.js", to: "sw.js" },
      { from: "public/icons", to: "icons" },
      { from: "./favicon.png", to: "favicon.png" },
    ],
  },
});
