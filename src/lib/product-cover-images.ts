import type { ImageMetadata } from "astro";
import quickstartCover from "@/assets/products/developer-marketing-quickstart.png";

type ProductCoverData = {
  slug: string;
};

const generatedLemonCovers = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/generated/lemon/*.{png,jpg,jpeg,webp,avif}",
  { eager: true },
);

export function resolveProductCoverImage(data: ProductCoverData, lemonProductId?: string): ImageMetadata | undefined {
  // The preview build may not have Lemon Squeezy credentials or generated covers.
  // Keep the committed Quickstart artwork available without changing live catalog images.
  const fallback = data.slug === "developer-marketing-quickstart" ? quickstartCover : undefined;
  if (!lemonProductId) return fallback;

  const generatedCoverPath = Object.keys(generatedLemonCovers).find((filePath) =>
    filePath.match(new RegExp(`/${lemonProductId}\\.(?:png|jpe?g|webp|avif)$`)),
  );

  return generatedCoverPath ? generatedLemonCovers[generatedCoverPath]?.default ?? fallback : fallback;
}
