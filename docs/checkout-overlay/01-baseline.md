# Checkout overlay — baseline (Prompt 01)

**Date:** 2026-10-19  
**Repository:** `bwoodson72/lead-automation-system`  
**Starting branch:** `master` at `ec2b384159fe2d265d665b139cb9f0bfedcb6b79`  
**Implementation branch:** `fix/lemon-squeezy-overlay`  
**Scope:** Read-only inventory and reproduction plan. No checkout code changes.

## Observed symptom (user report, not independently reproduced)

A Developer Business Lab checkout click can navigate the **browser tab** away from `developerbusinesslab.com` to a full-page URL like `developerbusinesslab.lemonsqueezy.com/checkout/cart/...` instead of displaying a checkout overlay above the site. In the full-page checkout, the circular X at the upper right did not return the user to Developer Business Lab; the browser Back button did.

A separate report of Opera retaining/locking a previous checkout email, and a JavaScript exception originating inside Lemon Squeezy's checkout application, **are out of scope** for this prompt and do not establish the cause of the full-page navigation.

## Current architecture — inspected facts

| Concern | Inspected path | Current behavior |
| --- | --- | --- |
| Shared script and client-side routing | `src/layouts/BaseLayout.astro` | Imports and renders Astro `<ClientRouter />`; renders `<script is:inline src="https://assets.lemonsqueezy.com/lemon.js" defer></script>` only when `enableCheckoutOverlay` is true. No `LemonSqueezy.Refresh()` or `astro:page-load` reinitialization exists in this layout. |
| Centralized product URL | `src/lib/lemon-squeezy.ts` | `resolveProductCommerce()` exposes `checkoutUrl` from the generated Lemon Squeezy catalog, only for published/live purchasable products. This file does not initialize the overlay. |
| Individual product CTA, including free resource | `src/components/products/ProductCTA.astro` | Direct `<a href={commerce.checkoutUrl!}>` with `lemonsqueezy-button` class for purchasable free and paid products. Includes existing `data-event`, GA4, product, and CTA-placement attributes. |
| Product hero card | `src/components/products/ProductHeroPurchaseCard.astro` → `ProductCTA.astro` | Reuses the shared CTA, rather than an independent checkout implementation. |
| Free Quickstart | `src/pages/free.astro` | Calls `resolveProductCommerce()`, enables checkout overlay when purchasable; hero purchase card and final section provide the Quickstart CTA. |
| General product pages | `src/pages/products/[slug].astro` | Enable overlay for purchasable products; hero card and final CTA use the shared CTA. |
| Generic bundles | `src/pages/bundles/[slug].astro` | Enable overlay for purchasable bundles; hero, inclusion section, and final CTA link to `merch.checkoutUrl` with `lemonsqueezy-button`. |
| Specialized bundles | `src/pages/bundles/freelancer-starter-bundle.astro`, `src/pages/bundles/freelancer-sales-system.astro`, `src/pages/bundles/freelance-developer-business-system.astro` | Each sets `enableCheckoutOverlay={merch.purchasable}`, uses `lemonsqueezy-button`, and provides purchase links in hero, value, and final sections. |
| Bundle upsell/progression | `src/components/products/BundleProgressionCard.astro` | Renders a direct purchasable bundle link with `lemonsqueezy-button` and the centralized bundle checkout URL; this card is a secondary checkout entry point on applicable product pages. |
| Bundle commerce source | `src/lib/bundle-merchandising.ts` | Supplies `merch.checkoutUrl` using centralized commerce metadata. |

The index/discovery product cards, `src/components/products/ProductCard.astro`, `src/components/products/FeaturedProductCard.astro`, `src/components/products/FlagshipProductFeature.astro`, and `src/components/products/BundleOfferCard.astro` were also inspected. These are not additional direct Lemon Squeezy checkout button implementations in the inspected versions.

The built-in GitHub code-search endpoint returned no matches for the relevant search terms despite known references in the files. Therefore this inventory is based on direct inspection of the named routes/components and the repository tree; a successful full-repository text search is **not** claimed.

## Why normal navigation can occur

The checkout controls are ordinary anchors with valid Lemon Squeezy URLs. When Lemon.js successfully intercepts them, an overlay is expected. If interception does not happen, the browser naturally follows their `href` and navigates to the hosted checkout. That fallback explains the *form* of the symptom, but not yet its trigger.

## Hypotheses (UNCONFIRMED)

1. **Script loading or initialization:** The currently used Lemon.js asset URL, load timing, or a blocked/failed request may leave `lemonsqueezy-button` anchors without active interception.
2. **Astro transitions:** Because `<ClientRouter />` replaces page content during internal navigation, listeners installed on earlier DOM elements may not be attached to newly rendered checkout links. The current layout does not call Lemon Squeezy's documented refresh API after page loads.
3. **Conditional script scope:** The script is rendered only when `enableCheckoutOverlay` is true. Client-side transitions between non-commerce and commerce pages may expose lifecycle/order issues.

These are hypotheses, not demonstrated root causes. Do not attribute full-page navigation to the checkout application's internal `useCheckoutState` exception without independent evidence.

## Reproduction / browser test matrix — ALL NOT RUN

Use a published product or the free Quickstart. Tests should be non-transactional unless specifically authorized. Inspect URL and the site behind the checkout; do not infer overlay success merely from the checkout's appearance.

| ID | Manual procedure | Expected overlay result | Status |
| --- | --- | --- | --- |
| A | Open `https://www.developerbusinesslab.com/free/` directly in a clean Chrome window; click **Get the Free Quickstart**. | Address bar stays at `developerbusinesslab.com`; checkout sits above the page. | **NOT RUN** |
| B | Repeat A on a paid `/products/[slug]/` page, without completing a purchase. | Same overlay behavior. | **NOT RUN** |
| C | Repeat A on a purchasable generic or specialized `/bundles/[slug]/` page. | Same overlay behavior. | **NOT RUN** |
| D | Navigate from the homepage or Products index to the Quickstart/product page using internal links (Astro transition), then click a checkout CTA. | Checkout still opens as an overlay without a hard refresh. | **NOT RUN** |
| E | Navigate from a product page to another product or bundle; try its hero and final checkout CTAs and any visible bundle-progression CTA. | Every dynamically rendered checkout link opens the overlay. | **NOT RUN** |
| F | With the overlay open, click the visible close control, then reopen. | Overlay closes; same product page remains available; reopen works. | **NOT RUN** |
| G | Repeat A–F in Opera, then compare with Chrome. | Consistent overlay activation and dismissal. | **NOT RUN** |
| H | On a product page, hard-refresh and inspect DevTools network and console for Lemon.js load errors; confirm presence of `window.LemonSqueezy` when expected. | Lemon.js loads, initializes, and binds checkout links. | **NOT RUN** |

When these tests are executed, record: browser/version, entry URL, path taken (direct or internal navigation), current address bar before/after click, whether original site is behind checkout, close behavior, and relevant Lemon.js load/initialization errors.

## Scope protections for subsequent prompts

Preserve all existing checkout URLs, pricing, the Lemon Squeezy merchant/payment and digital delivery flow, affiliate integration, CSS/button treatment, and current GA4 attributes. Do not change Kit, customer email/autofill, payment fields, analytics code, or storefront copy. Do not merge or deploy until later explicitly authorized.

## Verification performed for Prompt 01

- **Performed:** Read the repository's `AGENTS.md` and `docs/PRODUCT_SPEC.md`; inspected the shared layout, product and bundle CTA paths, the checkout resolver, and relevant secondary entries. Established the repair branch from current `master`.
- **Not performed:** Browser checkout tests (no browser runtime available in this execution), `npm run check`, `npm run build`, `npm test`. The repository cannot be cloned into the local execution environment because `github.com` DNS resolution failed; the connected GitHub API was used for source inspection instead.
- **Change scope:** This new markdown file only. No executable/source files modified.

**Checkpoint:** Stop after committing this baseline; the functional fix begins at Prompt 02.
