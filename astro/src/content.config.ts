import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Article collection. The schema mirrors the Next app's BlogPost interface
 * one-for-one, so the import is checkable rather than hopeful: a field that
 * disappears between the two apps fails the build here.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    author: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    category: z.string(),
    readTime: z.number(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
