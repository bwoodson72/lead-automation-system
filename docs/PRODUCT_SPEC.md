# Prospect Foundry — V2 Website Product Specification

**Status:** Source of truth for website positioning, product architecture, information architecture, page-content requirements, conversion strategy, commerce, SEO, and V2 acceptance criteria.

This specification supersedes the previous V1 website specification that treated Prospect Foundry as only a four-tier AI prospecting product family.

Engineering implementation rules live in the repository root `AGENTS.md`. Coding agents must read both files before planning or implementing product/UI work.

---

## 1. Product Summary

Prospect Foundry is a digital publishing business for freelance developers, independent software developers, technical consultants, micro-SaaS founders, bootstrapped SaaS founders, and other technical builders who need practical systems for turning technical capability into revenue.

The website is the central marketing, education, list-building, product-discovery, and commerce layer for a connected catalog of implementation-focused products.

The site must help visitors answer:

1. **What business problem should I solve next?**
2. **Which Prospect Foundry product will help me solve it?**

Prospect Foundry should not appear to be a shelf of unrelated ebooks. The catalog is a set of systems for solving successive commercial bottlenecks.

---

## 2. Brand

### Brand name

**Prospect Foundry**

Do not invent a different umbrella brand without explicit instruction.

### Core positioning

# Build the business system around your technical skills.

Supporting proposition:

> Practical field guides and implementation systems for developers who need to find customers, sell valuable work, validate products, and build a more repeatable independent business.

### Brand progression

```text
I CAN BUILD THINGS
        ↓
I KNOW WHAT TO SELL
        ↓
I KNOW WHAT TO CHARGE
        ↓
I KNOW WHO TO SELL TO
        ↓
I CAN FIND OPPORTUNITIES
        ↓
I CAN CREATE CONVERSATIONS
        ↓
I CAN CLOSE BUSINESS
        ↓
I CAN BUILD REPEATABLE SYSTEMS
```

### Brand principles

Prospect Foundry is:

- practical
- technically literate
- evidence-based
- implementation-oriented
- commercially realistic
- respectful of the reader's intelligence
- focused on systems instead of isolated tactics

Prospect Foundry is not:

- a get-rich-quick brand
- a passive-income brand
- a generic prompt store
- an influencer course business
- a collection of motivational ebooks
- a guaranteed-income system
- a spam methodology
- a “one weird trick” marketing brand

---

## 3. Primary Audiences

### 3.1 Freelance / service builders

Includes:

- freelance web developers
- freelance software developers
- technical consultants
- solo development businesses
- small development agencies
- developers preparing to begin freelancing

Common problems:

- not knowing what to sell
- generic positioning
- uncertainty about pricing
- inconsistent client acquisition
- dependence on referrals
- dependence on freelance marketplaces
- weak prospecting systems
- difficulty translating technical work into business value
- poor follow-up
- difficulty closing
- feast-or-famine project revenue
- inefficient solo-business operations

### 3.2 Product / SaaS builders

Includes:

- indie hackers
- micro-SaaS founders
- bootstrapped SaaS founders
- independent software developers
- technical founders

Common problems:

- building before validating
- uncertainty about target users
- difficulty acquiring first customers
- feature-first rather than problem-first thinking
- weak positioning
- random marketing experiments
- unclear acquisition channels
- weak activation or retention
- too much building and too little customer contact

---

## 4. Product Philosophy

The freelance/service journey is broadly:

```text
WHAT SHOULD I SELL?
        ↓
WHAT SHOULD I CHARGE?
        ↓
WHO SHOULD I SELL TO?
        ↓
HOW DO I REACH THEM?
        ↓
HOW DO I CREATE OPPORTUNITIES?
        ↓
HOW DO I CLOSE THEM?
        ↓
HOW DO I CREATE REPEATABLE REVENUE?
        ↓
HOW DO I OPERATE THIS MORE EFFICIENTLY?
```

The SaaS journey is broadly:

```text
SHOULD I BUILD THIS?
        ↓
WHAT SHOULD I BUILD?
        ↓
HOW DO I LAUNCH IT?
        ↓
HOW DO I GET THE FIRST CUSTOMERS?
        ↓
HOW DO I BUILD REPEATABLE ACQUISITION?
```

The website must expose these journeys clearly and help visitors choose the next relevant system without implying they must buy every preceding product.

---

## 5. Product Catalog

### 5.1 Free entry point

#### Developer Marketing Quickstart

**Price:** Free

**Outcome:** Build a minimum viable customer-acquisition system in seven days.

**Role:** Primary email-list acquisition asset and first trust-building product.

The Quickstart should naturally point qualified readers toward relevant paid products without feeling like a disguised sales brochure.

---

## 6. Freelance Business Foundation

### Productize Your Dev Skills

**Target price:** $29–39

**Outcome:** Turn technical capabilities into a specific, sellable offer.

Core buyer question:

> What exactly should I sell?

### Web Developer Pricing System

**Target price:** $29–49

**Outcome:** Price projects profitably and confidently.

Core buyer question:

> What should I charge?

### Client Acquisition Without Upwork

**Target price:** $39–59

**Outcome:** Build an independent pipeline of freelance opportunities.

Core buyer question:

> Where do I find clients without depending on a marketplace?

### Marketing for Builders

**Price:** $49

**Outcome:** Build a complete marketing system for a service business or SaaS product.

Core buyer question:

> How do I create a repeatable way to generate demand?

---

## 7. AI Prospecting System Product Family

The AI Prospecting System remains a distinct four-tier product ladder inside the larger Prospect Foundry catalog.

Do not collapse it into one generic product.

### Tier 1 — AI Prospecting Starter

**Short descriptor:** Build a disciplined, evidence-based prospecting workflow with ChatGPT, Google Workspace, and a campaign tracker.

**Intended customer:** Freelance web developers who want a repeatable outbound process without APIs or automation builders.

**Automation level:** Low. AI-assisted but human controlled.

**Technical level:** Beginner.

**Core positioning:**

> Stop prospecting randomly. Build the process first.

Primary capabilities/topics:

- system fundamentals
- sending foundation
- SPF / DKIM / DMARC concepts
- sender reputation
- U.S. B2B outreach considerations
- campaign design
- niche selection
- qualification rules
- campaign limits
- Google Sheets campaign tracker
- ChatGPT research setup
- lead research
- website analysis
- evidence verification
- contact discovery
- optional Hunter usage
- optional Apollo usage
- personalized outreach
- follow-up workflow
- quality control
- metrics
- troubleshooting

Tier 1 does not provide or teach a production implementation of unattended processing, API automation, n8n workflows, databases, or custom application infrastructure.

### Tier 2 — ChatGPT Client Acquisition System

**Short descriptor:** Turn the Tier 1 method into a scheduled, semi-autonomous operating system using ChatGPT, Google Drive, Google Sheets, Gmail, and recurring tasks.

**Intended customer:** Freelancers who have proven the basic prospecting method and want recurring research and pipeline management without learning APIs.

**Automation level:** Moderate. Scheduled and semi-autonomous.

**Technical level:** Beginner to intermediate. No API knowledge required.

**Core positioning:**

> Make prospecting a recurring system instead of a recurring chore.

Primary capabilities/topics:

- scheduled ChatGPT automation
- sending foundation
- campaign design
- Google Sheets as durable state
- Google Drive
- Gmail connection
- recurring prospecting jobs
- follow-up and reply-review jobs
- reporting jobs
- task prompts
- testing
- supervision
- sending safeguards
- task limits
- failure modes
- metrics
- troubleshooting

Tier 2 does not center on n8n orchestration, custom API pipelines, application databases, or worker infrastructure.

### Tier 3 — Automated Lead Engine

**Short descriptor:** Deploy an unattended web-development prospecting pipeline with n8n, current website evidence, OpenAI, and Hunter or Apollo.

**Intended customer:** Freelancers and solo agencies with a proven campaign that want automated processing without building a custom application.

**Automation level:** High. Designed for unattended processing after correct implementation and testing.

**Technical level:** Intermediate.

**Core positioning:**

> Connect the entire pipeline and let the system do the repetitive work.

Core architecture:

```text
BUSINESS DISCOVERY
        ↓
DOMAIN NORMALIZATION / DEDUPE
        ↓
CURRENT WEBSITE EVIDENCE
        ↓
STRUCTURED AI QUALIFICATION
        ↓
QUALIFIED?
   ↙         ↘
 NO          YES
 ↓            ↓
STOP      CONTACT DISCOVERY / VERIFICATION
               ↓
          PERSONALIZED OUTREACH
               ↓
          SEQUENCE ENROLLMENT
               ↓
      REPLY / BOUNCE / UNSUBSCRIBE
               ↓
          STATE + METRICS UPDATE
```

Core technologies/topics:

- n8n
- discovery APIs/services
- Firecrawl
- OpenAI API
- Google Workspace
- Google Sheets
- Hunter and/or Apollo
- APIs
- OAuth/credentials
- webhooks
- structured qualification
- enrichment
- contact verification
- sequence enrollment
- reply/bounce/unsubscribe handling
- suppression
- deduplication
- retries
- error handling
- daily caps
- cost controls
- testing and dry runs

Tier 3 boundary:

```text
Google Sheets = primary state
n8n = primary orchestrator
workflow = unit of execution
workflow logic = retries / dedupe
```

### Tier 4 — Production Lead Engine

**Short descriptor:** Build and deploy a database-backed lead automation application with Node.js/TypeScript, PostgreSQL, durable jobs, workers, provider integrations, and production controls.

**Intended customer:** Developers and agencies needing durable scale, controlled concurrency, multiple campaigns, stronger auditability, extensibility, and production software architecture.

**Automation level:** Production-grade.

**Technical level:** Advanced.

**Core positioning:**

> When a workflow is no longer enough, build the system as software.

Core technologies/topics:

- Node.js
- TypeScript
- Neon PostgreSQL
- PostgreSQL-backed job queue
- Railway
- DataForSEO or equivalent discovery provider
- Firecrawl
- OpenAI API
- Hunter and/or Apollo adapters
- workers
- scheduled jobs
- webhooks
- migrations
- logging
- durable state
- uniqueness constraints
- retry/backoff policies
- dead-letter handling
- provider adapters
- rate limiting
- security
- backups
- rollback
- unit/integration/end-to-end testing
- production readiness
- maintenance
- scaling

Tier 4 boundary:

```text
PostgreSQL = system of record
workers/services = orchestrators
queue job = unit of execution
database/queue policies = retries / dedupe
```

### AI Prospecting family principle

The correct tier is the **lowest tier that matches the buyer's current process, technical ability, and desired automation level**.

Do not imply Tier 4 is inherently the best choice.

---

## 8. Sales and Closing

### Developer Sales Playbook

**Target price:** $39–59

**Outcome:** Turn qualified conversations into signed projects.

### Developer Proposal & Closing Kit

**Target price:** $29–49

**Outcome:** Qualify, propose, follow up, and close opportunities.

This should be more asset-oriented than the Sales Playbook. Do not advertise specific templates, scripts, or files until their inclusion is finalized.

---

## 9. Growth and Recurring Revenue

### Agency Partnership Playbook

**Target price:** $29–49

**Outcome:** Generate referral and subcontracting opportunities from agencies.

### Freelancer Retainer System

**Target price:** $29–49

**Outcome:** Turn completed projects into legitimate recurring revenue.

Do not promote artificial retainers that provide no continuing customer value.

---

## 10. Flagship Freelance System

### Freelance Developer Launch Kit

**Target price:** $79–99

**Outcome:** Build a freelance development business from technical skill to repeatable pipeline.

Conceptual progression:

```text
MARKET
↓
OFFER
↓
PRICING
↓
POSITIONING
↓
PORTFOLIO
↓
ACQUISITION
↓
SALES
↓
ONBOARDING
↓
DELIVERY
↓
REFERRALS
↓
RECURRING REVENUE
```

This is a flagship integrated system, not simply a larger ebook.

Exact contents must be finalized before the product page claims specific deliverables.

---

## 11. SaaS Product Line

### SaaS Validation Before You Build

**Target price:** $39–59

**Outcome:** Determine whether customers are sufficiently interested in a problem and proposed solution before heavy development.

### Micro-SaaS Launch System

**Target price:** $69–99

**Outcome:** Move from validated opportunity through MVP, launch, and initial revenue.

### The First 10 SaaS Customers

**Target price:** $39–59

**Outcome:** Acquire and learn from the first ten paying customers.

The number ten is a product objective and organizing concept, not a guarantee.

Never imply purchase guarantees ten customers.

---

## 12. Premium Operations Product

### AI-Powered One-Person Dev Business

**Target price:** $79–129

**Outcome:** Use AI to increase the operating capacity of a solo development business.

Potential domains include:

- research
- prospecting
- qualification
- outreach
- call preparation
- proposals
- planning
- development
- QA
- documentation
- reporting
- client communication
- content
- follow-up
- referrals
- administration

Positioning principle:

> AI-assisted business operations, not a prompt pack.

Do not promise autonomous business operation.

---

## 13. Bundles

The architecture must support bundles as first-class commerce products.

Initial planned bundles:

### Freelancer Starter Bundle

Productization + Pricing + Marketing

Target range: **$79–99**

### Client Acquisition Bundle

Client Acquisition + Marketing + selected AI Prospecting tier

Target range: **$99–149**

### Freelancer Sales System

Sales Playbook + Closing Kit + Retainer System

Target range: **$89–129**

### Freelance Developer Business System

Most or all freelance products

Target range: **$179–249**

### Independent SaaS Founder System

Validation + Launch + First 10 Customers + Marketing

Target range: **$149–199**

### Complete Builder Business Library

Broad catalog access

Target range: **$249–349+**

Tier 4 of the AI Prospecting System must not automatically be included in an inexpensive “everything” bundle. Bundle contents and pricing remain configurable until commercially finalized.

---

## 14. Information Architecture

Required top-level routes:

```text
/
/start/
/products/
/products/[slug]/
/products/ai-prospecting-system/
/bundles/
/bundles/[slug]/
/free/
/articles/
/articles/[slug]/
/about/
/faq/
/privacy/
/terms/
/refund-policy/
/purchase-complete/
/404
```

Every available product must have a dedicated product route.

Existing AI Prospecting tier routes should be preserved where possible:

```text
/products/ai-prospecting-starter/
/products/chatgpt-client-acquisition-system/
/products/automated-lead-engine/
/products/production-lead-engine/
```

Use consistent trailing-slash behavior.

---

## 15. Primary Navigation

Desktop navigation:

- Start Here
- Products
- AI Prospecting
- Bundles
- Articles
- About

Primary header CTA:

**Get the Free Quickstart**

Product navigation should group products by family rather than present an unstructured list of every product.

Mobile navigation must expose the same core destinations.

---

## 16. Homepage Objective

The homepage is no longer a sales page for the AI Prospecting System.

It must:

1. establish the umbrella problem
2. identify the audience
3. communicate the Prospect Foundry philosophy
4. help visitors identify their current commercial bottleneck
5. route them to the appropriate product or family
6. capture email through Developer Marketing Quickstart
7. establish credibility
8. introduce the larger product ecosystem

The homepage must not lead with AI as the parent value proposition.

---

## 17. Homepage Content Architecture

### Hero — Attention

Conceptual direction:

# You Learned How to Build. Now Build the Business Around It.

Supporting copy should address developers who can create websites, applications, SaaS products, and technical solutions but lack a systematic way to turn those capabilities into customers and revenue.

Primary CTA:

**Get the Free Quickstart**

Secondary CTA:

**Find Your Next System**

### Problem section — Interest

Expose recognizable situations such as:

- you can build almost anything but struggle to explain what you sell
- pricing feels improvised
- client acquisition happens in bursts
- referrals are unpredictable
- marketplaces control access to opportunities
- prospecting feels manual and inconsistent
- sales conversations do not reliably become projects
- SaaS ideas get built before demand is established
- AI tools are available but do not form a coherent operating system

Core idea:

> These are business-system problems.

### Product-path section — Desire

Use problem-oriented entry points, not only product names.

Examples:

- I don't know what to sell → Productize Your Dev Skills
- I don't know what to charge → Web Developer Pricing System
- I need clients → Client Acquisition Without Upwork
- I need a marketing system → Marketing for Builders
- I want to automate prospecting → AI Prospecting System
- I get conversations but don't close enough → Developer Sales Playbook
- I need recurring revenue → Freelancer Retainer System
- I have a SaaS idea → SaaS Validation Before You Build
- I want AI to increase my operating capacity → AI-Powered One-Person Dev Business

This problem-based routing is more important than a giant product grid.

### Free Quickstart section

Feature Developer Marketing Quickstart prominently.

Communicate that it helps the reader identify:

- who they are targeting
- what problem they are selling against
- what they are offering
- what to say
- where to find buyers
- what to do next
- what to measure

### System / philosophy section

Explain that Prospect Foundry products are executable systems:

```text
LEARN
  ↓
DECIDE
  ↓
IMPLEMENT
  ↓
EXECUTE
  ↓
MEASURE
  ↓
IMPROVE
```

Contrast this with random tactics, disconnected tools, prompt collections, and endless theory.

### Product families section

Show major families:

- Freelance Foundations
- Client Acquisition
- AI Prospecting
- Sales & Closing
- Growth & Recurring Revenue
- SaaS
- AI Operations

### Proof section

Proof does not need to come from Prospect Foundry's own operation.

Acceptable proof includes:

- sourced case examples
- relevant research
- documented founder examples
- documented freelancer examples
- verified methodology demonstrations
- real product previews

Never fabricate testimonials, sales, revenue, customer counts, or case-study outcomes.

### Final CTA

Primary:

**Get the Free Quickstart**

Secondary:

**Browse All Products**

---

## 18. Start Here Page

Route:

`/start/`

Purpose:

Diagnose the visitor's current bottleneck and route them to the appropriate next product.

This can be a static Astro decision tree; it does not require a JavaScript quiz.

Example logic:

```text
SERVICES
   ↓
Do you know exactly what you sell?
   NO → Productize Your Dev Skills
   YES
      ↓
Do you have a reliable way to find opportunities?
   NO → Client Acquisition Without Upwork
   YES
      ↓
Do you need prospecting automation?
   YES → AI Prospecting System
      ↓
Are conversations turning into projects?
   NO → Developer Sales Playbook
      ↓
Do you need recurring revenue?
   YES → Freelancer Retainer System

SOFTWARE / SAAS
   ↓
Have you validated the problem?
   NO → SaaS Validation Before You Build
   YES
      ↓
Have you launched?
   NO → Micro-SaaS Launch System
   YES
      ↓
Do you have early paying customers?
   NO → The First 10 SaaS Customers
   YES → Marketing for Builders
```

This is guidance, not a rigid prerequisite system.

---

## 19. Products Index

Route:

`/products/`

Support two discovery modes.

### Browse by problem

Examples:

- Decide what to sell
- Set prices
- Find clients
- Automate prospecting
- Improve sales
- Create recurring revenue
- Validate SaaS
- Launch SaaS
- Find first SaaS customers
- Operate more efficiently with AI

### Browse by product family

Group products under:

- Freelance Foundations
- Prospecting
- Sales & Closing
- Growth
- SaaS
- Operations

Every card should include:

- product name
- one-sentence outcome
- intended audience
- price or Free
- family indicator
- status where relevant
- CTA

Avoid enormous equal-weight card grids.

---

## 20. Universal Product Page Requirement

Every available sellable product gets its own page.

Every product page uses **AIDA** as the persuasion architecture:

```text
ATTENTION
↓
INTEREST
↓
DESIRE
↓
ACTION
```

The page does not need visible labels saying Attention, Interest, Desire, or Action. AIDA governs sales logic, not headings.

---

## 21. Product Page — Attention

Above the fold must answer:

- What is this?
- Who is it for?
- What meaningful outcome does it help create?
- Why should this visitor keep reading?

Required elements:

- product-family eyebrow
- product title
- outcome-oriented headline/subheadline
- concise audience qualifier
- product visual
- price
- primary CTA
- format indicator such as “Downloadable implementation guide”
- short trust statement where appropriate

Do not open with a table of contents.

Do not open with technology unless the technology itself is central to the buying decision.

---

## 22. Product Page — Interest

Make the visitor recognize the current problem.

Suggested structure:

### The situation

Describe the current workflow or frustration.

### Why the obvious solution fails

Explain why common approaches produce weak results where relevant.

### What actually needs to change

Introduce the system or methodology taught by the product.

Use concrete examples.

Do not artificially intensify pain or invent financial losses.

---

## 23. Product Page — Desire

Translate contents into capability.

Required sections where applicable:

### What you'll be able to do

Outcome-oriented capabilities.

### The system you'll build

Show workflow or conceptual architecture.

### What's inside

Display actual major sections/modules.

### How it works

Explain how the reader moves from reading to implementation.

### Examples / preview

Use genuine PDF pages, diagrams, worksheets, tables, or excerpts when available.

### Who this is for

Specific positive qualification.

### Who this is not for

Prevent wrong purchases.

### Proof

Use legitimate evidence where useful.

Proof may be first-party or credible external evidence. External proof must never be presented as a Prospect Foundry customer result.

### Related progression

Show useful before/after or next-product relationships without implying every preceding product is mandatory.

---

## 24. Product Page — Action

Near the purchasing decision, clearly state:

- product
- format
- current price
- what is included
- checkout mechanism
- delivery mechanism
- relevant refund information
- CTA

Primary paid CTA should be explicit, e.g.:

**Get [Product Name]**

Avoid vague purchase CTAs such as “Learn More.”

For the free product:

**Get the Free Quickstart**

Finish with a concise product-specific FAQ where useful.

---

## 25. AIDA Copy Standard

AIDA does not mean hype.

### Attention

Earn attention through relevance.

Bad:

> Revolutionize your freelance journey.

Better:

> You can build the project. The harder part is finding someone ready to pay for it.

### Interest

Demonstrate understanding of the actual problem.

### Desire

Show a credible better state and the mechanism for reaching it.

### Action

Give a specific next step.

Never use:

- fake urgency
- fake scarcity
- countdown timers without a legitimate deadline
- invented discounts
- guaranteed results
- unsubstantiated income claims
- manipulative shame
- exaggerated fear

---

## 26. Product Content Model

Use centralized structured product data.

Recommended fields:

```text
title
slug
status
family
audience
shortDescription
coreOutcome
problem
price
priceLabel
format
difficulty
featured
free
checkoutUrl
coverImage
previewImages
aida:
  attention
  interest
  desire
  action
capabilities[]
contents[]
whoItsFor[]
whoItsNotFor[]
proof[]
faqs[]
relatedProducts[]
nextProducts[]
seo:
  title
  description
```

The exact Astro schema may differ, but data must remain centralized.

Never duplicate product price or checkout URL data across templates.

---

## 27. Product Status

Support:

```text
available
coming-soon
planned
```

### Available

Full sales page and purchase CTA.

### Coming soon

May have full positioning, expected outcome, and an email-interest/waitlist CTA.

Must not claim final contents or price unless finalized.

### Planned

Should normally appear only where roadmap/catalog context adds value.

Do not create fake checkout buttons.

This status system allows the site redesign to launch before the entire catalog is finished.

---

## 28. AI Prospecting Family Page

Route:

`/products/ai-prospecting-system/`

Purpose:

Help visitors understand the common methodology and choose the correct automation level.

The page should follow its own AIDA progression.

### Attention

> Build an evidence-first prospecting system at the level of automation you actually need.

### Interest

Explain that the problem is not lack of tools but lack of an operating system connecting:

```text
DISCOVERY
↓
VERIFICATION
↓
WEBSITE EVIDENCE
↓
QUALIFICATION
↓
CONTACT DISCOVERY
↓
OUTREACH
↓
FOLLOW-UP
↓
STATE
↓
MEASUREMENT
```

### Desire

Compare the four implementation levels:

```text
TIER 1
Human supervised
        ↓
TIER 2
Scheduled / semi-autonomous
        ↓
TIER 3
Workflow automated
        ↓
TIER 4
Production software
```

The comparison should include:

- intended user
- automation level
- technical level
- primary tools
- state/storage model
- supervision requirement
- what the customer builds
- price when finalized
- “Choose this tier if...” guidance

### Action

Each tier links to its own complete product page.

Do not sell all four tiers through one ambiguous CTA.

---

## 29. Bundle Pages

Every active bundle gets its own page.

Bundle pages should emphasize:

- larger outcome
- why the included products fit together
- who should buy the bundle instead of individual products
- included products
- individual-value comparison where factually accurate
- bundle price
- mathematically accurate savings where applicable
- recommended sequence
- CTA

Do not use fake anchoring.

---

## 30. Free Resources

Route:

`/free/`

Initially feature:

**Developer Marketing Quickstart**

The architecture should permit future legitimate guides, worksheets, checklists, calculators, or templates.

Do not advertise resources that do not exist.

---

## 31. Email Acquisition

Developer Marketing Quickstart is the primary opt-in asset.

Flow:

```text
VISITOR
↓
QUICKSTART LANDING PAGE / FORM
↓
EMAIL SUBMISSION + REQUIRED DISCLOSURE/CONSENT
↓
CONFIRMATION / DELIVERY
↓
WELCOME + NURTURE
↓
RELEVANT PRODUCT PATH
```

Do not gate useful content inside the Quickstart merely to collect an email address already collected during acquisition.

Supplementary subscriber assets may be delivered later where strategically useful.

---

## 32. Articles

Articles support:

- organic discovery
- trust
- product education
- email acquisition
- internal linking
- commercial problem awareness

Suggested categories:

- Freelancing
- Offers
- Pricing
- Marketing
- Prospecting
- Sales
- SaaS
- AI Operations

Articles should link to the most relevant next resource rather than automatically promote the most expensive product.

---

## 33. About Page

The About page should explain:

- why Prospect Foundry exists
- the practical/system-oriented publishing philosophy
- who the products are for
- how research and evidence are handled
- the distinction between technical capability and commercial systems

Do not fabricate personal achievements or authority.

Authority may come from demonstrated reasoning, research, useful frameworks, transparent methodology, documented examples, and product quality.

---

## 34. Commerce

Continue using Lemon Squeezy unless explicitly changed.

Store name:

**Prospect Foundry**

Lemon Squeezy should own:

- checkout
- payment processing
- receipts
- protected paid digital delivery
- merchant-of-record functions provided by the service

The Astro site must not process card data.

Paid PDFs must not be stored in public website paths.

Each sellable product and bundle should have centralized commerce metadata.

Do not assume there are only four Lemon Squeezy products.

---

## 35. Technical Architecture

Preserve:

- Astro 7
- TypeScript
- Tailwind CSS 4
- Starwind UI
- Svelte 5 integration only where genuinely required
- Vercel
- static-first rendering
- Astro content collections
- local optimized imagery
- minimal client JavaScript

Do not add a CMS solely because the catalog is larger.

The catalog remains manageable as structured local content.

No database or custom backend is required for the core public commerce site unless later requirements explicitly introduce one.

---

## 36. Content Collections

Recommended collections:

```text
products
bundles
articles
faqs
```

The AI Prospecting family page may use structured configuration derived from the product collection.

Use local assets from `src/assets` with Astro's image pipeline.

---

## 37. Design Direction

The site should feel like a premium technical/business publishing platform.

Desired characteristics:

- dark-first
- restrained
- high information clarity
- strong typography
- technical without looking like developer documentation
- commercial without looking like an internet-marketing funnel
- generous spacing
- meaningful diagrams
- real product covers
- real PDF previews
- useful comparison tables
- strong visual hierarchy

Avoid:

- stock-photo dependence
- fake SaaS dashboards
- excessive gradients
- neon cyberpunk clichés
- giant product-card walls
- excessive animation
- fake testimonials
- fake notification popups
- countdown timers
- aggressive modal behavior

Product families may receive subtle distinctions through iconography, labels, diagrams, or restrained accent treatment, but they must remain one coherent brand.

---

## 38. SEO

Every available product should have an indexable dedicated page.

Product pages require:

- unique title
- unique meta description
- canonical URL
- Product structured data where appropriate and accurate
- BreadcrumbList structured data
- meaningful heading hierarchy
- contextual internal links

Do not generate thin pages for unfinished products merely to increase page count.

Coming-soon pages should be indexed only if they contain enough substantive information to justify it.

---

## 39. Internal Linking

Products should link contextually to relevant:

- prerequisites when genuinely useful
- next-stage products
- bundles
- articles
- Quickstart

Example progression:

```text
Productize Your Dev Skills
        ↓
Web Developer Pricing System
        ↓
Client Acquisition Without Upwork
        ↓
Marketing for Builders
```

Do not imply customers are required to buy preceding products unless that is actually true.

---

## 40. Accessibility

Target WCAG 2.2 AA.

Required:

- semantic landmarks
- logical headings
- keyboard-accessible navigation
- visible focus states
- accessible accordions
- accessible comparison tables
- descriptive CTAs
- sufficient contrast
- meaningful image alt text
- reduced-motion support
- forms with labels and useful errors
- product-family distinctions that do not rely solely on color

---

## 41. Performance

Maintain static-first implementation.

Requirements:

- minimal hydration
- optimized product images
- lazy-load below-fold imagery
- avoid unnecessary third-party scripts
- no SPA conversion
- no client-side rendering of static product content
- minimize layout shift

The larger catalog is not justification for adding an application backend.

---

## 42. Analytics

The site should be capable of measuring:

- Quickstart landing-page visits
- Quickstart opt-ins
- product-page views
- product-family navigation
- Start Here navigation
- checkout clicks
- completed purchases where integration permits
- bundle interest
- article-to-product navigation

Measurement should answer:

> Which paths actually move visitors toward email subscription or purchase?

Do not add analytics complexity that does not serve this question.

---

## 43. Conversion Principles

Prioritize:

1. relevance
2. comprehension
3. trust
4. product fit
5. action

Do not prioritize pressure, visual noise, repeated popups, or exaggerated claims.

The visitor should think:

> This understands the business problem I'm trying to solve.

before:

> I should buy this.

---

## 44. Launch Strategy

The V2 site does not need every planned product completed before launch.

Use status honestly.

### Available

Completed, commercially ready products with functioning delivery/checkout.

### Coming soon

Products actively being produced and sufficiently defined to present accurately.

### Planned

Products still conceptual.

The homepage should emphasize available products.

Do not let a large coming-soon catalog make the business look imaginary.

---

## 45. Migration From Existing Site

Preserve useful existing assets:

- Prospect Foundry brand
- technical stack
- design tokens
- reusable components
- article infrastructure
- Lemon Squeezy integration
- AI Prospecting tier content
- legitimate product imagery
- existing legal pages

Replace the old assumption:

> Prospect Foundry = AI Prospecting System

with:

> AI Prospecting System = one major product family within Prospect Foundry.

Preserve existing tier URLs where possible to avoid unnecessary URL churn.

The old `/compare/` route may redirect to or evolve into `/products/ai-prospecting-system/` if the family page fully assumes comparison duties.

---

## 46. V2 Definition of Done

The redesign is complete when:

- [ ] Prospect Foundry is positioned as a multi-product publishing business.
- [ ] The homepage no longer revolves around one prospecting product.
- [ ] Developer Marketing Quickstart is integrated as the primary free entry point.
- [ ] Every available product has its own dedicated page.
- [ ] Every product page follows AIDA sales logic.
- [ ] Product copy is outcome-oriented rather than table-of-contents-first.
- [ ] Products are organized into understandable families.
- [ ] Visitors can browse by problem.
- [ ] `/start/` routes visitors according to their current bottleneck.
- [ ] The AI Prospecting System has a family/comparison page.
- [ ] Each AI Prospecting tier retains its own product page.
- [ ] AI Prospecting tier names and technical boundaries match this spec.
- [ ] Bundles are supported as first-class products.
- [ ] Available, coming-soon, and planned states are supported.
- [ ] Prices and checkout URLs are centralized.
- [ ] No unavailable product has a fake checkout action.
- [ ] No testimonials, outcomes, statistics, or commercial claims are fabricated.
- [ ] Real product previews are used where available.
- [ ] Email acquisition is integrated with the Quickstart.
- [ ] Articles connect naturally to relevant products.
- [ ] Existing AI Prospecting URLs are preserved or intentionally redirected.
- [ ] Astro content collections remain the source of truth for repeating product content.
- [ ] Static-first Astro architecture is preserved.
- [ ] Starwind remains the standard component primitive library.
- [ ] Tailwind v4 semantic tokens remain the visual foundation.
- [ ] WCAG 2.2 AA requirements are met.
- [ ] Production build passes.
- [ ] Product-page CTAs work.
- [ ] Lemon Squeezy checkout links work for every available paid product.
- [ ] Free-product acquisition flow works.
- [ ] The site remains usable without client-side JavaScript except where interaction genuinely requires it.

---

## 47. Final Product Principle

The website should not sell “ebooks.”

It should sell **the next system the visitor needs to build**.

The organizing principle for the entire experience is:

> Find your current business bottleneck. Build the system that removes it. Then move to the next one.

That principle should govern the homepage, Start Here experience, product organization, internal linking, AIDA copy, bundles, email acquisition, and future expansion of the Prospect Foundry catalog.
