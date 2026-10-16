import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve("dist/client");
const calculator = "/tools/freelance-project-pricing-calculator/";
const paid = "/products/web-developer-pricing-system/";

async function inspectLink(pageRoute, destination, minimum = 1) {
  const filepath = path.join(outputRoot, pageRoute.slice(1), "index.html");
  const html = await readFile(filepath, "utf8");
  const anchors = [...html.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => tag);
  const matches = anchors.filter((tag) =>
    tag.includes('href="' + destination + '"') || tag.includes("href='" + destination + "'")
  );
  assert.ok(matches.length >= minimum,
    pageRoute + ": expected " + minimum + " crawlable anchor(s) to " + destination + ", found " + matches.length);
  return matches.length;
}

const locations = [
  [calculator, paid, 2],
  [paid, calculator, 1],
  ["/start/", calculator, 1],
  ["/articles/how-to-price-freelance-web-development-project/", calculator, 1],
  ["/articles/fixed-price-vs-hourly-freelance-web-development-project/", calculator, 1],
  ["/articles/when-to-sell-paid-discovery-before-freelance-web-development-proposal/", calculator, 1],
];

for (const [page, href, count] of locations) {
  const found = await inspectLink(page, href, count);
  console.info("PASS " + page + ": " + found + " anchor(s) to " + href);
}

// Make the free tool discoverable from site-wide navigation, not just articles.
// Validate the generated HTML on both the homepage and the calculator page.
for (const route of ["/", calculator]) {
  const html = await readFile(path.join(outputRoot, route.slice(1), "index.html"), "utf8");
  for (const navName of ["Primary", "Mobile"]) {
    const navMarkup = html.match(new RegExp(
      '<nav\\b[^>]*aria-label="' + navName + '"[^>]*>[\\s\\S]*?<\\/nav>', "i",
    ))?.[0];
    assert.ok(navMarkup, route + ": " + navName + " navigation missing");
    assert.ok(navMarkup.includes('href="' + calculator + '"'),
      route + ": " + navName + " navigation has no pricing calculator link");
  }
  const footerMarkup = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0];
  assert.ok(footerMarkup?.includes('href="' + calculator + '"'),
    route + ": footer has no pricing calculator link");
  console.info("PASS " + route + ": desktop navigation, mobile navigation, and footer link to calculator");
}

// Preview builds intentionally lack Lemon Squeezy credentials and cannot
// render live checkout URLs; ensure the original CTA usage was not changed.
const paidSource = await readFile(
  path.resolve("src/pages/products/web-developer-pricing-system.astro"), "utf8",
);
assert.ok(
  paidSource.includes('<ProductCTA product={product} location="value" label="Get the Pricing System" />'),
  "Pricing product value CTA must remain intact",
);
assert.ok(
  paidSource.includes('<ProductCTA product={product} location="final" label="Get the Pricing System" />'),
  "Pricing product final CTA must remain intact",
);
console.info("PASS paid pricing-product CTA components preserved.");
