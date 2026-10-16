import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";

const expectedState = process.argv[2] || "hidden";
assert.ok(["hidden", "indexed"].includes(expectedState), "Pass hidden or indexed");
const target = "https://www.developerbusinesslab.com/tools/freelance-project-pricing-calculator/";
const sitemapPaths = [];
async function discover(dir, depth = 0) {
  if (depth > 3) return;
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch (error) { if (error.code === "ENOENT") return; throw error; }
  for (const item of entries) {
    const full = join(dir, item.name);
    if (item.isDirectory()) await discover(full, depth + 1);
    else if (item.isFile() && /^sitemap.*\.xml$/.test(basename(full))) sitemapPaths.push(full);
  }
}
await discover("dist");
assert.ok(sitemapPaths.length > 0, "No generated sitemap XML was found in the full site build");
const docs = await Promise.all(sitemapPaths.map(p => readFile(p, "utf8")));
const hits = docs.flatMap((doc,i) => doc.includes(target) ? [sitemapPaths[i]] : []);
const page = await readFile("dist/client/tools/freelance-project-pricing-calculator/index.html", "utf8");
const robots = [...page.matchAll(/<meta\b[^>]*name=["']robots["'][^>]*>/gi)].map(x=>x[0]);
const hasNoindex = robots.some(x=>/noindex/i.test(x));
if (expectedState === "hidden") {
  assert.equal(hits.length, 0, "Unreleased calculator must be excluded from all built sitemaps");
  assert.ok(hasNoindex, "Unreleased calculator must have noindex");
} else {
  assert.equal(hits.length, 1, "Released calculator must have exactly one sitemap entry");
  assert.ok(!hasNoindex, "Released calculator must not have noindex");
}
assert.match(page, /<link\s+rel="canonical"\s+href="https:\/\/www\.developerbusinesslab\.com\/tools\/freelance-project-pricing-calculator\/"/i);
console.log("PASS " + expectedState + ": " + sitemapPaths.join(", ") + "; URL hits=" + hits.length + "; noindex=" + hasNoindex);
