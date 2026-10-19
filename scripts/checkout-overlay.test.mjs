import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as nodeModule from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const CDN_URL = "https://app.lemonsqueezy.com/js/lemon.js";

function walkSources(dir) {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const child = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return walkSources(child);
    return /\.(astro|ts|js|mjs)$/.test(entry.name) ? [child] : [];
  });
}

function assertSharedProductCTA(source) {
  assert.match(source, /checkoutClass\s*=\s*button\(\{\s*class:\s*`lemonsqueezy-button\b/);
  const anchors = source.match(/<a\s+href=\{commerce\.checkoutUrl!\}[\s\S]*?<\/a>/g) ?? [];
  assert.equal(anchors.length, 2, "free and paid products must both have checkout anchors");
  for (const anchor of anchors) {
    assert.match(anchor, /class=\{checkoutClass\}/, "checkout class must be on the anchor");
    assert.match(anchor, /data-event="checkout_click"/);
    assert.match(anchor, /data-ga-event="begin_checkout"/);
  }
}

function assertBundleCheckoutCTAs(source, label) {
  assert.match(source, /checkoutClass\s*=\s*button\(\{\s*class:\s*"lemonsqueezy-button"\s*\}\)/, `${label} must define an overlay class`);
  const checkoutAnchors = source.match(/<a\b[^>]*\bhref=\{merch\.checkoutUrl\}[^>]*>/g) ?? [];
  assert.equal(checkoutAnchors.length, 3, `${label} must retain hero, mid-page, and final checkout anchors`);
  for (const anchor of checkoutAnchors) {
    assert.match(anchor, /class=\{checkoutClass\}/, `${label}: overlay class must be on anchor`);
    assert.match(anchor, /data-event="checkout_click"/, `${label}: tracking event missing`);
  }
}

function fakeBrowser(initialLemon) {
  const events = new Map();
  const scriptEvents = new Map();
  const script = {
    addEventListener(event, listener, opts) {
      const listeners = scriptEvents.get(event) ?? [];
      listeners.push({ listener, once: Boolean(opts?.once) });
      scriptEvents.set(event, listeners);
    },
    fire(event) {
      for (const item of [...(scriptEvents.get(event) ?? [])]) {
        item.listener();
        if (item.once) scriptEvents.set(event, (scriptEvents.get(event) ?? []).filter((x) => x !== item));
      }
    },
    count(event) { return (scriptEvents.get(event) ?? []).length; },
  };
  const document = {
    addEventListener(event, listener) {
      const listeners = events.get(event) ?? [];
      listeners.push(listener);
      events.set(event, listeners);
    },
    querySelector(selector) {
      assert.equal(selector, `script[src="${CDN_URL}"]`);
      return script;
    },
    fire(event) { for (const listener of events.get(event) ?? []) listener(); },
    count(event) { return (events.get(event) ?? []).length; },
  };
  const window = initialLemon ? { LemonSqueezy: initialLemon } : {};
  globalThis.window = window;
  globalThis.document = document;
  return { document, window, script };
}

async function loadCoordinator() {
  // Run the actual source in an isolated DOM mock: Node caches .ts imports by
  // pathname even with different query strings, so fresh imports aren't isolated.
  const source = read("src/scripts/lemon-checkout.ts");
  const js = typeof nodeModule.stripTypeScriptTypes === "function"
    ? nodeModule.stripTypeScriptTypes(source)
    : (await import("typescript")).transpileModule(source, {
        compilerOptions: { target: (await import("typescript")).ScriptTarget.ES2022 },
      }).outputText;
  runInNewContext(js, { window: globalThis.window, document: globalThis.document });
}

test("one official deferred Lemon.js loader is shared site-wide", () => {
  const layout = read("src/layouts/BaseLayout.astro");
  assert.match(layout, /<ClientRouter\s*\/>/);
  assert.match(layout, /<script>\s*import\s+"\.\.\/scripts\/lemon-checkout";\s*<\/script>/);
  assert.match(layout, /<script\s+is:inline\s+src="https:\/\/app\.lemonsqueezy\.com\/js\/lemon\.js"\s+defer\s*><\/script>/);
  const files = walkSources("src");
  const source = files.map(read).join("\n");
  assert.equal((source.match(/<script\b[^>]*\bsrc="https:\/\/app\.lemonsqueezy\.com\/js\/lemon\.js"/g) ?? []).length, 1);
  assert.ok(!source.includes("https://assets.lemonsqueezy.com/lemon.js"), "obsolete CDN must not return");
});

test("coordinator hooks the Astro page-load lifecycle and the Lemon.js public Refresh API", () => {
  const source = read("src/scripts/lemon-checkout.ts");
  assert.equal((source.match(/document\.addEventListener\(\s*"astro:page-load"/g) ?? []).length, 1);
  assert.match(source, /\.Refresh\(\)/);
  assert.match(source, /if \(refreshedNavigation === navigationNumber\) return;/);
  assert.match(source, /script\.addEventListener\(\s*"load"/);
  assert.match(source, /once: true/);
});

test("free and paid product checkout anchors preserve Lemon interception", () => {
  const source = read("src/components/products/ProductCTA.astro");
  assertSharedProductCTA(source);
  assert.match(read("src/pages/free.astro"), /<ProductCTA\s+product=\{product\}/);
  assert.match(read("src/pages/products/[slug].astro"), /<ProductCTA\s+product=/);
  assert.match(read("src/components/products/ProductHeroPurchaseCard.astro"), /<ProductCTA\s+product=\{product\}/);
});

test("generic and specialized bundle checkout anchors preserve Lemon interception", () => {
  for (const path of [
    "src/pages/bundles/[slug].astro",
    "src/pages/bundles/freelancer-starter-bundle.astro",
    "src/pages/bundles/freelancer-sales-system.astro",
    "src/pages/bundles/freelance-developer-business-system.astro",
  ]) {
    assertBundleCheckoutCTAs(read(path), path);
  }
});

test("bundle upsell checkout is intercepted but product discovery is not", () => {
  const upsell = read("src/components/products/BundleProgressionCard.astro");
  assert.match(upsell, /<TextLink\s+href=\{merch\.checkoutUrl\}\s+class="lemonsqueezy-button"/);
  assert.match(read("src/components/ui/TextLink.astro"), /<a\s+href=\{href\}[\s\S]*?class:list=\{\[[\s\S]*?className,/);
  assert.match(upsell, /href=\{`\/bundles\/\$\{bundle\.data\.slug\}\/`\}/);
  assert.doesNotMatch(read("src/components/products/ProductCard.astro"), /lemonsqueezy-button/);
});

test("a missing Lemon checkout class triggers a regression failure", () => {
  const product = read("src/components/products/ProductCTA.astro");
  assert.throws(() => assertSharedProductCTA(product.replace("lemonsqueezy-button", "missing-lemon-class")), { code: "ERR_ASSERTION" });
  const bundle = read("src/pages/bundles/[slug].astro");
  assert.throws(() => assertBundleCheckoutCTAs(bundle.replace("lemonsqueezy-button", "missing-lemon-class"), "mutated bundle"), { code: "ERR_ASSERTION" });
});

test("direct load and repeat Astro navigation refresh once per event", async () => {
  let count = 0;
  const { document, script } = fakeBrowser({ Refresh: () => { count++; } });
  await loadCoordinator();
  assert.equal(document.count("astro:page-load"), 1);
  document.fire("astro:page-load");
  assert.equal(count, 1);
  document.fire("astro:page-load");
  assert.equal(count, 2);
  assert.equal(script.count("load"), 0, "no unnecessary load callbacks");
});

test("late CDN load refreshes latest navigation only once", async () => {
  let count = 0;
  const { document, window, script } = fakeBrowser();
  await loadCoordinator();
  document.fire("astro:page-load");
  document.fire("astro:page-load");
  assert.equal(count, 0);
  assert.equal(script.count("load"), 1, "one load handler while the script is pending");
  window.LemonSqueezy = { Refresh: () => { count++; } };
  script.fire("load");
  assert.equal(count, 1);
  script.fire("load");
  assert.equal(count, 1);
  document.fire("astro:page-load");
  assert.equal(count, 2);
});

test("a failed CDN load does not throw or cause repeated refresh attempts", async () => {
  let count = 0;
  const { document, window, script } = fakeBrowser();
  await loadCoordinator();
  document.fire("astro:page-load");
  assert.equal(script.count("error"), 1);
  script.fire("error");
  assert.equal(count, 0);
  window.LemonSqueezy = { Refresh: () => { count++; } };
  document.fire("astro:page-load");
  assert.equal(count, 1);
});
