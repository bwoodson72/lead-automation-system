import catalog from "@/generated/lemon-catalog.json";

export type LemonProduct = (typeof catalog.products)[number];
export type ProductStatus = "available" | "coming-soon" | "planned";

export type CommerceProductData = {
  title: string;
  slug: string;
  status: ProductStatus;
  lemonProductId?: string;
};

export type ProductCommerceResolution = {
  product?: LemonProduct;
  match: "id" | "slug" | "name" | "missing" | "ambiguous";
  effectiveStatus: ProductStatus;
  purchasable: boolean;
  priceFormatted?: string;
  checkoutUrl?: string;
};

const productsById = new Map(catalog.products.map((product) => [product.id, product]));
const productsBySlug = new Map(catalog.products.map((product) => [product.slug, product]));

export function normalizeProductTitle(value: string): string {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const productsByNormalizedName = new Map<string, LemonProduct[]>();
for (const product of catalog.products) {
  const normalizedName = normalizeProductTitle(product.name);
  productsByNormalizedName.set(normalizedName, [
    ...(productsByNormalizedName.get(normalizedName) ?? []),
    product,
  ]);
}

export function isLemonProductPurchasable(product: LemonProduct | undefined): boolean {
  return Boolean(product && product.status === "published" && !product.testMode && product.checkoutUrl);
}

export function resolveProductCommerce(data: CommerceProductData): ProductCommerceResolution {
  let product: LemonProduct | undefined;
  let match: ProductCommerceResolution["match"];

  if (data.lemonProductId) {
    product = productsById.get(data.lemonProductId);
    match = product ? "id" : "missing";
  } else {
    product = productsBySlug.get(data.slug);
    if (product) {
      match = "slug";
    } else {
      const candidates = productsByNormalizedName.get(normalizeProductTitle(data.title)) ?? [];
      if (candidates.length === 1) {
        [product] = candidates;
        match = "name";
      } else {
        match = candidates.length > 1 ? "ambiguous" : "missing";
      }
    }
  }

  const purchasable = isLemonProductPurchasable(product);
  const effectiveStatus: ProductStatus = purchasable
    ? "available"
    : product
      ? "coming-soon"
      : data.status === "planned"
        ? "planned"
        : "coming-soon";

  return {
    product,
    match,
    effectiveStatus,
    purchasable,
    priceFormatted: purchasable ? product?.priceFormatted : undefined,
    checkoutUrl: purchasable ? product?.checkoutUrl : undefined,
  };
}

let coverageReported = false;

export function reportProductCatalogCoverage(products: CommerceProductData[]): void {
  if (coverageReported) return;
  coverageReported = true;

  const coverage = {
    mapped: [] as string[],
    unpublished: [] as string[],
    missing: [] as string[],
    ambiguous: [] as string[],
  };

  for (const data of products) {
    const resolution = resolveProductCommerce(data);
    const label = `${data.title} (${data.slug})`;
    if (resolution.match === "ambiguous") coverage.ambiguous.push(label);
    else if (resolution.match === "missing") coverage.missing.push(label);
    else if (!resolution.purchasable) coverage.unpublished.push(label);
    else coverage.mapped.push(`${label} -> ${resolution.product?.id}`);
  }

  const report = [
    `Lemon catalog coverage: ${products.length} local / ${catalog.products.length} Lemon products`,
    `  Mapped (${coverage.mapped.length}): ${coverage.mapped.join(", ") || "none"}`,
    `  Unpublished (${coverage.unpublished.length}): ${coverage.unpublished.join(", ") || "none"}`,
    `  Missing (${coverage.missing.length}): ${coverage.missing.join(", ") || "none"}`,
    `  Ambiguous (${coverage.ambiguous.length}): ${coverage.ambiguous.join(", ") || "none"}`,
  ].join("\n");

  if (coverage.missing.length || coverage.ambiguous.length || coverage.unpublished.length) console.warn(report);
  else console.info(report);
}
