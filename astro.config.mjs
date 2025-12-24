// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import astroIcon from "astro-icon";

export default defineConfig({
  integrations: [tailwind(), astroIcon()],
  site: "https://emmanpbarrameda.github.io",
  trailingSlash: "ignore",

  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },

  vite: {
    build: {
      minify: "esbuild",
      target: "es2018",
    },
  },
});
