import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

// Static-first: every content page is prerendered and served from the assets layer.
// Only the endpoints that need to read live data (model status, subscribe) opt into
// on-demand rendering with `export const prerender = false`.
export default defineConfig({
  site: "https://www.hunteralphahub.com",
  output: "static",
  adapter: cloudflare({ imageService: "compile" }),
  build: { inlineStylesheets: "auto" },
});
