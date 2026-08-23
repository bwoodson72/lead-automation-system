import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const products = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/products" }),
  schema: ({ image }) => z.object({
    title: z.string(), shortTitle: z.string(), slug: z.string(),
    tier: z.number().int().min(1).max(4), tagline: z.string(), description: z.string(),
    audience: z.string(), promise: z.string(), automationLevel: z.string(), technicalLevel: z.string(),
    buyerQuestion: z.string(), benefitHeadline: z.string(), benefitDescription: z.string(),
    benefitBullets: z.array(z.string()).length(4), outcomeLabel: z.string(),
    ownershipHeadline: z.string(), ownershipDescription: z.string(),
    heroImage: image().optional(), heroAlt: z.string().optional(), previewImages: z.array(image()).default([]),
    whatYouBuild: z.array(z.string()), topics: z.array(z.string()), tools: z.array(z.string()),
    prerequisites: z.array(z.string()), outcomes: z.array(z.string()), limitations: z.array(z.string()),
    price: z.number().positive().optional(), checkoutUrl: z.url().optional(),
    version: z.string().optional(), pageCount: z.number().int().positive().optional(), lastUpdated: z.coerce.date().optional(),
    featured: z.boolean().default(false), order: z.number(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: ({ image }) => z.object({
    title: z.string(), description: z.string(), publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional(),
    heroImage: image().optional(), heroAlt: z.string().optional(), category: z.string(), tags: z.array(z.string()),
    relatedProducts: z.array(z.string()).optional(), featured: z.boolean().default(false), draft: z.boolean().default(false),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/faqs" }),
  schema: z.object({
    question: z.string(), answer: z.string(), category: z.string(), tiers: z.array(z.number()).optional(),
    featured: z.boolean().default(false), order: z.number(),
  }),
});

export const collections = { products, articles, faqs };
