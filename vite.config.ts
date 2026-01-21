import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@Components": path.resolve(__dirname, "app/components"),
      "@Types": path.resolve(__dirname, "app/types"),
      "@Styles": path.resolve(__dirname, "app/styles"),
      "@Assets": path.resolve(__dirname, "app/assets"),
      "@Configs": path.resolve(__dirname, "app/configs"),
      "@Utils": path.resolve(__dirname, "app/utils"),
      "@Services": path.resolve(__dirname, "app/services"),
      "@Hooks": path.resolve(__dirname, "app/hooks"),
      "@Routes": path.resolve(__dirname, "app/routes"),
      "@Context": path.resolve(__dirname, "app/context"),
    },
  },
});
