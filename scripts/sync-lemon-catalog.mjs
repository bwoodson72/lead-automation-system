import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const API_ROOT = "https://api.lemonsqueezy.com/v1";
const GENERATED_DATA_DIRECTORY = path.resolve("src/generated");
const GENERATED_IMAGE_DIRECTORY = path.resolve("src/assets/generated/lemon");
const GENERATED_CATALOG_PATH = path.join(GENERATED_DATA_DIRECTORY, "lemon-catalog.json");
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

const apiKey = process.env.LEMONSQUEEZY_API_KEY;
const storeId = process.env.LEMONSQUEEZY_STORE_ID;

if (!apiKey || !storeId) {
  await mkdir(GENERATED_DATA_DIRECTORY, { recursive: true });
  await writeFile(GENERATED_CATALOG_PATH, `${JSON.stringify({ syncedAt: null, products: [] }, null, 2)}\n`);
  console.warn("Lemon Squeezy credentials are unavailable; generated an empty preview catalog instead.");
  process.exit(0);
}

const apiHeaders = {
  Accept: "application/vnd.api+json",
  Authorization: `Bearer ${apiKey}`,
};

async function fetchCatalogPage(url) {
  const response = await fetch(url, { headers: apiHeaders, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Lemon Squeezy catalog request failed with HTTP ${response.status}.`);
  return response.json();
}

async function fetchAllProducts() {
  const products = [];
  let nextUrl = `${API_ROOT}/products?filter[store_id]=${encodeURIComponent(storeId)}&page[size]=100`;
  while (nextUrl) {
    const page = await fetchCatalogPage(nextUrl);
    products.push(...page.data);
    nextUrl = page.links?.next ?? null;
  }
  return products;
}

function checkoutOverlayUrl(value) {
  const url = new URL(value);
  url.searchParams.set("embed", "1");
  url.searchParams.set("logo", "0");
  return url.toString();
}

function imageExtension(contentType) {
  const normalized = contentType.split(";")[0].trim().toLowerCase();
  return { "image/avif": "avif", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[normalized];
}

async function clearGeneratedImages() {
  await mkdir(GENERATED_IMAGE_DIRECTORY, { recursive: true });
  const entries = await readdir(GENERATED_IMAGE_DIRECTORY, { withFileTypes: true });
  await Promise.all(entries.filter((entry) => entry.isFile() && /^\d+\.(?:avif|jpe?g|png|webp)$/.test(entry.name)).map((entry) => rm(path.join(GENERATED_IMAGE_DIRECTORY, entry.name))));
}

async function downloadProductImage(productId, imageUrls) {
  const candidates = [...new Set(imageUrls.filter(Boolean))];
  let lastFailure = "no image URL";
  for (const imageUrl of candidates) {
    try {
      const response = await fetch(imageUrl, { headers: { Accept: "image/avif,image/webp,image/png,image/jpeg" }, signal: AbortSignal.timeout(20_000) });
      if (!response.ok) { lastFailure = `HTTP ${response.status}`; continue; }
      const extension = imageExtension(response.headers.get("content-type") ?? "");
      if (!extension) { lastFailure = "unsupported image content type"; continue; }
      const declaredSize = Number(response.headers.get("content-length") ?? 0);
      if (declaredSize > MAX_IMAGE_BYTES) { lastFailure = "image exceeds the 12 MB limit"; continue; }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) { lastFailure = "invalid image size"; continue; }
      const fileName = `${productId}.${extension}`;
      await writeFile(path.join(GENERATED_IMAGE_DIRECTORY, fileName), bytes);
      return fileName;
    } catch (error) {
      lastFailure = error instanceof Error ? error.message : "unknown error";
    }
  }
  console.warn(`Catalog image unavailable for Lemon product ${productId}; using the placeholder (${lastFailure}).`);
  return null;
}

await mkdir(GENERATED_DATA_DIRECTORY, { recursive: true });
await clearGeneratedImages();

const lemonProducts = await fetchAllProducts();
const products = await Promise.all(lemonProducts.map(async ({ id, attributes }) => {
  const imageFile = await downloadProductImage(id, [attributes.large_thumb_url, attributes.thumb_url]);
  return {
    id,
    name: attributes.name,
    slug: attributes.slug,
    status: attributes.status,
    price: attributes.price / 100,
    priceFormatted: attributes.price_formatted,
    checkoutUrl: checkoutOverlayUrl(attributes.buy_now_url),
    imageFile,
    testMode: attributes.test_mode,
    updatedAt: attributes.updated_at,
  };
}));

await writeFile(GENERATED_CATALOG_PATH, `${JSON.stringify({ syncedAt: new Date().toISOString(), products }, null, 2)}\n`);
console.log(`Synced ${products.length} Lemon Squeezy products.`);
