import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const status = z.enum(["available", "coming-soon", "planned"]);
const products = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(), slug: z.string(), status, family: z.string(), path: z.enum(["services", "saas", "both"]),
    audience: z.string(), shortDescription: z.string(), coreOutcome: z.string(), problem: z.string(),
    format: z.string().default("Implementation guide"), difficulty: z.string().optional(), free: z.boolean().default(false), featured: z.boolean().default(false), order: z.number(),
    price: z.number().positive().optional(), priceLabel: z.string().optional(), checkoutUrl: z.url().optional(),
    situation: z.string(), commonFailure: z.string(), methodology: z.string(), capabilities: z.array(z.string()).min(3), contents: z.array(z.string()).default([]),
    whoItsFor: z.array(z.string()).min(1), whoItsNotFor: z.array(z.string()).min(1), workflow: z.array(z.string()).min(3),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]), relatedProducts: z.array(z.string()).default([]),
    tier: z.number().int().min(1).max(4).optional(), automationLevel: z.string().optional(), technicalLevel: z.string().optional(), tools: z.array(z.string()).default([]), stateModel: z.string().optional(), supervision: z.string().optional(), technicalBoundary: z.string().optional(),
    seo: z.object({ title: z.string(), description: z.string() }),
  }).superRefine((data, ctx) => {
    if (data.status === "available" && !data.free && (!data.price || !data.checkoutUrl)) ctx.addIssue({ code: "custom", message: "Available paid products require price and checkoutUrl." });
    if (data.status !== "available" && data.checkoutUrl) ctx.addIssue({ code: "custom", message: "Only available products may have checkoutUrl." });
  }),
});
const bundles = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/bundles" }),
  schema: z.object({ title: z.string(), slug: z.string(), status, outcome: z.string(), audience: z.string(), order: z.number(), products: z.array(z.string()).default([]), price: z.number().positive().optional(), checkoutUrl: z.url().optional() }).superRefine((data, ctx) => {
    if (data.status === "available" && (!data.price || !data.checkoutUrl)) ctx.addIssue({ code: "custom", message: "Available bundles require price and checkoutUrl." });
    if (data.status !== "available" && data.checkoutUrl) ctx.addIssue({ code: "custom", message: "Only available bundles may have checkoutUrl." });
  }),
});
const articles = defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }), schema: ({ image }) => z.object({ title: z.string(), description: z.string(), publishedAt: z.coerce.date(), updatedAt: z.coerce.date().optional(), heroImage: image().optional(), heroAlt: z.string().optional(), category: z.string(), tags: z.array(z.string()), relatedProducts: z.array(z.string()).optional(), featured: z.boolean().default(false), draft: z.boolean().default(false) }) });
const faqs = defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/faqs" }), schema: z.object({ question: z.string(), answer: z.string(), category: z.string(), tiers: z.array(z.number()).optional(), featured: z.boolean().default(false), order: z.number() }) });
export const collections = { products, bundles, articles, faqs };
