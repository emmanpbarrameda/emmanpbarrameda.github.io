// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import astroIcon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  integrations: [tailwind(), astroIcon(), sitemap()],
  site: "https://emmanpbarrameda.github.io",
  trailingSlash: "ignore",

  markdown: {
    shikiConfig: {
      theme: "poimandres"
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor-link"],
            ariaLabel: "Copy link to this section"
          },
          content: {
            type: "text",
            value: "⎘"
          }
        }
      ]
    ]
  },

  vite: {
    build: {
      minify: "esbuild",
      target: "es2018"
    }
  }
});
