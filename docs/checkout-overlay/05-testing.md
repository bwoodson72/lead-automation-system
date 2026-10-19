# Checkout overlay — automated regression checks (Prompt 05)

**Repository:** `bwoodson72/lead-automation-system`  
**Branch:** `fix/lemon-squeezy-overlay`  
**Scope:** Automated coverage for the Lemon.js loader, Astro lifecycle coordinator, and existing checkout-link markup. Does not alter payment processing, checkout URLs, analytics, Kit, affiliates, styling, or actual checkout behavior.

## Run

```sh
npm run test:checkout
```

This runs `node --experimental-strip-types --test scripts/checkout-overlay.test.mjs`, using Node's built-in test runner. It does **not** change the existing `npm test` or `test:unit` commands. Install the project's existing dependencies first (`npm ci`); on Node versions without `node:module.stripTypeScriptTypes`, the test harness uses the repository's already-declared `typescript` dependency to evaluate the coordinator inside an isolated mock context.

## Automated coverage

- The shared layout contains `<ClientRouter />` and one import of the checkout coordinator.
- Exactly one official deferred `https://app.lemonsqueezy.com/js/lemon.js` script tag is present across project source files; the old CDN URL must not return.
- `astro:page-load` registration and the public Lemon Squeezy `Refresh()` call remain wired up.
- The free and paid shared `ProductCTA.astro` checkout anchors retain the Lemon class on the anchor itself, the provider checkout URL expression, and their existing event attributes.
- The general bundle page and each of the three specialized bundle pages retain their hero/mid-page/final direct checkout triggers with Lemon interception.
- The bundle-progression checkout uses a `TextLink` that forwards the Lemon class to an actual `<a>`; informational browse links remain normal navigation.
- A deliberate mutation that removes the Lemon class from a known product or bundle trigger causes the assertion to fail.
- In isolated browser-API mocks, the **actual TypeScript lifecycle coordinator source** refreshes once on a direct `astro:page-load`, once on each subsequent navigation, handles a deferred CDN load without duplicate completion listeners, and does not crash following script load error.

These are source-level assertions and simulated lifecycle behaviors. They cannot demonstrate that the real Lemon Squeezy iframe appears, that the X closes it, or that browsers with privacy extensions behave as expected.

## Manual verification still required (Prompt 06)

1. On a Vercel preview, open the Quickstart directly and then via internal Astro navigation; clicking each checkout CTA should retain `developerbusinesslab.com` in the address bar and open an overlay above the site.
2. Repeat for a paid product, generic bundle, specialized bundle, and a product-page direct bundle upsell.
3. Close and reopen each overlay; the customer must remain on the original product page.
4. Repeat on Chrome and Opera, with direct loads, client-side transitions, and browser Back/Forward flows. Do not complete paid orders as part of this specific overlay test.
5. If the browser follows the checkout URL, inspect Lemon.js network load, availability of `window.LemonSqueezy.Refresh`, and interception after an Astro page transition.

## Execution notes for this checkpoint

- **Performed:** Inspected the GitHub branch and checkout sources, authored the automated test file, checked JavaScript syntax using `node --check`, and exercised the three lifecycle mock cases against a locally reconstructed copy of the exact committed `src/scripts/lemon-checkout.ts` source. **3/3 lifecycle mock checks passed** after correcting the test harness's module-cache isolation issue.
- **Not performed:** `npm run test:checkout` against a full repository checkout; source-level assertions requiring all Astro templates remain **unverified in the actual repository runtime**. `npm test`, `npm run check`, and `npm run build` were likewise **not run** because authenticated GitHub source inspection is available only through the connector, while the container cannot resolve `github.com` to clone the repository and does not have its dependencies installed.
- **Not performed:** Browser testing on the live site or deployment preview.

## Non-goals

Do not use this test suite to troubleshoot checkout email fields, browser autofill, Lemon Squeezy's internal Vue exceptions, purchase event tracking, or newsletter/Kit subscription behavior. Those issues are intentionally outside this repair series.
