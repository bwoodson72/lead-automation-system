# Lead Automation System — Agent Instructions

This file contains the non-negotiable engineering instructions for coding agents working in this repository.

## Required reading

Before planning, coding, refactoring, or making product/content decisions, read the complete V1 specification:

**`docs/PRODUCT_SPEC.md`**

That file is the source of truth for:

- product positioning
- the four guide definitions
- page content
- routes and information architecture
- design direction
- content collections
- commerce behavior
- SEO
- accessibility
- performance
- V1 scope and non-goals
- acceptance criteria

Do not rely on a summary of the product spec. Read the file itself before implementation work.

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

Generated Starwind components belong in the configured directory:

```text
src/components/starwind
```

Project-specific components such as `ProductCard`, `ProductHero`, `LeadExample`, and `WorkflowDiagram` are composition components. They should compose Starwind primitives where applicable rather than reimplementing standard UI behavior from scratch.

Custom semantic Astro markup is appropriate when there is no relevant Starwind primitive, especially for content layouts and diagrams.

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

The site is dark-first. Target semantic values are defined in `docs/PRODUCT_SPEC.md`.

Components consume tokens through semantic Tailwind classes such as:

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

Opacity modifiers on semantic tokens are allowed:

```text
bg-primary/10
border-primary/20
text-foreground/80
```

Avoid raw palette classes such as `bg-neutral-950` in product/page markup when an appropriate semantic token exists.

Do not use arbitrary colors such as:

```text
bg-[#0b0f14]
text-[#f4f4f5]
```

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

A truly one-off technical exception may use an arbitrary utility only when the standard scale and theme cannot reasonably express it. Treat that as an exception, not normal styling practice.

---

## 6. Theme initialization

Import `src/styles/starwind.css` once in the shared base layout.

Use Starwind's Astro theme initialization mechanism where required by the installed Starwind version.

The visual product is dark-first. Do not implement a theme toggle unless explicitly requested. A global dark theme is acceptable while retaining Starwind's semantic theme architecture.

---

# Architecture Rules

## Astro first

Use Astro components for static UI and page composition.

Do not use Svelte for:

- hero sections
- product cards
- pricing
- static comparison tables
- workflow diagrams
- ordinary CTAs
- article layouts
- footer content

Use Svelte only when a feature genuinely requires persistent browser-side state or interaction that cannot be cleanly handled by Astro/Starwind behavior.

Do not hydrate static content.

## No CMS or application backend in V1

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

The V1 site is static-first and uses Lemon Squeezy for checkout and PDF delivery.

## Content source of truth

Use Astro content collections for repeating content:

```text
products
articles
faqs
```

Use local images from `src/assets` with Astro's image pipeline.

Do not store sellable PDF files in public website paths.

## Commerce

Lemon Squeezy store name:

**Lead Automation System**

There are four separate Lemon Squeezy products, one per PDF guide.

Centralize product price and checkout URL data. Never duplicate prices or checkout URLs across templates.

---

# Content Integrity

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

If required commercial content is unknown, omit it or use an explicit development placeholder rather than fabricating it.

The site must not make guaranteed-client, passive-income, or spam-evasion claims.

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

1. Read `docs/PRODUCT_SPEC.md` before implementing product/UI work.
2. Preserve Astro, Tailwind v4, Starwind, and the existing Vercel deployment approach.
3. Use Starwind primitives first where a suitable component exists.
4. Use Tailwind utility classes for all component/page styling.
5. Never add `<style>` blocks to components.
6. Use semantic design-token classes instead of raw colors.
7. Keep the Tailwind theme in `src/styles/starwind.css` using Tailwind v4 `@theme` conventions.
8. Keep static UI in Astro.
9. Do not add infrastructure that V1 does not need.
10. Do not fabricate content or commercial claims.
11. Run the production build before declaring work complete.
12. Validate the implementation against the Definition of Done in `docs/PRODUCT_SPEC.md`.
