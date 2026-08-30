import catalog from "@/generated/lemon-catalog.json";

export type LemonProduct = (typeof catalog.products)[number];

type CommerceProductData = {
  lemonProductId?: string;
};

const productsById = new Map(catalog.products.map((product) => [product.id, product]));

export function getLemonProduct(data: CommerceProductData): LemonProduct | undefined {
  return data.lemonProductId ? productsById.get(data.lemonProductId) : undefined;
}

export function isLemonProductPurchasable(product: LemonProduct | undefined): boolean {
  return Boolean(product && product.status === "published" && !product.testMode && product.checkoutUrl);
}
