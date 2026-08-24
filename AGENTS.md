# Prospect Foundry — Agent Instructions

This file contains the non-negotiable engineering instructions for coding agents working in this repository.

## Required reading

Before planning, coding, refactoring, or making product/content decisions, read the complete current website specification:

**`docs/PRODUCT_SPEC.md`**

That file is the source of truth for:

- Prospect Foundry's umbrella positioning
- the complete product catalog and product families
- the AI Prospecting four-tier ladder
- product statuses and bundles
- AIDA product-page requirements
- homepage and Start Here content architecture
- routes and information architecture
- design direction
- content collections
- commerce behavior
- SEO
- accessibility
- performance
- launch scope and acceptance criteria

Do not rely on summaries of the product spec. Read the file itself before implementation work.

If a later explicit user instruction conflicts with the product spec or this file, the later instruction wins.

---

## Repository stack

Preserve the existing stack:

- Astro 7
- TypeScript
- Tailwind CSS 4
- Svelte 5 integration
- Starwind UI
- Tabler Icons
- Vercel adapter

Do not replace Astro with Next.js, SvelteKit, React, or another framework without an explicit instruction.

Default to static Astro. Use Svelte only where genuine client-side state is required.

---

## Development commands

When starting the development server, use background mode:

```sh
astro dev --background
```

Manage it with:

```sh
astro dev status
astro dev logs
astro dev stop
```

Before considering implementation work complete, run the production build and fix all build errors.

---

# UI and Styling Rules

These rules are mandatory.

## 1. Starwind is the component primitive library

Use **Starwind UI as the default source for standard UI primitives**.

Before hand-building a common component, determine whether Starwind provides it.

Use Starwind where available for categories such as:

- buttons
- badges
- cards
- accordions
- dropdown/navigation menus
- dialogs/sheets when needed
- tooltips when needed
- tables when appropriate
- form controls if forms are introduced

Install components through the documented Starwind CLI, for example:

```sh
npx starwind@latest add button
```

Generated Starwind components belong in:

```text
src/components/starwind
```

Project-specific components such as `ProductCard`, `ProductHero`, `ProductFamilyCard`, `ProductPath`, `LeadExample`, and `WorkflowDiagram` are composition components. They should compose Starwind primitives where applicable rather than reimplementing standard UI behavior from scratch.

Custom semantic Astro markup is appropriate when there is no relevant Starwind primitive, especially for content layouts, decision trees, and diagrams.

Do not copy random third-party component HTML when Starwind already provides the primitive.

---

## 2. Tailwind utility classes only in components/pages

All visual styling in `.astro` and `.svelte` components must use Tailwind utility classes.

Forbidden:

- `<style>` blocks in Astro files
- `<style>` blocks in Svelte files
- inline `style="..."` attributes for visual styling
- CSS modules
- per-component CSS files
- page-specific custom CSS files
- raw hex/rgb/hsl color values in component markup
- repeated arbitrary Tailwind values that should be theme tokens

Do not add CSS to a component to “finish” a design. Express the design through Tailwind classes and the established theme.

---

## 3. One approved stylesheet: `src/styles/starwind.css`

`src/styles/starwind.css` is the single project stylesheet and theme entry point.

It may contain only shared Tailwind/Starwind infrastructure such as:

- `@import "tailwindcss"`
- Starwind-required imports/plugins
- `@custom-variant`
- `@theme` and `@theme inline`
- semantic CSS variable definitions in `:root` / `.dark`
- minimal global `@layer base` rules
- keyframes required by Starwind/components

Do not create a second `global.css` unless an explicit later requirement changes this architecture.

No page-specific styling belongs in `starwind.css`.

---

## 4. Tailwind v4 theme is required

This project uses Tailwind CSS v4's CSS-first theme model.

Do **not** create a Tailwind v3-style `tailwind.config.js` just to define colors or theme values.

Extend the existing `@theme inline` block in `src/styles/starwind.css` when new reusable design tokens are required.

Starwind's existing semantic token contract must remain the foundation:

```text
background
foreground
card
card-foreground
popover
popover-foreground
primary
primary-foreground
primary-accent
secondary
secondary-foreground
secondary-accent
muted
muted-foreground
accent
accent-foreground
info
info-foreground
success
success-foreground
warning
warning-foreground
error
error-foreground
border
input
outline
```

The site is dark-first. Components consume tokens through semantic Tailwind classes such as:

```text
bg-background
text-foreground
bg-card
text-card-foreground
text-muted-foreground
border-border
bg-primary
text-primary-foreground
bg-secondary
text-secondary-foreground
bg-error
text-error-foreground
ring-outline
```

Opacity modifiers on semantic tokens are allowed.

Avoid raw palette classes when an appropriate semantic token exists. Do not use arbitrary colors such as `bg-[#0b0f14]` or `text-[#f4f4f5]`.

---

## 5. Avoid arbitrary Tailwind values

Use Tailwind's established scales and project theme tokens.

Avoid one-off values such as:

```text
text-[13px]
max-w-[1180px]
rounded-[18px]
tracking-[0.13em]
shadow-[...]
```

If a non-standard value is genuinely repeated and necessary, promote it into the Tailwind v4 theme so it becomes a named design token.

---

## 6. Theme initialization

Import `src/styles/starwind.css` once in the shared base layout.

Use Starwind's Astro theme initialization mechanism where required by the installed Starwind version.

The visual product is dark-first. Do not implement a theme toggle unless explicitly requested.

---

# Architecture Rules

## Astro first

Use Astro components for static UI and page composition.

Do not use Svelte for:

- hero sections
- product cards
- product grids
- pricing
- static comparison tables
- decision trees
- workflow diagrams
- ordinary CTAs
- article layouts
- footer content

Use Svelte only when a feature genuinely requires persistent browser-side state or interaction that cannot be cleanly handled by Astro/Starwind behavior.

Do not hydrate static content.

## No CMS or application backend unless explicitly required

Do not add:

- Sanity
- WordPress
- Contentful
- Supabase
- Firebase
- website database
- custom authentication
- user accounts
- customer dashboard
- custom payment backend

The public site is static-first and uses Lemon Squeezy for checkout and protected paid PDF delivery unless a later instruction changes commerce.

The larger catalog is not justification for adding a CMS or backend. Use structured local content.

## Content source of truth

Use Astro content collections for repeating content:

```text
products
bundles
articles
faqs
```

Use local images from `src/assets` with Astro's image pipeline.

Do not store sellable PDF files in public website paths.

## Product architecture

Prospect Foundry is now a **multi-product technical-business publishing brand**, not a site centered on one four-guide product family.

Important rules:

- Every available sellable product gets its own dedicated product page.
- Product pages use AIDA as the persuasion architecture.
- Products are organized into families and by customer problem/stage.
- `Developer Marketing Quickstart` is the primary free email-acquisition asset.
- The AI Prospecting System remains a four-tier product family inside Prospect Foundry.
- The AI Prospecting family gets one family/comparison page plus four individual tier pages.
- Preserve the exact existing AI Prospecting tier names and technical boundaries from `docs/PRODUCT_SPEC.md`.
- Do not imply Tier 4 is automatically the correct choice; recommend the lowest tier that matches the buyer's needs.
- Bundles are first-class commerce products when finalized.
- Product status must support `available`, `coming-soon`, and `planned`.
- Do not create fake checkout CTAs for unfinished products.

## Commerce

Lemon Squeezy store name:

**Prospect Foundry**

Centralize product and bundle prices and checkout URLs. Never duplicate prices or checkout URLs across templates.

Do not assume there are only four Lemon Squeezy products anymore.

---

# Content and Conversion Rules

## AIDA product-page requirement

Every product sales page must follow this persuasion sequence without necessarily displaying these labels:

```text
ATTENTION
↓
INTEREST
↓
DESIRE
↓
ACTION
```

AIDA must remain practical and evidence-based, not hype-driven.

Product pages should generally include:

- product family / context
- product title
- outcome-oriented hero
- intended audience
- price and format
- current problem / situation
- why common approaches fail where relevant
- system or methodology
- capabilities the reader will gain
- actual contents
- implementation workflow
- genuine previews where available
- who it is for
- who it is not for
- legitimate proof where useful
- product-specific FAQ
- explicit CTA
- relevant next or related products

Do not lead with a table of contents before establishing relevance and outcome.

## Homepage and discovery

The homepage must position Prospect Foundry as the umbrella brand and route visitors by current business bottleneck. It must not revolve around AI Prospecting alone.

The site must include a `Start Here` experience that helps visitors find the correct next product based on problems such as offer, pricing, acquisition, prospecting automation, sales, recurring revenue, SaaS validation, SaaS launch, first customers, or AI-assisted operations.

Avoid a giant equal-weight grid of products as the primary discovery mechanism.

## Content integrity

Do not invent:

- testimonials
- customer logos
- customer counts
- revenue numbers
- response/conversion rates
- guarantees
- product capabilities
- extra downloads
- external tool pricing
- fake screenshots
- legal conclusions
- bundle contents that have not been finalized
- finished-product details for products still marked planned

If required commercial content is unknown, omit it or use an explicit development placeholder rather than fabricating it.

The site must not make guaranteed-client, guaranteed-customer, passive-income, spam-evasion, or guaranteed-revenue claims.

Proof may be first-party or credible external proof. Never imply externally sourced proof is a Prospect Foundry customer result.

---

# Accessibility and Performance

Target WCAG 2.2 AA.

Build accessibility into the components from the start:

- semantic landmarks
- logical headings
- keyboard behavior
- visible focus states
- correct Starwind component usage
- sufficient contrast
- accessible menus/accordions/tables
- meaningful alt text
- reduced-motion support
- product-family distinctions that do not rely solely on color

Performance requirements:

- static rendering wherever practical
- minimal client JavaScript
- Astro image optimization
- no unnecessary third-party scripts
- no SPA conversion
- no hydration of static sections
- minimize layout shift

---

# Repository Shape

Use this general structure unless the existing implementation creates a strong reason to adjust it:

```text
src/
├── assets/
├── components/
│   ├── articles/
│   ├── layout/
│   ├── marketing/
│   ├── products/
│   ├── starwind/
│   └── ui/
├── content/
│   ├── articles/
│   ├── bundles/
│   ├── faqs/
│   └── products/
├── layouts/
├── lib/
│   └── utils/
├── pages/
├── styles/
│   └── starwind.css
├── content.config.ts
└── config.ts
```

---

# Working Rules

1. Read `docs/PRODUCT_SPEC.md` before implementing product, UI, navigation, content, commerce, or information-architecture work.
2. Preserve Astro, Tailwind v4, Starwind, and the existing Vercel deployment approach.
3. Treat Prospect Foundry as a multi-product brand; AI Prospecting is one product family, not the entire brand.
4. Give every available product its own dedicated product page.
5. Use AIDA for product-page persuasion architecture.
6. Preserve the four exact AI Prospecting tier names and boundaries defined in the product spec.
7. Use Starwind primitives first where a suitable component exists.
8. Use Tailwind utility classes for all component/page styling.
9. Never add `<style>` blocks to components.
10. Use semantic design-token classes instead of raw colors.
11. Keep the Tailwind theme in `src/styles/starwind.css` using Tailwind v4 `@theme` conventions.
12. Keep static UI in Astro.
13. Do not add infrastructure the public commerce site does not need.
14. Do not fabricate content or commercial claims.
15. Centralize prices and checkout URLs.
16. Preserve or intentionally redirect established AI Prospecting URLs when restructuring routes.
17. Run the production build before declaring implementation work complete.
18. Validate the implementation against the Definition of Done in `docs/PRODUCT_SPEC.md`.
