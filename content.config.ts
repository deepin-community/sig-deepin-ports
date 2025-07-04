import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blogs: defineCollection({
      source: "blog/*.md",
      type: "page",
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        author: z.string(),
        date: z.date(),
        bodyHtml: z.string(),
      }),
    }),
    installdocs: defineCollection({
      source: "docs/install/*.md",
      type: "page",
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        author: z.string(),
        date: z.date(),
        bodyHtml: z.string(),
      }),
    }),
    testdocs: defineCollection({
      source: "docs/test/*.md",
      type: "page",
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        author: z.string(),
        date: z.date(),
        bodyHtml: z.string(),
      }),
    }),
  },
});
