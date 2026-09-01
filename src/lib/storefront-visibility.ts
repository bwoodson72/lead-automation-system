import type { CollectionEntry } from "astro:content";

export const hiddenProductSlugs = new Set([
  "ai-prospecting-starter",
  "chatgpt-client-acquisition-system",
  "automated-lead-engine",
  "production-lead-engine",
  "saas-validation-before-you-build",
  "micro-saas-launch-system",
  "the-first-10-saas-customers",
  "ai-powered-one-person-dev-business",
]);

export const hiddenBundleSlugs = new Set<string>();

export const isPublicProduct = (product: CollectionEntry<"products">) =>
  !hiddenProductSlugs.has(product.data.slug);

export const isPublicProductSlug = (slug: string) => !hiddenProductSlugs.has(slug);

export const isPublicBundle = (bundle: CollectionEntry<"bundles">) =>
  !hiddenBundleSlugs.has(bundle.data.slug);
