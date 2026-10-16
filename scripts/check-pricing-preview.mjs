/**
 * Release smoke test for Astro's GENERATED static client output, not astro dev.
 * This does not deploy anything or invoke checkout/GA4 network requests.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { createConnection } from "node:net";
import { chromium } from "playwright";

const host = "http://127.0.0.1:4331";
const pagePath = "/tools/freelance-project-pricing-calculator/";
const server = spawn("python3", ["-m","http.server","4331","--bind","127.0.0.1","--directory","dist/client"], {
  stdio: ["ignore","pipe","pipe"], detached: true,
});
let output = "";
for(const channel of [server.stdout, server.stderr]) {
  channel.setEncoding("utf8");
  channel.on("data",(chunk)=>{output=(output+chunk).slice(-6000)});
}
let browser;
try {
  let ready = false;
  for(let n=0;n<60;n++) {
    ready = await new Promise((resolve) => {
      const socket = createConnection({host:"127.0.0.1",port:4331});
      socket.setTimeout(1000);
      socket.once("connect", () => {socket.destroy();resolve(true)});
      socket.once("timeout", () => {socket.destroy();resolve(false)});
      socket.once("error", () => {socket.destroy();resolve(false)});
    });
    if (ready) break;
    await delay(250);
  }
  assert.ok(ready, "Built static preview server did not serve calculator: "+output);
  browser = await chromium.launch({headless:true});
  const context=await browser.newContext({reducedMotion:"reduce"});
  await context.addInitScript(()=>{
    window.localStorage.setItem("dbl_analytics_consent","rejected");
  });
  const page=await context.newPage();
  const pageErrors=[];
  page.on("pageerror",(e)=>pageErrors.push(e.message));
  const res=await page.goto(host+pagePath);
  assert.equal(res.status(),200);
  assert.equal(await page.locator("h1", {hasText:"Freelance Project Pricing Calculator"}).count(),1);
  assert.equal(await page.locator('meta[name="robots"]').count(),0);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"),"https://www.developerbusinesslab.com"+pagePath);
  await page.locator("#pricing-annualCompensation").waitFor({state:"visible"});
  const result=page.locator('[aria-labelledby="pricing-results-heading"]');
  assert.match(await result.innerText(),/\$7,200/);
  await page.getByRole("button",{name:"Start blank"}).click();
  assert.equal(await page.getByRole("button",{name:"Copy summary"}).isDisabled(),true);
  await page.getByRole("button",{name:"Reset to example"}).click();
  assert.match(await result.innerText(),/\$7,200/);
  const productLink=page.getByRole("link",{name:/Explore the Web Developer Pricing System/});
  assert.equal(await productLink.getAttribute("href"),"/products/web-developer-pricing-system/");
  const product=await page.request.get(host+"/products/web-developer-pricing-system/");
  assert.equal(product.status(),200);
  assert.deepEqual(pageErrors,[]);
  await context.close();
  console.log("PASS generated static preview: route, indexability, hydration, resets, quote, reciprocal CTA and product URL");
} finally {
  if(browser)await browser.close();
  if(server.pid) {try{process.kill(-server.pid,"SIGTERM")}catch{server.kill("SIGTERM")}}
  server.stdout.destroy();server.stderr.destroy();
}
