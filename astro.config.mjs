// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import astroIcon from "astro-icon";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [tailwind(), astroIcon(), sitemap()],
  site: "https://emmanpbarrameda.github.io",
  trailingSlash: "ignore",

  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
    },
  },

  vite: {
    build: {
      minify: "esbuild",
      target: "es2018",
    },
  },
});
