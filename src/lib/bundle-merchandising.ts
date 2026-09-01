import type { CollectionEntry } from "astro:content";
import { bundleProgression } from "@/lib/bundle-progression";
import { resolveProductCommerce } from "@/lib/lemon-squeezy";
import { resolveProductCoverImage } from "@/lib/product-cover-images";

const parsePrice = (formatted?: string): number | undefined => {
  if (!formatted) return undefined;
  const value = Number(formatted.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : undefined;
};

export function getBundleMerchandising(
  bundle: CollectionEntry<"bundles">,
  products: CollectionEntry<"products">[],
) {
  const commerce = resolveProductCommerce(bundle.data);
  const includedProducts = bundle.data.products
    .map((slug) => products.find((product) => product.data.slug === slug))
    .filter((product): product is CollectionEntry<"products"> => Boolean(product));

  const individualPrices = includedProducts.map((product) => parsePrice(resolveProductCommerce(product.data).priceFormatted));
  const completeProductSet = bundle.data.products.length > 0 && includedProducts.length === bundle.data.products.length;
  const completePriceSet = completeProductSet && individualPrices.every((price) => price !== undefined);
  const separateValue = completePriceSet
    ? (individualPrices as number[]).reduce((sum, price) => sum + price, 0)
    : undefined;

  const liveBundlePrice = parsePrice(commerce.priceFormatted);
  const bundlePrice = liveBundlePrice ?? bundle.data.price;
  const bundlePriceFormatted = commerce.priceFormatted ?? (bundlePrice ? `$${bundlePrice.toFixed(0)}` : undefined);
  const savings = bundlePrice && separateValue && separateValue > bundlePrice
    ? separateValue - bundlePrice
    : undefined;
  const savingsPercent = savings && separateValue
    ? Math.round((savings / separateValue) * 100)
    : undefined;
  const progression = bundleProgression.find((entry) => entry.slug === bundle.data.slug);
  const image = commerce.product?.id
    ? resolveProductCoverImage(bundle.data, commerce.product.id)
    : undefined;

  return {
    commerce,
    effectiveStatus: commerce.effectiveStatus,
    purchasable: commerce.purchasable,
    checkoutUrl: commerce.checkoutUrl,
    bundlePrice,
    bundlePriceFormatted,
    separateValue,
    savings,
    savingsPercent,
    includedProducts,
    productCount: bundle.data.products.length,
    image,
    step: progression?.step ?? String(bundle.data.order).padStart(2, "0"),
    stage: bundle.data.stage ?? progression?.stage ?? "Bundle",
  };
}
