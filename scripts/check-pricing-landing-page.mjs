import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Checks the generated HTML, not merely the Astro source template. */
const route = "tools/freelance-project-pricing-calculator/index.html";
const candidates = [join("dist", "client", route), join("dist", route)];
let html;
let outputPath;
for (const candidate of candidates) {
  try {
    html = await readFile(candidate, "utf8");
    outputPath = candidate;
    break;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
assert.ok(html, `Built calculator HTML not found in: ${candidates.join(", ")}`);

function attr(tag, name) {
  const expression = new RegExp(`(?:\\s|^)${name}=(?:"([^"]*)"|'([^']*)')`, "i");
  const match = tag.match(expression);
  return match?.[1] ?? match?.[2];
}
const tags = (name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => m[0]);
const meta = (name) => tags("meta").find((tag) => attr(tag, "name") === name);
const canonicalUrl = "https://www.developerbusinesslab.com/tools/freelance-project-pricing-calculator/";
const description = "Estimate a sustainable fixed-price web development quote using your billable capacity, total project hours, costs, and contingency. Test what happens when work runs over.";

const title = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
assert.equal(title.length, 1, "The generated HTML must contain exactly one title");
assert.equal(title[0][1], "Freelance Project Pricing Calculator | Developer Business Lab");
assert.equal(attr(meta("description") ?? "", "content"), description);
assert.equal(meta("robots"), undefined, "Released calculator must not carry robots noindex");
const canonicalTags = tags("link").filter((tag) => attr(tag, "rel") === "canonical");
assert.equal(canonicalTags.length, 1, "Exactly one canonical link is required");
assert.equal(attr(canonicalTags[0], "href"), canonicalUrl);

const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
assert.equal(h1.length, 1, "Exactly one page H1 is required");
assert.equal(h1[0][1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), "Freelance Project Pricing Calculator");
assert.match(html, /href="#calculator"/);
assert.match(html, /id="calculator"/);

const prose = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
for (const phrase of [
  "Free · no signup required",
  "How the math works",
  "How to use this calculator",
  "Your income target",
  "The project hours",
  "Your starting quote",
  "The overrun test",
  "$86.96 needed per billable hour",
  "A worked example",
  "What the quote does and doesn't tell you",
  "Freelance project pricing FAQ",
  "1,012 hours",
  "$7,200",
  "JavaScript is disabled",
  "Internal planning estimate",
]) {
  assert.ok(prose.includes(phrase), `Missing server-rendered content: ${phrase}`);
}

const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
const ldJson = scripts.filter(([, opening]) => attr(opening, "type") === "application/ld+json")
  .map(([, , body]) => JSON.parse(body));
const breadcrumbs = ldJson.filter((schema) => schema["@type"] === "BreadcrumbList");
assert.equal(breadcrumbs.length, 1, "Exactly one breadcrumb JSON-LD schema is expected");
assert.deepEqual(breadcrumbs[0].itemListElement.map((item) => item.position), [1, 2]);
assert.equal(breadcrumbs[0].itemListElement[0].item, "https://www.developerbusinesslab.com/");
assert.equal(breadcrumbs[0].itemListElement[1].item, canonicalUrl);
const application = ldJson.find((schema) => schema["@type"] === "WebApplication");
assert.equal(application?.url, canonicalUrl);
assert.equal(application?.isAccessibleForFree, true);
assert.equal(ldJson.filter((schema) => schema["@type"] === "Organization").length, 1);
assert.equal(ldJson.filter((schema) => schema["@type"] === "WebSite").length, 1);

const islands = tags("astro-island");
assert.equal(islands.length, 1, "This page must hydrate only the calculator island");
assert.equal(attr(islands[0], "client"), "load");
console.log(`Validated generated page ${outputPath}`);
console.log("Title, description, canonical, indexable robots, H1, content, breadcrumb/application JSON-LD, and exactly one hydrated island: PASS");