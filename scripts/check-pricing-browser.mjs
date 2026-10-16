/**
 * Browser QA for the release-candidate pricing calculator.
 * This script intentionally launches a local Astro development server;
 * it makes no production changes or real GA4 requests.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const site = "http://127.0.0.1:4329";
const route = "/tools/freelance-project-pricing-calculator/";
const errors = [];
const server = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4329"], {
  env: { ...process.env, CI: "true" },
  stdio: ["ignore", "pipe", "pipe"],
  detached: true, // Own process group: npm invokes the Astro child process.
});
let serverOutput = "";
for (const channel of [server.stdout, server.stderr]) {
  channel.setEncoding("utf8");
  channel.on("data", (chunk) => { serverOutput = (serverOutput + chunk).slice(-16000); });
}

async function waitForServer() {
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error("Astro server exited: " + serverOutput);
    try {
      const response = await fetch(site + route, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {}
    await delay(250);
  }
  throw new Error("Astro server unavailable: " + serverOutput);
}
const gaNames = async (page) => page.evaluate(() =>
  (window.__qaEvents || []).filter((event) => event[0] === "event").map((event) => event[1]),
);
async function browserContext(browser, consent, viewport = { width: 1280, height: 800 }) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: "reduce",
    permissions: ["clipboard-read", "clipboard-write"],
  });
  await context.addInitScript((value) => {
    window.localStorage.setItem("dbl_analytics_consent", value);
    window.__qaEvents = [];
    window.__dblGaConfigured = true; // Prevent network loading GA4 in QA.
    window.gtag = (...args) => window.__qaEvents.push(args);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text) => { window.__qaClipboard = text; } },
    });
  }, consent);
  return context;
}
async function hydrate(context) {
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push("Browser JS error: " + error.message));
  await page.goto(site + route);
  await page.locator("#pricing-annualCompensation").waitFor();
  await page.getByRole("button", { name: "Reset to example" }).waitFor();
  return page;
}
let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });

  const context = await browserContext(browser, "accepted");
  const page = await hydrate(context);
  const results = page.locator('[aria-labelledby="pricing-results-heading"]');
  const copy = page.getByRole("button", { name: "Copy summary" });
  const print = page.getByRole("button", { name: "Print estimate" });

  assert.equal(await page.locator("main h1").count(), 1);
  assert.equal(await page.locator('meta[name="robots"]').count(), 0);
  assert.equal(await page.getByRole("heading", { name: "How to use this calculator" }).count(), 1);
  assert.equal(await page.getByRole("heading", { name: "Your income target" }).count(), 1);
  assert.equal(await page.getByRole("heading", { name: "The overrun test" }).count(), 1);
  assert.equal(await page.getByText("$86.96 needed per billable hour", { exact: false }).count(), 1);
  assert.equal(await page.getByText("What you want to pay yourself each year (USD)").count(), 1);
  assert.match(await results.innerText(), /\$7,200/);
  assert.match(await results.innerText(), /72 hours/);
  assert.match(await results.innerText(), /\$93\.53/);
  assert.equal(await page.locator("#pricing-overrun").inputValue(), "20");
  assert.equal((await gaNames(page)).filter((name) => name.startsWith("pricing_calc_")).length, 0);
  console.info("PASS default worked example, hydration, indexable page and no default GA4 events");

  const report = await new AxeBuilder({ page }).include("#calculator")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  assert.equal(report.violations.length, 0, "Calculator accessibility violations: " +
    JSON.stringify(report.violations.map((v) => ({
      id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target).slice(0, 4),
    }))));
  console.info("PASS automated WCAG-calculator accessibility scan");

  const slider = page.locator("#pricing-overrun");
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await slider.inputValue(), "25");
  assert.match(await results.innerText(), /\$7,200/);
  assert.match(await results.innerText(), /75 hours/);
  assert.match(await results.innerText(), /At 25% extra time/);
  assert.match(await results.innerText(), /quote remains \$7,200/);
  let events = await gaNames(page);
  assert.equal(events.filter((name) => name === "pricing_calc_overrun").length, 1);
  assert.equal(events.filter((name) => name === "pricing_calc_start").length, 1);
  assert.equal(events.filter((name) => name === "pricing_calc_complete").length, 0);
  await page.keyboard.press("ArrowRight");
  assert.equal((await gaNames(page)).filter((name) => name === "pricing_calc_overrun").length, 1);
  console.info("PASS keyboard slider, fixed quote, analytics once and no slider-only completion");

  const compensation = page.locator("#pricing-annualCompensation");
  await compensation.fill("");
  await compensation.blur();
  assert.equal(await copy.isDisabled(), true);
  assert.equal(await print.isDisabled(), true);
  assert.equal(await compensation.getAttribute("aria-invalid"), "true");
  assert.ok((await compensation.getAttribute("aria-describedby"))?.includes("pricing-annualCompensation-error"));
  assert.equal((await gaNames(page)).filter((name) => name === "pricing_calc_complete").length, 0);
  await compensation.fill("80000");
  await page.waitForFunction(() =>
    window.__qaEvents.some((args) => args[0] === "event" && args[1] === "pricing_calc_complete"));
  assert.match(await results.innerText(), /\$7,200/);
  assert.equal((await gaNames(page)).filter((name) => name === "pricing_calc_complete").length, 1);
  console.info("PASS invalid/valid calculation, field error semantics, one valid-completion event");

  await copy.click();
  await page.waitForFunction(() => window.__qaClipboard?.includes("Internal planning estimate"));
  assert.match(await page.evaluate(() => window.__qaClipboard), /\$7,200/);
  assert.equal((await gaNames(page)).filter((name) => name === "pricing_calc_copy").length, 1);

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => { throw new Error("permission denied"); } },
    });
  });
  await copy.click();
  await page.locator("#pricing-manual-summary").waitFor();
  assert.match(await page.locator("#pricing-manual-summary").inputValue(), /\$7,200/);
  assert.equal((await gaNames(page)).filter((name) => name === "pricing_calc_copy").length, 1);
  console.info("PASS copied report and permission-rejected manual-copy fallback");

  await page.evaluate(() => { window.__qaPrint = 0; window.print = () => window.__qaPrint++; });
  await print.click();
  assert.equal(await page.evaluate(() => window.__qaPrint), 1);
  assert.equal((await gaNames(page)).filter((name) => name === "pricing_calc_print").length, 1);
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator('article[aria-labelledby="pricing-print-heading"]').isVisible(), true);
  assert.equal(await page.locator('#pricing-annualCompensation').isVisible(), false);
  await page.emulateMedia({ media: "screen" });
  console.info("PASS print-dialog invocation and print-only report visibility");

  await page.getByRole("button", { name: "Start blank" }).click();
  assert.equal(await compensation.inputValue(), "");
  assert.equal(await copy.isDisabled(), true);
  assert.equal(await print.isDisabled(), true);
  await page.getByRole("button", { name: "Reset to example" }).click();
  assert.equal(await compensation.inputValue(), "80000");
  assert.equal(await slider.inputValue(), "20");
  assert.match(await results.innerText(), /\$7,200/);
  assert.equal((await gaNames(page)).filter((name) => name === "pricing_calc_complete").length, 1);
  console.info("PASS blank and example reset without repeat analytics milestones");

  const sent = await page.evaluate(() => window.__qaEvents
    .filter((args) => args[0] === "event" && args[1].startsWith("pricing_calc_")));
  for (const [, event, params] of sent) {
    assert.ok([
      "pricing_calc_start", "pricing_calc_complete", "pricing_calc_overrun",
      "pricing_calc_copy", "pricing_calc_print",
    ].includes(event));
    assert.equal(params.tool_id, "freelance_project_pricing_calculator");
    assert.equal(params.source_page, route);
    assert.deepEqual(Object.keys(params).sort().filter((key) => ![
      "tool_id", "source_page", "cta_location",
    ].includes(key)), []);
  }
  console.info("PASS finite, privacy-safe GA4 parameters");

  await context.close();

  const deniedContext = await browserContext(browser, "rejected");
  const deniedPage = await hydrate(deniedContext);
  await deniedPage.locator("#pricing-annualCompensation").fill("81000");
  await deniedPage.locator("#pricing-overrun").focus();
  await deniedPage.keyboard.press("ArrowRight");
  await deniedPage.getByRole("button", { name: "Copy summary" }).click();
  assert.equal((await gaNames(deniedPage)).filter((name) => name.startsWith("pricing_calc_")).length, 0);
  console.info("PASS consent-rejected browser scenario");
  await deniedContext.close();

  const mobile = await browserContext(browser, "rejected", { width: 320, height: 700 });
  const mobilePage = await hydrate(mobile);
  const width = await mobilePage.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    calculator: document.getElementById("calculator")?.scrollWidth,
  }));
  assert.ok(width.document <= width.viewport + 1, "320px horizontal overflow: " + JSON.stringify(width));
  await mobilePage.setViewportSize({ width: 667, height: 375 });
  assert.ok(await mobilePage.getByRole("button", { name: "Start blank" }).isVisible());
  console.info("PASS 320px/mobile landscape layouts without horizontal overflow");
  await mobilePage.setViewportSize({ width: 640, height: 800 });
  await mobilePage.evaluate(() => { document.documentElement.style.zoom = "200%"; });
  const zoom = await mobilePage.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    zoom: getComputedStyle(document.documentElement).zoom,
  }));
  assert.equal(zoom.zoom, "2");
  assert.ok(zoom.document <= zoom.viewport + 1, "200% zoom caused horizontal overflow: " + JSON.stringify(zoom));
  console.info("PASS 200% CSS zoom reflow in 640px viewport (320 CSS px effective)");
  await mobile.close();

  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const plain = await noJS.newPage();
  await plain.goto(site + route);
  const fallback = plain.locator("#calculator noscript p");
  assert.match(await fallback.textContent(), /JavaScript is disabled/);
  assert.equal(await fallback.isVisible(), true, "No-JavaScript explanatory paragraph must be visible");
  assert.equal(await plain.getByRole("heading", { name: "How the math works" }).isVisible(), true);
  console.info("PASS no-JavaScript guidance and server-rendered editorial copy");
  await noJS.close();
  assert.deepEqual(errors, []);
  console.info("PASS all calculator Chromium QA scenarios");
} finally {
  if (browser) await browser.close();
  // Terminate the entire npm/Astro process group. Killing only npm leaves the
  // child dev server holding stdout/stderr pipes and prevents Node from exiting.
  if (server.pid) {
    try { process.kill(-server.pid, "SIGTERM"); }
    catch { server.kill("SIGTERM"); }
  }
  server.stdout.destroy();
  server.stderr.destroy();
}
