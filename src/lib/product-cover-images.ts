import type { ImageMetadata } from "astro";

type ProductCoverData = {
  slug: string;
};

const productMockups = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/product-mockups/*.{svg,png,jpg,jpeg,webp,avif}",
  { eager: true },
);

const generatedLemonCovers = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/generated/lemon/*.{png,jpg,jpeg,webp,avif}",
  { eager: true },
);

export function resolveProductCoverImage(data: ProductCoverData, lemonProductId?: string): ImageMetadata | undefined {
  const productMockupPath = Object.keys(productMockups).find((filePath) =>
    filePath.match(new RegExp(`/${data.slug}\\.(?:svg|png|jpe?g|webp|avif)$`)),
  );

  if (productMockupPath) {
    return productMockups[productMockupPath]?.default;
  }

  if (lemonProductId) {
    const generatedCoverPath = Object.keys(generatedLemonCovers).find((filePath) =>
      filePath.match(new RegExp(`/${lemonProductId}\\.(?:png|jpe?g|webp|avif)$`)),
    );
    return generatedCoverPath ? generatedLemonCovers[generatedCoverPath]?.default : undefined;
  }

  return undefined;
}
