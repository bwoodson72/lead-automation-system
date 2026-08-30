import { defineMiddleware } from "astro:middleware";
import { hiddenProductSlugs } from "@/lib/storefront-visibility";

export const onRequest = defineMiddleware((context, next) => {
  const match = context.url.pathname.match(/^\/products\/([^/]+)\/?$/);
  const slug = match?.[1];

  if (slug === "ai-prospecting-system" || (slug && hiddenProductSlugs.has(slug))) {
    return context.redirect("/products/", 302);
  }

  return next();
});
