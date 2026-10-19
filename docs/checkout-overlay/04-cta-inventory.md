# Checkout overlay — CTA inventory (Prompt 04)

**Date:** 2026-10-19  
**Repository:** `bwoodson72/lead-automation-system`  
**Branch:** `fix/lemon-squeezy-overlay`  
**Prerequisite checkpoint:** Prompt 03, `3a7b0f4529391d0825f694c30d213052d71acfac`  
**Scope:** Audit checkout purchase entry points only; no behavior or styling changes.

## Audit result

**No demonstrated CTA markup defects found.** The existing checkout anchors have Lemon Squeezy's required `lemonsqueezy-button` class on the rendered anchor (either directly or through the shared button/TextLink component) and retain centralized Lemon Squeezy checkout URLs in their `href`. No CTA source changes were made. The lifecycle/script-loading work in Prompts 02–03 is unaffected.

| Entry point | Source / rendering path | Link destination, class, and result |
| --- | --- | --- |
| Free Quickstart hero | `src/pages/free.astro` → `ProductHero.astro` → `ProductHeroPurchaseCard.astro` → `ProductCTA.astro` | When purchasable, shared anchor uses `commerce.checkoutUrl` and `class={checkoutClass}` containing `lemonsqueezy-button`. **PASS (static)** |
| Free Quickstart final CTA | `src/pages/free.astro` → `ProductCTA.astro` | Same free checkout branch; `data-ga-secondary-event="quickstart_checkout_start"` preserved. **PASS (static)** |
| Generic paid product hero/final | `src/pages/products/[slug].astro` → `ProductHero.astro`/`ProductCTA.astro` | Paid branch uses `commerce.checkoutUrl` and the Lemon class. **PASS (static)** |
| Specialized paid product hero/value/final | `src/pages/products/{agency-partnership-playbook,client-acquisition-without-upwork,developer-proposal-closing-kit,developer-sales-playbook,marketing-for-builders,productize-your-dev-skills,social-media-client-acquisition-system,web-developer-pricing-system}.astro` | All inspected specialized product CTAs reuse `ProductHero` and `ProductCTA` rather than building alternative checkout anchors. **PASS (static)** |
| Generic bundle hero/inclusions/final | `src/pages/bundles/[slug].astro` | All three `<a href={merch.checkoutUrl} class={checkoutClass}>` instances receive `lemonsqueezy-button` via `button({ class: "lemonsqueezy-button" })`. **PASS (static)** |
| Freelancer Starter bundle hero/value/final | `src/pages/bundles/freelancer-starter-bundle.astro` | Three centralized checkout anchors with shared Lemon class. **PASS (static)** |
| Freelancer Sales System bundle hero/value/final | `src/pages/bundles/freelancer-sales-system.astro` | Three centralized checkout anchors with shared Lemon class. **PASS (static)** |
| Freelance Developer Business System bundle hero/value/final | `src/pages/bundles/freelance-developer-business-system.astro` | Three centralized checkout anchors with shared Lemon class. **PASS (static)** |
| Direct bundle upsell from a product page | `src/components/products/BundleProgressionCard.astro` → `TextLink.astro` | `TextLink` renders an `<a>` and forwards `class="lemonsqueezy-button"` through `class:list`; checkout `href={merch.checkoutUrl}`. **PASS (static)** |

## Informational links intentionally not intercepted

- `src/components/products/ProductCard.astro`, `FeaturedProductCard.astro`, and `FlagshipProductFeature.astro` link to site product detail pages, not checkout.
- `src/components/products/BundleOfferCard.astro` links to a site bundle detail page, not checkout.
- `src/components/products/BundleProgressionCard.astro` has a **separate** "See the Complete Bundle" informational link pointing to `/bundles/[slug]/` without the Lemon class; this is correct.
- `/products/`, `/bundles/`, the homepage, and the Quickstart's `/products/developer-marketing-quickstart/` redirect have normal internal page-navigation behavior. Do not intercept these links.
- Coming-soon and planned products continue to render their existing Kit updates or placeholder UI, without a fake checkout action.

## URL, style and event integrity

1. `src/lib/lemon-squeezy.ts` resolves product checkout URLs from the generated Lemon catalog and gates purchases on `isLemonProductPurchasable`.
2. `src/lib/bundle-merchandising.ts` resolves bundle checkout URLs via the same centralized commerce metadata.
3. `src/components/starwind/button/variants.ts` accepts the checkout class through `button({ class: ... })`. The existing button appearance was not changed. `src/components/ui/TextLink.astro` forwards its `class` prop to its actual anchor.
4. No checkout click handlers were added or altered. Native `href` navigation remains the intended hosted checkout fallback when Lemon.js cannot intercept.
5. Existing `data-event`, `data-ga-*`, product identifiers, CTA placement markers, labels, prices, and affiliate integration were not edited.

**Limitation:** The generated `src/generated/lemon-catalog.json` file is not committed in the repository. This audit confirms the paths and structural use of checkout URLs, **not** the runtime contents or reachability of every generated live URL.

## Verification performed

- **PASS (static source assertions): 14/14.** Checked shared CTA class and URL branches, tracking markers, upsell link rendering, generic and all three specialized bundle CTA groups, Quickstart/product composition, and commerce resolution.
- **PASS (source audit):** Inspected the files above plus the eight specialized product pages and other relevant site navigation/discovery components. No demonstrated missing Lemon class or wrong anchor destination.
- **NOT RUN:** Manual browser overlay open/close tests, direct-load versus Astro-navigation tests, real checkout URL reachability and rendered DOM inspection. These require a browser against a running deployment.
- **NOT RUN:** `npm run check`, `npm run build`, `npm test`. Only GitHub-connected source access is available; the complete repository checkout and dependencies are absent from the local container.
- **Code changes this prompt:** **None.** This Markdown inventory is the only new file.

## Outcome and handoff

No code fix is justified by the checked CTA markup. Continue with **Prompt 05 — Automated Guardrails**, then preview/browser testing in Prompt 06. The existing Lemon.js script loading and Astro refresh fixes remain on the repair branch; do not merge or deploy from this step.
