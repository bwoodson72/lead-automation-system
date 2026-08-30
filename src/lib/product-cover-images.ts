import type { ImageMetadata } from "astro";
type ProductCoverData = {
  slug: string;
};

const generatedLemonCovers = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/generated/lemon/*.{png,jpg,jpeg,webp,avif}",
  { eager: true },
);

export function resolveProductCoverImage(_data: ProductCoverData, lemonProductId?: string): ImageMetadata | undefined {
  if (lemonProductId) {
    const generatedCoverPath = Object.keys(generatedLemonCovers).find((filePath) =>
      filePath.match(new RegExp(`/${lemonProductId}\\.(?:png|jpe?g|webp|avif)$`)),
    );
    return generatedCoverPath ? generatedLemonCovers[generatedCoverPath]?.default : undefined;
  }
  return undefined;
}
