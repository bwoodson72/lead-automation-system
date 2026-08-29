import type { ImageMetadata } from "astro";
import developerProposalClosingKitCover from "@/assets/products/developer-proposal-closing-kit.webp";
import freelancerRetainerSystemCover from "@/assets/products/freelancer-retainer-system.webp";

type ProductCoverData = {
  slug: string;
  coverImage?: ImageMetadata;
  coverImageSrc?: string;
};

const productCoverImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/products/*.{png,jpg,jpeg,webp,avif}",
  { eager: true },
);

const explicitProductCovers: Record<string, ImageMetadata> = {
  "developer-proposal-closing-kit": developerProposalClosingKitCover,
  "freelancer-retainer-system": freelancerRetainerSystemCover,
};

const fallbackExtensions = ["webp", "png", "jpg", "jpeg", "avif"] as const;

export function resolveProductCoverImage(data: ProductCoverData): ImageMetadata | undefined {
  if (data.coverImage) return data.coverImage;

  const explicitProductCover = explicitProductCovers[data.slug];
  if (explicitProductCover) return explicitProductCover;

  const explicitCoverImageFile = data.coverImageSrc?.split("/").filter(Boolean).at(-1);
  if (explicitCoverImageFile) {
    const explicitCoverImage = productCoverImages[`/src/assets/products/${explicitCoverImageFile}`]?.default;
    if (explicitCoverImage) return explicitCoverImage;
  }

  for (const extension of fallbackExtensions) {
    const slugCoverImage = productCoverImages[`/src/assets/products/${data.slug}.${extension}`]?.default;
    if (slugCoverImage) return slugCoverImage;
  }

  return undefined;
}
