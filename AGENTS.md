# Lead Automation System — Agent Instructions and V1 Product Specification

This file is the source of truth for coding agents working in this repository.

If a later explicit user instruction conflicts with this document, the later instruction wins. Otherwise, implement the project according to this specification and do not expand scope without a clear requirement.

---

## Development

When starting the dev server, use background mode:

```sh
astro dev --background
```

Manage the background server with:

```sh
astro dev stop
astro dev status
astro dev logs
```

Before considering implementation work complete, run the production build and fix build errors.

## Documentation

Full Astro documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using Svelte or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

# 1. Project Purpose

Build the production-ready marketing and commerce website for **Lead Automation System**, a four-tier family of downloadable PDF implementation guides for freelance web developers.

The website exists to:

1. Explain the lead-acquisition methodology clearly.
2. Show how the four products differ.
3. Help visitors choose the appropriate tier.
4. Establish that the products teach complete operating systems rather than isolated prompts.
5. Sell the four PDF guides through Lemon Squeezy.
6. Support organic acquisition through high-quality educational content.
7. Present the guides with credible product imagery, diagrams, examples, and real preview pages.
8. Remain simple to operate without a CMS, database, custom authentication, or customer dashboard.

The website itself is **not** the lead-generation application. It sells the implementation manuals that teach customers how to build those systems.

---

# 2. Existing Technical Stack

Retain the existing repository stack:

- Astro 7
- TypeScript
- Tailwind CSS 4
- Svelte 5 integration
- Starwind UI
- Tabler Icons
- Vercel adapter

Do not replace Astro with Next.js, SvelteKit, React, or another application framework without an explicit later requirement.

Default to static Astro markup. Use Svelte only when browser-side state is genuinely required.

---

# 3. Product Family

Lead Automation System contains four paid PDF guides:

1. **Tier 1 — AI Prospecting Starter**
2. **Tier 2 — ChatGPT Client Acquisition System**
3. **Tier 3 — Automated Lead Engine**
4. **Tier 4 — Production Lead Engine**

Each tier teaches the same underlying client-acquisition logic with progressively more automation and infrastructure.

Common pipeline:

```text
DISCOVER
   ↓
VERIFY BUSINESS
   ↓
INSPECT WEBSITE
   ↓
QUALIFY OR REJECT
   ↓
FIND / VERIFY CONTACT
   ↓
WRITE OUTREACH
   ↓
SEND
   ↓
FOLLOW UP
   ↓
STOP / RECORD
   ↓
REPORT
```

The site must make this progression easy to understand.

---

# 4. Core Product Positioning

Umbrella positioning:

## Build Your Own Web-Development Client Acquisition System

Supporting message:

> Learn how to find businesses with real website opportunities, qualify them using evidence, turn that evidence into personalized outreach, manage follow-ups, and progressively automate the entire pipeline.

The most important distinction is:

> The product is not primarily about sending more email. It is about building a better system for deciding who should receive an email and why.

The system's central principle is:

> Find a defensible reason to contact the business before writing the email.

---

# 5. What the Product Is

Lead Automation System teaches customers how to:

- identify businesses that may need web-development help
- verify that the business and website are legitimate
- inspect the current website
- distinguish meaningful sales opportunities from arbitrary criticism
- reject businesses when there is no defensible reason to contact them
- identify legitimate business contact information
- create outreach based on verified evidence
- manage follow-ups
- stop outreach appropriately
- maintain durable campaign state
- automate increasingly large parts of the process

The guides are implementation manuals, not motivational courses.

---

# 6. What the Product Is Not

Never position Lead Automation System as:

- a spam-blasting system
- a bulk email product
- a generic cold-email template pack
- a simple prompt pack
- a scraped lead list
- a prospect database
- a SaaS lead-generation application
- an Apollo replacement
- an email warmup service
- an email sending service
- a guaranteed client-generation system
- a passive-income scheme
- a get-rich-quick product
- a one-click AI sales machine

The customer is purchasing knowledge and implementation instructions in downloadable PDF form.

The customer is not purchasing software that runs the system for them.

---

# 7. Target Audience

Primary audience:

**Freelance web developers and solo/small web-development agencies that need a repeatable client-acquisition system.**

Typical customer characteristics:

- technically capable enough to build websites
- may have limited sales-system experience
- may depend heavily on referrals
- may prospect manually
- may already experiment with ChatGPT
- may use Google Workspace
- may have tried Apollo or Hunter
- may want automation but not understand how all pieces connect
- may not understand DNS, deliverability, APIs, n8n, queues, or databases

The guides deliberately explain concepts from first principles.

---

# 8. Core Buyer Problems

The website should speak directly to these problems.

## Fragmented manual prospecting

A freelancer often:

1. searches for businesses
2. opens websites manually
3. decides who might be worth contacting
4. searches for contact information
5. tries to find something meaningful to mention
6. writes outreach
7. records the lead somewhere
8. tries to remember follow-ups
9. starts over the next day

The problem is not only that prospecting takes time. The process usually has no defined operating architecture.

## Generic outreach

A large list is not useful if there is no credible reason to contact each business.

The system emphasizes:

```text
evidence
   ↓
qualification
   ↓
business consequence
   ↓
outreach angle
```

## Tools without strategy

A freelancer can subscribe to ChatGPT, Apollo, Hunter, n8n, and other tools and still not have a functioning client-acquisition system.

Tools are components. The product teaches the architecture.

## Automation amplifies mistakes

Automating weak qualification, fabricated observations, duplicates, bad suppression handling, or poor messaging makes the process worse.

The product therefore introduces automation progressively.

---

# 9. Product Ladder Summary

Always present the family as a progression.

```text
TIER 1
AI Prospecting Starter
Human supervised
You + ChatGPT + tracker

        ↓

TIER 2
ChatGPT Client Acquisition System
Scheduled / semi-autonomous
ChatGPT + Google tools + recurring tasks

        ↓

TIER 3
Automated Lead Engine
Automated workflows
n8n + APIs + Google Sheets state

        ↓

TIER 4
Production Lead Engine
Production application
Node/TypeScript + PostgreSQL + queues + workers
```

Do not imply that higher tier always means better for every buyer. The correct tier depends on the buyer's needs and technical comfort.

---

# 10. Tier 1 — AI Prospecting Starter

## Short descriptor

Build a disciplined, evidence-based prospecting workflow with ChatGPT, Google Workspace, and a campaign tracker.

## Intended customer

Freelance web developers who want a repeatable outbound process without APIs or automation builders.

## What the customer builds

A human-supervised workflow in which ChatGPT assists with lead research and outreach drafting while the customer:

- verifies evidence
- controls the campaign tracker
- approves outreach
- sends messages
- handles follow-up
- supervises the full process

## Topics covered

- prospecting-system fundamentals
- sending-domain and mailbox foundations
- SPF
- DKIM
- DMARC
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
- when to upgrade to Tier 2

## Automation level

Low. AI-assisted but human controlled.

## Technical level

Beginner.

## Product-page positioning

> Stop prospecting randomly. Build the process first.

## Deliberate non-capabilities

Tier 1 does not teach or provide:

- unattended lead processing
- API automation
- n8n workflows
- automated sending architecture
- database infrastructure
- production application development

---

# 11. Tier 2 — ChatGPT Client Acquisition System

## Short descriptor

Turn the Tier 1 method into a scheduled, semi-autonomous operating system using ChatGPT, Google Drive, Google Sheets, Gmail, and scheduled tasks.

## Intended customer

Freelancers who have proven the basic prospecting method and want recurring research and pipeline management without learning APIs.

## What the customer builds

A scheduled ChatGPT workflow that can:

- read durable campaign state
- research prospects
- draft outreach
- identify due follow-ups
- review campaign activity and replies
- maintain campaign operations
- produce recurring reports

The default posture remains low volume and appropriately supervised.

## Topics covered

- scheduled ChatGPT automation
- sending foundation
- campaign design
- Google Sheets as durable campaign state
- Google Drive
- Gmail connection
- task architecture
- recurring prospecting jobs
- follow-up/reply-review jobs
- reporting jobs
- task prompts
- testing
- supervision
- sending safeguards
- task limits
- failure modes
- metrics
- troubleshooting
- upgrade path to APIs and n8n

## Automation level

Moderate. Scheduled and semi-autonomous.

## Technical level

Beginner to intermediate. No API knowledge required.

## Product-page positioning

> Make prospecting a recurring system instead of a recurring chore.

## Deliberate non-capabilities

Tier 2 does not teach or provide:

- large-scale unattended processing
- custom API pipelines
- n8n workflow orchestration
- database-backed application state
- worker infrastructure

---

# 12. Tier 3 — Automated Lead Engine

## Short descriptor

Deploy an unattended web-development prospecting pipeline with n8n, website evidence collection, OpenAI, and Hunter or Apollo.

## Intended customer

Freelancers and solo agencies with a proven campaign that want automated processing without building a custom application.

## What the customer builds

```text
business discovery
        ↓
website evidence
        ↓
AI qualification
        ↓
contact discovery / verification
        ↓
personalized outreach
        ↓
sequence enrollment
        ↓
reply / bounce / unsubscribe handling
        ↓
metrics
```

## Core technologies

- n8n
- DataForSEO or equivalent discovery functions described by the guide
- Firecrawl
- OpenAI API
- Google Workspace
- Google Sheets
- Hunter and/or Apollo
- APIs
- OAuth/credentials
- webhooks

## Topics covered

- architecture
- service accounts
- campaign schemas
- evidence storage
- business discovery
- website crawling
- structured AI qualification
- AI schemas
- enrichment
- contact verification
- outreach generation
- sequence enrollment
- webhook processing
- reply handling
- bounce handling
- unsubscribe handling
- suppression
- deduplication
- workflow failures
- retries
- error handling
- daily caps
- metrics
- cost controls
- testing
- dry runs
- launch
- troubleshooting
- upgrade path to Tier 4

## Automation level

High. Designed for unattended processing after correct implementation and testing.

## Technical level

Intermediate. The guide explains concepts from the beginning, but implementation involves APIs, credentials, data structures, and n8n workflows.

## Product-page positioning

> Connect the entire pipeline and let the system do the repetitive work.

## Critical architecture distinction

Tier 3 remains freelancer-scale workflow automation:

- Google Sheets is the primary campaign state store
- n8n is the primary orchestration layer
- workflow logic handles retries and deduplication

---

# 13. Tier 4 — Production Lead Engine

## Short descriptor

Build and deploy a database-backed lead automation application with Node.js/TypeScript, PostgreSQL, durable jobs, workers, provider integrations, and production controls.

## Intended customer

Developers and agencies that need:

- durable scale
- controlled concurrency
- multiple campaigns
- stronger auditability
- extensibility
- production software architecture

## What the customer builds

A real application in which:

- PostgreSQL owns durable state
- queues own pending work
- workers execute processing
- providers collect evidence
- structured AI makes qualification decisions
- outbound providers handle appropriate sending responsibilities
- external events synchronize state
- externally visible actions are idempotent and auditable

## Core technologies

- Node.js
- TypeScript
- Neon PostgreSQL
- PostgreSQL-backed job queue
- Railway
- DataForSEO
- Firecrawl
- OpenAI API
- Hunter and/or Apollo adapters
- workers
- scheduled jobs
- webhooks
- migrations
- logging
- production controls

## Topics covered

- production architecture
- local development
- environment variables
- database schema
- migrations
- uniqueness constraints
- durable state
- queues
- workers
- scheduling
- retry/backoff policies
- dead-letter handling
- provider adapters
- discovery services
- crawling services
- qualification services
- enrichment
- sequence enrollment
- webhook processing
- reporting
- deployment
- health checks
- logging
- idempotency
- budgets
- rate limiting
- security
- backups
- rollback
- unit testing
- integration testing
- end-to-end testing
- production readiness
- maintenance
- scaling

## Automation level

Production-grade.

## Technical level

Advanced implementation, even though the guide teaches concepts from first principles.

## Product-page positioning

> When a workflow is no longer enough, build the system as software.

## Tier 3 vs Tier 4

Tier 3:

```text
Google Sheets = primary state
n8n = primary orchestrator
workflow = unit of execution
workflow logic = retries/dedupe
```

Tier 4:

```text
PostgreSQL = system of record
workers/services = orchestrators
queue job = unit of execution
database/queue policies = dedupe/retries
```

---

# 14. Deliverable Format

Each paid product is a **single downloadable PDF**.

Do not imply that customers receive additional downloadable files unless those files are explicitly added later.

Do not advertise:

- spreadsheet templates
- source code downloads
- prompt packs as separate files
- workflow exports
- n8n JSON files
- ZIP archives
- bonus guides
- software access
- dashboards
- accounts

unless those deliverables actually exist.

The PDF may itself contain prompts, worksheets, code examples, workflow diagrams, tables, and checklists. Those are contents inside the guide, not separate deliverables.

---

# 15. Commerce Model

Use **Lemon Squeezy** for V1.

Lemon Squeezy owns:

- checkout
- payment processing
- digital PDF delivery
- purchase receipts
- merchant-of-record commerce functions provided by the platform

The Astro site must not process payment-card data.

The production PDF files must not be stored in publicly accessible website paths.

Store name: **Lead Automation System**.

Create four separate Lemon Squeezy products, one for each guide.

---

# 16. Purchase Flow

```text
Visitor
   ↓
Marketing page
   ↓
Product detail
   ↓
Buy Guide
   ↓
Lemon Squeezy checkout
   ↓
Payment
   ↓
Lemon Squeezy PDF delivery
   ↓
Optional return to /purchase-complete/
```

No website account is required.

---

# 17. V1 Architecture

```text
Astro
│
├── Static marketing pages
├── Product content collection
├── Article content collection
├── FAQ content collection
├── Local images
├── Astro image optimization
│
├── Starwind UI
│
├── Svelte islands
│   └── Only where actual client interaction is needed
│
└── Lemon Squeezy
    └── External checkout + PDF delivery
```

Hosting: Vercel.

No database is required.

No custom backend API is required for core V1 functionality.

---

# 18. Hard V1 Non-Goals

Do not build any of the following unless a later explicit requirement changes scope:

- CMS
- Sanity
- WordPress
- Contentful
- Supabase
- Firebase
- PostgreSQL for the website
- website authentication
- user registration
- user accounts
- customer dashboard
- course dashboard
- lesson completion
- PDF reader
- protected file server
- custom download system
- community
- comments
- forum
- AI chatbot
- embedded lead-generation software
- interactive lead discovery
- workflow generator
- prompt generator
- subscription management
- custom checkout
- custom payment processing
- custom admin panel

---

# 19. Content Management

There is no CMS.

The Git repository is the source of truth.

Use Astro content collections for repeating content.

Primary collections:

```text
products
articles
faqs
```

Do not move one-off homepage content into content collections merely for abstraction.

---

# 20. Product Content Collection

Directory:

```text
src/content/products/
```

Recommended entries:

```text
01-ai-prospecting-starter.mdx
02-chatgpt-client-acquisition-system.mdx
03-automated-lead-engine.mdx
04-production-lead-engine.mdx
```

Recommended schema:

```ts
{
  title: z.string(),
  shortTitle: z.string(),
  slug: z.string(),
  tier: z.number().int().min(1).max(4),

  tagline: z.string(),
  description: z.string(),
  audience: z.string(),
  promise: z.string(),

  automationLevel: z.string(),
  technicalLevel: z.string(),

  heroImage: image(),
  heroAlt: z.string(),

  whatYouBuild: z.array(z.string()),
  topics: z.array(z.string()),
  tools: z.array(z.string()),
  prerequisites: z.array(z.string()),
  outcomes: z.array(z.string()),
  limitations: z.array(z.string()),

  price: z.number().optional(),
  checkoutUrl: z.string().url().optional(),

  version: z.string().optional(),
  pageCount: z.number().optional(),
  lastUpdated: z.coerce.date().optional(),

  featured: z.boolean().default(false),
  order: z.number()
}
```

Prices and checkout URLs must live in structured data and must not be duplicated throughout components.

---

# 21. Article Content Collection

Directory:

```text
src/content/articles/
```

Use MDX.

Recommended schema:

```ts
{
  title: z.string(),
  description: z.string(),

  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),

  heroImage: image(),
  heroAlt: z.string(),

  category: z.string(),
  tags: z.array(z.string()),
  relatedProducts: z.array(z.string()).optional(),

  featured: z.boolean().default(false),
  draft: z.boolean().default(false)
}
```

Articles must support local optimized images and approved MDX presentation components.

---

# 22. FAQ Collection

Directory:

```text
src/content/faqs/
```

Recommended schema:

```ts
{
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  tiers: z.array(z.number()).optional(),
  featured: z.boolean().default(false),
  order: z.number()
}
```

FAQ content should be reusable across homepage, product pages, and the full FAQ page.

---

# 23. Image Architecture

Primary directories:

```text
src/assets/
├── brand/
├── products/
│   ├── tier-1/
│   ├── tier-2/
│   ├── tier-3/
│   └── tier-4/
├── diagrams/
├── examples/
├── screenshots/
└── articles/
```

Use Astro's local image pipeline.

Do not put normal article/product imagery in `public/` simply for easier paths.

Use `public/` only for assets that genuinely require stable public URLs, such as favicon, web manifest, verification files, or similar static infrastructure.

Every meaningful image requires useful alt text. Decorative images should not create redundant screen-reader content.

---

# 24. Product Imagery

Every guide needs a distinctive cover.

The covers should clearly belong to the same family and include:

- tier number
- guide title
- short descriptor
- consistent Lead Automation System branding

Visual progression should reflect increasing technical sophistication:

- Tier 1: simple human + AI workflow
- Tier 2: scheduled/recurring system
- Tier 3: connected workflow nodes
- Tier 4: application/database/worker architecture

Avoid:

- generic robot heads
- glowing AI brains
- humanoid AI imagery
- fake SaaS dashboards
- stock handshakes
- money imagery
- luxury imagery

---

# 25. PDF Preview Images

Product pages should support optional preview images exported from real guide pages.

Example:

```text
src/assets/products/tier-3/
├── cover.webp
├── preview-01.webp
├── preview-02.webp
└── preview-03.webp
```

Preview sections may show:

- table of contents
- workflow diagram
- implementation page
- code/workflow example

Do not expose the full PDF or enough high-resolution pages to recreate the entire product.

Never fabricate preview pages.

---

# 26. Primary Navigation

Desktop primary navigation:

```text
Products
Compare
How It Works
Articles
FAQ
```

Right-side CTA:

```text
Choose Your Guide
```

Logo links to homepage.

Products may use an accessible dropdown listing all four guides if the implementation remains simple and usable.

Mobile navigation must expose the same primary routes clearly.

---

# 27. Required Routes

```text
/
/products/
/products/ai-prospecting-starter/
/products/chatgpt-client-acquisition-system/
/products/automated-lead-engine/
/products/production-lead-engine/
/compare/
/how-it-works/
/articles/
/articles/[slug]/
/faq/
/about/
/privacy/
/terms/
/refund-policy/
/purchase-complete/
/404
```

Use trailing-slash behavior consistently according to Astro/site configuration.

---

# 28. Homepage Goal

The homepage must answer these questions in order:

1. What is this?
2. Why would I need it?
3. How does it work?
4. How is it different from a lead/contact database?
5. Which version is right for me?
6. What will I learn?
7. Can I trust the methodology?
8. What should I buy?

The homepage should not attempt to explain every technical implementation detail.

---

# 29. Homepage Hero

Eyebrow:

> Client acquisition systems for freelance web developers

H1:

# Stop Hunting for Web-Development Clients Manually.

Supporting copy:

> Build a repeatable system for finding businesses with real website opportunities, qualifying them with evidence, creating personalized outreach, managing follow-ups, and progressively automating the entire pipeline.

Primary CTA:

**Compare the Guides** → `/compare/`

Secondary CTA:

**See How the System Works** → `/how-it-works/`

Supporting trust line:

> Four implementation guides. From AI-assisted prospecting to a production-grade lead engine.

Hero visual should communicate the pipeline:

```text
DISCOVER → VERIFY → ANALYZE → QUALIFY → CONTACT → OUTREACH → FOLLOW UP → TRACK
```

Use a system/flow visual, not decorative AI imagery.

---

# 30. Homepage Problem Section

Heading:

# Prospecting Usually Isn't One Problem. It's Ten Small Jobs.

Copy direction:

> Finding a potential client is only the beginning. You still have to determine whether the business is worth contacting, inspect its current site, find a legitimate contact, decide what matters enough to mention, write the message, track what happened, and remember when to follow up.

> Most freelancers do those jobs manually and inconsistently. The result is a process that consumes hours without ever becoming a real system.

Visual flow:

```text
Search for businesses
        ↓
Open the website
        ↓
Decide if it's a prospect
        ↓
Find contact information
        ↓
Find something worth discussing
        ↓
Write the email
        ↓
Record the lead
        ↓
Remember the follow-up
        ↓
Repeat tomorrow
```

Closing statement:

> Lead Automation System turns those disconnected actions into one defined workflow.

---

# 31. Homepage Evidence Section

Eyebrow:

> The difference is qualification

Heading:

# Don't Invent a Problem Just to Send an Email.

Copy direction:

> Generic outreach starts with a list and looks for an excuse to contact everyone on it. This system works in the opposite direction.

> A business is researched first. A website problem must be current, factual, relevant, and meaningful enough to justify outreach. If there isn't a defensible opportunity, the business can be rejected.

Visual:

```text
BUSINESS FOUND
      ↓
CURRENT SITE VERIFIED
      ↓
EVIDENCE COLLECTED
      ↓
REAL BUSINESS CONSEQUENCE?
   ↙          ↘
 NO           YES
 ↓             ↓
REJECT      QUALIFY
                ↓
          OUTREACH ANGLE
```

Callout:

> No verified opportunity means no manufactured sales angle.

---

# 32. Homepage Example Section

Heading:

# From Raw Lead to a Reason to Talk.

Use a clearly fictional example such as **Summit Ridge Roofing**.

Suggested cards:

### Discovered

Local roofing contractor with a current website.

### Inspected

Verified finding: a primary estimate link on a current service page leads to a dead end.

### Business consequence

A potential roofing customer attempting to request an estimate can fail to reach the conversion path.

### Outreach angle

Contact the business about the broken estimate path instead of sending a generic “your website could be better” pitch.

Supporting copy:

> The system teaches you to preserve that chain of evidence as automation increases.

---

# 33. Homepage Product Ladder

Eyebrow:

> Choose your level of automation

Heading:

# Start Where You Are. Automate From There.

Supporting copy:

> All four guides teach the same underlying client-acquisition logic. Each tier replaces more manual work with scheduled automation, APIs, workflows, or application infrastructure.

### Tier 1 card

**AI Prospecting Starter**

Badge: `TIER 1`

Descriptor: **Human supervised**

Copy:

> Build the fundamental workflow with ChatGPT, Google Workspace, and a campaign tracker.

Best for:

> Freelancers building a disciplined prospecting process for the first time.

CTA: **Explore Tier 1**

### Tier 2 card

**ChatGPT Client Acquisition System**

Badge: `TIER 2`

Descriptor: **Scheduled**

Copy:

> Turn the manual method into a recurring ChatGPT operating system connected to your Google tools.

Best for:

> Freelancers who want recurring research and follow-up management without APIs.

CTA: **Explore Tier 2**

### Tier 3 card

**Automated Lead Engine**

Badge: `TIER 3`

Descriptor: **Automated**

Copy:

> Connect discovery, website evidence, AI qualification, enrichment, outreach, and campaign events through n8n and APIs.

Best for:

> Freelancers and solo agencies ready to automate the pipeline.

CTA: **Explore Tier 3**

### Tier 4 card

**Production Lead Engine**

Badge: `TIER 4`

Descriptor: **Production**

Copy:

> Replace spreadsheet/workflow state with PostgreSQL, queues, workers, typed services, and production deployment.

Best for:

> Developers and agencies building the lead engine as real software.

CTA: **Explore Tier 4**

Below cards:

**Compare all four guides →**

---

# 34. Homepage Automation Progression

Use a clear visual such as:

```text
MORE HUMAN CONTROL                         MORE SYSTEM CONTROL

Tier 1              Tier 2             Tier 3             Tier 4
─────────────────────────────────────────────────────────────────
ChatGPT             ChatGPT Tasks      n8n + APIs         Node/TS
Google Sheets       Google Tools       Google Sheets      PostgreSQL
Manual approval     Scheduled work     Workflows          Workers
Manual process      Semi-autonomous    Unattended         Production
```

Do not imply human involvement is inherently bad.

---

# 35. Homepage Apollo Section

Heading:

# “Why Not Just Use Apollo?”

Copy direction:

> You can.

> Apollo can be useful for discovering companies and contacts, enriching records, managing sequences, and automating sales workflows. The guides do not require you to abandon it.

> The missing question is whether the business is actually a good web-development prospect.

Comparison:

| Question | Lead Automation System | Apollo / Contact Platform |
| --- | --- | --- |
| Should this business be contacted? | Website-specific qualification | May provide account data |
| Why should I contact it? | Verified website evidence | Not the core purpose |
| What should the message discuss? | Approved finding + consequence | Can store/use personalization |
| Who should receive it? | Defines contact requirement | Strong contact/enrichment capability |
| How should the campaign operate? | Defines system architecture and safeguards | Can execute parts of the sales workflow |

Closing copy:

> Think of Apollo as a possible component in the engine, not the methodology itself.

CTA:

**See the full system** → `/how-it-works/`

---

# 36. Homepage “What You'll Learn” Section

Heading:

# This Is an Implementation Manual, Not a Motivation Course.

Suggested groups:

### Prospecting architecture

- campaign design
- qualification rules
- durable state
- suppression
- deduplication

### Evidence

- current-site verification
- factual findings
- business consequences
- qualification
- rejection

### Outreach

- contact discovery
- personalized messaging
- follow-ups
- stop conditions

### Infrastructure

Varies by tier:

- Google Workspace
- ChatGPT
- Google Sheets
- n8n
- APIs
- Postgres
- queues
- workers

### Operations

- testing
- metrics
- failure handling
- cost controls
- deliverability safeguards

---

# 37. Homepage “Inside the Guides” Section

Heading:

# See What You're Actually Buying.

Use real PDF preview images when available.

Captions can include:

- Step-by-step implementation instructions
- Architecture explained before configuration begins
- Concrete workflow examples
- Checklists for critical launch steps

Supporting copy:

> Each guide is written to explain what a component does, why the system needs it, how to implement it, and what failure looks like.

Never use fake guide pages.

---

# 38. Homepage Tier Recommendation

Prefer a static decision tree in V1 rather than an elaborate quiz.

Heading:

# Which Guide Should You Start With?

```text
Do you already have a repeatable manual prospecting process?

NO
↓
TIER 1

YES
↓

Do you want recurring automation without APIs?

YES
↓
TIER 2

NO
↓

Do you want an automated system without building a custom backend?

YES
↓
TIER 3

NO
↓

Do you want to build the engine as a production application?

YES
↓
TIER 4
```

CTA:

**Compare Every Tier**

Do not ship a Svelte quiz unless later requirements show a real UX benefit.

---

# 39. Homepage Trust Section

Heading:

# Automation With Guardrails.

Feature statements:

### Evidence first

The system can reject a lead rather than invent a reason to contact it.

### Stop conditions

Replies, opt-outs, and hard bounces are treated as system state, not annoyances to route around.

### Controlled volume

The guides emphasize reputation and legitimate campaign operation rather than maximizing raw sends.

### Durable records

The system maintains enough state to avoid duplicate and inappropriate outreach.

### Progressive automation

Automation increases only after the underlying process is understood and tested.

---

# 40. Homepage FAQ

Display approximately six featured FAQs:

1. Is this a lead-generation service?
2. Do I need Apollo?
3. Do I need to know how to code?
4. Which tier should I start with?
5. Are these video courses?
6. What exactly do I receive after purchase?

CTA: **View all FAQs**

---

# 41. Homepage Final CTA

Heading:

# Build the System Instead of Repeating the Chore.

Copy:

> Start with the level that matches how you work today and build toward as much automation as you actually need.

Primary CTA: **Compare the Guides**

Secondary CTA: **View All Products**

---

# 42. Products Overview Page

Route: `/products/`

H1:

# Four Ways to Build the Same Client Acquisition System.

Intro:

> Every guide follows the same evidence-first prospecting architecture. What changes is who performs each step: you, ChatGPT, an automation workflow, or a production application.

Each product card should include:

- tier
- title
- automation level
- technical level
- short promise
- key tools
- best-for statement
- configured price
- product CTA

Follow the cards with a simplified comparison and link to `/compare/`.

---

# 43. Shared Product Page Structure

Every product page should follow the same base architecture:

1. Breadcrumb
2. Tier badge
3. Product title
4. Product descriptor
5. Hero cover image
6. Price
7. Purchase CTA
8. Best-for statement
9. What you will build
10. Architecture diagram
11. What the guide covers
12. Tools used
13. Automation level
14. Technical level / prerequisites
15. Inside-the-guide preview
16. What the guide deliberately does not do
17. Comparison with adjacent tier(s)
18. Relevant FAQ
19. Final purchase CTA

The product page should answer:

> What will I be capable of building after implementing this guide?

not merely:

> How many PDF pages do I get?

---

# 44. Tier 1 Product Page

Route: `/products/ai-prospecting-starter/`

H1:

# AI Prospecting Starter

Hero descriptor:

> Build a disciplined, evidence-based client prospecting workflow with ChatGPT, Google Workspace, and a campaign tracker.

Badge:

**Tier 1 · Human Supervised**

Best for:

> Freelance web developers who want a repeatable outbound process without APIs or automation builders.

Primary CTA:

**Buy AI Prospecting Starter — [configured price]**

If price is not configured, do not fabricate one.

### What you will build

> A human-supervised system in which ChatGPT helps research prospects and draft outreach while you verify the evidence, control the campaign tracker, approve messages, and send.

Architecture:

```text
YOU
 │
 ├── Define campaign
 │
 ▼
CHATGPT
 │
 ├── Discover / research
 │
 ▼
YOU VERIFY EVIDENCE
 │
 ▼
GOOGLE SHEETS
 │
 ├── Campaign state
 │
 ▼
CHATGPT
 │
 ├── Draft outreach
 │
 ▼
YOU SEND / FOLLOW UP
```

Section heading:

# Build the Foundation Before You Automate It.

What's covered:

- sending identity
- domain/mailbox fundamentals
- SPF
- DKIM
- DMARC
- sender reputation
- campaign design
- niche selection
- qualification criteria
- tracker setup
- ChatGPT research workflow
- lead verification
- website evidence
- contact discovery
- Hunter option
- Apollo option
- personalized outreach
- follow-up
- quality control
- metrics
- troubleshooting

Tools:

Primary:

- ChatGPT
- Google Workspace
- Google Sheets

Optional:

- Hunter
- Apollo

“This is not” section:

- unattended automation
- API automation
- bulk sending
- an Apollo requirement

Next-tier section:

**When Tier 2 makes sense**

> Upgrade when the workflow works but repeatedly initiating research, follow-up review, and reporting yourself has become the bottleneck.

CTA: **See Tier 2**

---

# 45. Tier 2 Product Page

Route: `/products/chatgpt-client-acquisition-system/`

H1:

# ChatGPT Client Acquisition System

Hero descriptor:

> Turn the Tier 1 method into a scheduled, semi-autonomous daily operating system using ChatGPT and connected Google tools.

Badge:

**Tier 2 · Scheduled**

Best for:

> Freelancers who want recurring research and pipeline management without building API workflows.

Primary CTA:

**Buy ChatGPT Client Acquisition System — [configured price]**

### What you will build

> A recurring ChatGPT workflow that reads campaign state, researches prospects, drafts outreach, identifies due follow-ups, reviews campaign activity, and produces operational reports.

Architecture:

```text
SCHEDULED TASK
      ↓
CHATGPT
      ↓
GOOGLE SHEETS ←→ CAMPAIGN STATE
      ↓
GMAIL / GOOGLE TOOLS
      ↓
DRAFT / REVIEW / ACTION
      ↓
UPDATED STATE
      ↓
RECURRING REPORTING
```

Section heading:

# Make the Process Recurring Without Building an API Stack.

Topics:

- scheduled ChatGPT workflows
- campaign state
- Drive/Sheets/Gmail connections
- recurring task architecture
- prospecting tasks
- follow-up/reply review
- weekly reporting
- task prompts
- sending safeguards
- testing
- supervision
- limitations
- troubleshooting
- metrics

Tools:

- ChatGPT
- Google Workspace
- Google Drive
- Google Sheets
- Gmail
- scheduled ChatGPT tasks
- optional Hunter
- optional Apollo

Not intended for:

- high-volume unattended processing
- n8n/API workflow orchestration
- custom backend infrastructure

Adjacent tiers:

**Tier 1:** Use when the manual methodology itself is not established.

**Tier 3:** Use when recurring ChatGPT tasks are no longer enough and provider APIs should become a true unattended workflow.

---

# 46. Tier 3 Product Page

Route: `/products/automated-lead-engine/`

H1:

# Automated Lead Engine

Hero descriptor:

> Deploy an unattended web-development prospecting pipeline with n8n, current website evidence, OpenAI, and Hunter or Apollo.

Badge:

**Tier 3 · Automated**

Best for:

> Freelancers and solo agencies that have a proven campaign and want unattended processing without building a custom application.

Primary CTA:

**Buy Automated Lead Engine — [configured price]**

### What you will build

```text
DISCOVERY
   ↓
NORMALIZE / DEDUPE
   ↓
CURRENT WEBSITE CONTENT
   ↓
AI QUALIFICATION
   ↓
QUALIFIED?
 ↙      ↘
NO      YES
↓        ↓
STOP   CONTACT ENRICHMENT
          ↓
       OUTREACH
          ↓
       SEQUENCE
          ↓
 REPLY / BOUNCE / OPT-OUT
          ↓
       STATE UPDATE
```

Section heading:

# Automate the Pipeline, Not the Mistakes.

Supporting copy:

> Tier 3 moves the system out of recurring manual sessions and into connected workflows. But every automated decision still depends on explicit data, evidence, state, and stop conditions.

Core topics:

- n8n setup
- API fundamentals
- credentials
- discovery APIs
- Firecrawl
- OpenAI API
- structured outputs
- lead schemas
- Google Sheets state
- domain normalization
- dedupe
- qualification
- evidence storage
- Hunter integration
- Apollo integration
- outreach generation
- sequences
- webhooks
- replies
- bounces
- opt-outs
- suppression
- error handling
- retry paths
- cost controls
- testing
- launch
- operations

Tools:

- n8n
- DataForSEO
- Firecrawl
- OpenAI API
- Google Workspace
- Google Sheets
- Hunter or Apollo

Important statement:

> The system is allowed to produce zero qualified leads from a batch. Automation does not create permission to fabricate findings.

Tier 3 vs Tier 4 comparison:

Tier 3:

- Google Sheets owns primary campaign state
- n8n orchestrates processing
- workflows handle retries
- workflows handle dedupe
- optimized for freelancer/solo operation

Tier 4:

- PostgreSQL owns state
- workers/services orchestrate processing
- queue infrastructure manages work
- database constraints enforce uniqueness
- built for stronger scale and extensibility

CTA: **See Tier 4**

---

# 47. Tier 4 Product Page

Route: `/products/production-lead-engine/`

H1:

# Production Lead Engine

Hero descriptor:

> Build and deploy a database-backed web-development lead automation application with Node.js/TypeScript, PostgreSQL, workers, queues, provider APIs, and production controls.

Badge:

**Tier 4 · Production**

Best for:

> Developers and agencies that want durable state, controlled concurrency, multiple campaigns, stronger auditability, and an architecture they can extend.

Primary CTA:

**Buy Production Lead Engine — [configured price]**

### What you will build

```text
                 ┌──────────────┐
                 │ PostgreSQL   │
                 │ System State │
                 └──────┬───────┘
                        │
                    jobs/state
                        │
                 ┌──────▼───────┐
                 │ Job Queue    │
                 └──────┬───────┘
                        │
                    WORKERS
         ┌──────────────┼──────────────┐
         ↓              ↓              ↓
     DISCOVERY       CRAWLING      QUALIFICATION
         │              │              │
         └──────────────┼──────────────┘
                        ↓
                   ENRICH / SEND
                        ↓
                  PROVIDER EVENTS
                        ↓
                    STATE UPDATE
```

Section heading:

# When a Workflow Becomes Software.

Copy:

> Tier 4 replaces spreadsheet-owned state and workflow-level reliability with a real application model: database constraints, queue jobs, workers, typed services, deployment, monitoring, retries, idempotency, and operational controls.

Topics:

- Node.js
- TypeScript
- project architecture
- Neon PostgreSQL
- schema design
- migrations
- unique constraints
- queues
- workers
- scheduling
- backoff
- dead-letter handling
- provider adapters
- DataForSEO
- Firecrawl
- OpenAI
- Hunter
- Apollo
- application services
- webhooks
- Railway deployment
- secrets
- health checks
- logging
- idempotency
- rate limiting
- budgets
- backups
- rollback
- testing
- launch
- operations
- scaling

Not intended for:

> Buyers looking for a one-click mailer or simple no-code workflow.

Section heading:

# Do You Actually Need Tier 4?

Copy:

> If a single freelancer campaign can operate comfortably in Google Sheets and n8n, Tier 3 is probably enough. Tier 4 exists for the point where durable concurrency, custom behavior, larger datasets, multiple campaigns, auditability, or application-level control justify real software infrastructure.

---

# 48. Compare Page

Route: `/compare/`

H1:

# Which Lead Automation System Is Right for You?

Intro:

> The underlying strategy does not change. The difference is how much of the workflow you want the system to execute for you.

Required comparison dimensions:

| Capability | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
| --- | --- | --- | --- | --- |
| Evidence-first qualification | Yes | Yes | Yes | Yes |
| Google Workspace | Yes | Yes | Yes | Yes |
| ChatGPT | Yes | Yes | API/AI layer | API/AI layer |
| Google Sheets state | Yes | Yes | Yes | Optional/non-primary |
| Human-led workflow | Primary | Reduced | Minimal operational | Administrative |
| Scheduled ChatGPT | No | Yes | Not primary | Not primary |
| APIs | No | No | Yes | Yes |
| n8n | No | No | Yes | Optional/non-primary |
| Automated discovery | No/assisted | Scheduled/assisted | Yes | Yes |
| Automated site evidence | No | Assisted | Yes | Yes |
| Automated qualification | Assisted | Assisted | Yes | Yes |
| Contact enrichment | Manual/optional | Assisted | Automated | Automated |
| Automated sequence integration | No | Limited/provider dependent | Yes | Yes |
| Webhooks | No | No | Yes | Yes |
| PostgreSQL | No | No | No | Yes |
| Job queue | No | No | No | Yes |
| Workers | No | No | No | Yes |
| Multi-campaign architecture | Manual | Limited | Possible | Designed for it |
| Best for | Learning the system | Recurring operation | Freelancer automation | Production software |
| Complexity | Low | Low-medium | Medium | High |

Quick recommendation:

**Choose Tier 1 if:** You need the methodology.

**Choose Tier 2 if:** The methodology works and you want ChatGPT handling recurring operations.

**Choose Tier 3 if:** You want the workflow running through connected APIs.

**Choose Tier 4 if:** You want to own the lead engine as a software system.

---

# 49. How It Works Page

Route: `/how-it-works/`

H1:

# The Lead Engine, From Discovery to Conversation.

This page explains the methodology independently of a particular tier.

Required sections:

## 1. Design the campaign

Define:

- service
- niche
- geography
- qualification requirements
- offer
- CTA
- contact requirements
- rejection rules
- send limits

## 2. Discover businesses

Discovery creates candidates, not automatically qualified prospects.

## 3. Verify the business

Confirm:

- company identity
- current website
- relevant service offering
- domain relationship

## 4. Inspect the current site

Collect current, observable evidence.

## 5. Qualify or reject

Ask whether the finding:

- is factual
- is current
- matters to the business
- relates to the offered service
- is sufficient to justify outreach

## 6. Find a legitimate contact

Use public business information and reputable contact tools.

Do not teach guessing attacks against possible email addresses.

## 7. Turn evidence into an angle

```text
Finding
↓
Business consequence
↓
Relevant improvement
↓
Concise outreach
```

## 8. Send deliberately

Maintain:

- sender identity
- authentication
- low/appropriate volume
- campaign state
- opt-out mechanisms

## 9. Follow up

Follow-up should depend on recorded state.

## 10. Stop when appropriate

Stop conditions include:

- reply
- opt-out
- hard bounce
- suppression state
- other campaign-defined exclusions

## 11. Measure the system

Measure:

- discovered leads
- researched leads
- qualified leads
- contacts found
- messages sent
- replies
- conversations
- consultations
- bounce rate
- opt-outs
- cost per qualified lead where relevant

Closing concept:

# Automate only after the decision process works.

Show all four tiers as increasingly automated implementations of these steps.

---

# 50. Articles Hub

Route: `/articles/`

H1:

# Client Acquisition Systems for Web Developers

Intro:

> Practical guides to prospecting, qualification, outreach, automation, and the infrastructure behind a repeatable web-development sales pipeline.

Article cards need:

- title
- description
- category
- publish date
- hero image

Initial target topics:

1. How to Find Businesses That Actually Need a New Website
2. How to Automate Web-Development Lead Generation
3. How to Use ChatGPT to Find Web-Development Clients
4. How to Analyze a Prospect's Website Before Cold Outreach
5. Why Generic Web-Design Cold Emails Get Ignored
6. How to Personalize Web-Development Outreach With AI
7. Apollo for Freelance Web Developers: Where It Fits
8. Apollo Alternatives for Web-Development Prospecting
9. How to Find Business Email Addresses Without Guessing
10. How to Build a Freelance Web-Development Sales Pipeline
11. How to Track Cold Outreach Without Losing Follow-Ups
12. When to Automate Your Freelance Prospecting
13. n8n for Web-Development Lead Generation
14. Google Sheets vs PostgreSQL for Lead Automation
15. How to Prevent AI From Inventing Website Problems
16. What Makes a Business a Qualified Web-Development Lead?

V1 does not require every planned article to exist at launch.

If fewer than approximately three genuinely useful articles exist, consider temporarily omitting Articles from primary navigation rather than launching an obviously empty section.

---

# 51. Article Layout

Each article page should include:

- breadcrumb
- title
- description/deck
- publication date
- updated date if present
- hero image
- article body
- table of contents for sufficiently long pieces
- inline images where useful
- related product CTA
- related articles
- author attribution where appropriate

Do not litter articles with repetitive sales banners.

One contextually relevant inline product CTA plus an end-of-article CTA is generally enough.

---

# 52. MDX Components

Provide a small controlled set of article presentation components, for example:

```text
<Callout>
<WorkflowDiagram>
<LeadExample>
<ProductCallout>
<Screenshot>
<ComparisonTable>
<ToolList>
<Warning>
```

Do not allow each article to become a bespoke UI implementation.

---

# 53. FAQ Page

Route: `/faq/`

H1:

# Frequently Asked Questions

Recommended content:

## About the products

### What do I receive?

> You receive the PDF implementation guide for the tier you purchase.

### Are these video courses?

> No. The V1 products are downloadable PDF implementation manuals.

### Do I get software?

> No. The guides teach you how to build and operate the systems using the tools described in the relevant tier.

## Choosing a tier

### Which tier should I start with?

> Start with the lowest tier whose prerequisites and workflow you already understand. Tier 1 establishes the core methodology. Tier 2 assumes you want recurring ChatGPT operation. Tier 3 introduces API automation. Tier 4 turns the architecture into production software.

### Do I have to buy the tiers in order?

> No. A technically experienced buyer can choose the tier appropriate to their existing skills and system.

## Tools

### Do I need Apollo?

> No. Apollo is optional in relevant workflows. It can serve as a useful discovery, enrichment, and outbound component, but the qualification methodology does not depend on Apollo.

### Do I need Hunter?

> Not for every tier. The relevant guides explain where contact discovery and verification tools fit into the architecture.

### Do I need Google Workspace?

> The guides are built around a legitimate business sending identity, and Google Workspace is the primary mailbox environment described by the system.

## Technical ability

### Do I need to know how to code?

> Not for Tier 1 or Tier 2. Tier 3 introduces APIs and n8n. Tier 4 requires building and deploying a software application even though the guide explains concepts from the beginning.

## Results

### Will this guarantee clients?

> No. The system provides a structured method for prospecting and outreach. Results still depend on your market, offer, positioning, evidence quality, messaging, deliverability, and sales ability.

### Is this a high-volume cold email system?

> No. The methodology emphasizes evidence-based personalized outreach, controlled sending, suppression, and sender reputation.

## Updates

### What version will I receive?

> Buyers receive the version currently distributed through the product delivery system according to the current sales terms.

Do not promise lifetime updates unless that policy is explicitly established.

---

# 54. About Page

Route: `/about/`

H1:

# Built From a Real Prospecting Problem.

Suggested direction:

> Lead Automation System grew from a practical problem: finding good web-development prospects took too much repetitive work, while conventional lead databases still left the most important question unanswered—why should this particular business want to talk to a web developer?

> The solution was not simply to automate sending. It was to define the decision process that happens before sending: verify the business, inspect the current site, preserve factual evidence, qualify the opportunity, find the appropriate contact, and only then create outreach.

> The four guides document increasingly automated versions of that system, from a human-supervised ChatGPT workflow through a production database-backed application.

Author section:

**Brian Woodson**

Position as:

- web developer
- builder of the system
- practitioner documenting the implementation

Do not use inflated credentials or unverifiable claims.

CTA: **Compare the Guides**

---

# 55. Legal Pages

Required routes:

- `/privacy/`
- `/terms/`
- `/refund-policy/`

Final legal language must be reviewed before production launch.

Coding agents must not casually invent binding commercial/legal promises.

Commercial/legal fields requiring explicit configuration include:

- refund window
- refund conditions
- support contact
- legal business name
- business address where required
- governing law if applicable
- update policy
- product license terms

---

# 56. Purchase Complete Page

Route: `/purchase-complete/`

H1:

# You're In.

Suggested copy:

> Your purchase is complete. Your download information is provided through the checkout and delivery system associated with your purchase.

> Start with the beginning of the guide even if you recognize some of the tools. The system is designed so that later automation depends on decisions made earlier in the workflow.

Support line:

> If you have a problem accessing your purchase, contact [configured support email].

Never expose direct PDF paths.

---

# 57. Header Behavior

Desktop:

- logo left
- navigation center/right
- primary CTA right

Header may become subtly solid/sticky after scroll if desired.

Avoid oversized sticky headers.

Mobile:

- accessible menu button
- `aria-expanded` or equivalent state communication
- keyboard-accessible navigation
- Escape closes menu where appropriate
- focus behavior remains correct

---

# 58. Footer

Footer sections:

### Products

- AI Prospecting Starter
- ChatGPT Client Acquisition System
- Automated Lead Engine
- Production Lead Engine

### Learn

- How It Works
- Compare
- Articles
- FAQ

### Company

- About
- support/contact email

### Legal

- Privacy
- Terms
- Refund Policy

Bottom:

`© [current year] Lead Automation System. All rights reserved.`

Do not include meaningless social icons when there are no active social properties.

---

# 59. Visual Direction

Overall aesthetic:

- dark
- minimal
- technical
- premium
- serious
- restrained
- highly legible

The site should feel like documentation and engineering translated into a polished commercial product.

It should not feel like:

- generic internet-marketing funnel
- crypto landing page
- AI hype site
- corporate SaaS clone
- online-course template

---

# 60. Color System

Use semantic design tokens.

Provisional direction:

```text
background-primary: near-black charcoal
background-secondary: slightly lighter charcoal
surface: elevated dark neutral
surface-hover: lighter neutral

text-primary: warm off-white
text-secondary: muted neutral
text-subtle: subdued gray

accent-primary: strong clear blue
accent-primary-hover: brighter/lighter blue

success: restrained green
warning: amber
danger/problem: restrained red

border: low-contrast neutral
focus: highly visible blue/white
```

Do not scatter raw color values throughout components.

Problem/rejection states may use restrained red.

System/solution/action states should primarily use blue.

---

# 61. Typography

Typography should prioritize reading.

Use:

- strong sans-serif display/headline face
- highly legible body sans serif
- monospace selectively for architecture, code, field names, or system diagrams

Avoid:

- novelty tech fonts
- tiny body text
- excessive all-caps text
- overuse of monospace

Article body width should remain comfortable for long-form reading.

---

# 62. Layout

Use generous but not wasteful spacing.

Recommended maximum widths:

- normal marketing content: roughly 1100–1280px
- long-form article body: roughly 680–760px
- wide comparisons: site max width

Build mobile-first.

Avoid huge blank sections whose only purpose is to simulate premium design.

---

# 63. Visual Motifs

Prefer visuals based on:

- pipelines
- nodes
- connectors
- state transitions
- evidence cards
- data records
- workflow diagrams
- architecture diagrams
- guide page previews
- code/config snippets where appropriate

These motifs reinforce the actual product.

---

# 64. Animation

Animation should be subtle.

Allowed:

- slight hover transitions
- accordion expansion
- menu transitions
- restrained entrance animation if performance-safe
- pipeline highlight states

Avoid:

- constant floating objects
- parallax
- animated gradient blobs
- excessive scroll-trigger effects
- autoplay backgrounds
- long page transitions

Respect `prefers-reduced-motion`.

---

# 65. Starwind UI

Use existing Starwind UI components where they genuinely fit.

Do not rebuild generic primitives unnecessarily when Starwind already provides an accessible, style-compatible version.

However:

- do not force Starwind where simple semantic Astro markup is better
- do not leave the site looking like an untouched component-library demo
- customize tokens and composition to create a distinct Lead Automation System identity

---

# 66. Svelte Usage

Default to Astro.

Use Svelte only when browser-side state is genuinely required.

Potentially justified Svelte usage:

- advanced mobile navigation if needed
- future interactive article filtering
- future tier-selector interaction if explicitly approved

Do not use Svelte for:

- product cards
- hero sections
- pricing
- static comparisons
- workflow diagrams
- ordinary CTAs
- article layout
- footer

Do not hydrate static content.

---

# 67. Component Architecture

Likely reusable components:

```text
SiteHeader.astro
SiteFooter.astro
Logo.astro

Hero.astro
SectionHeader.astro
CTASection.astro

ProductCard.astro
ProductGrid.astro
ProductBadge.astro
ProductHero.astro
ProductCTA.astro
ProductPreview.astro
ProductComparison.astro

WorkflowDiagram.astro
ArchitectureDiagram.astro
LeadExample.astro
EvidenceFlow.astro

ArticleCard.astro
ArticleGrid.astro
ArticleTOC.astro
RelatedArticles.astro

FAQList.astro
FAQItem.astro

Breadcrumbs.astro
Callout.astro
ToolBadge.astro
ScreenshotFrame.astro
```

Do not create abstraction-heavy component systems before real repetition exists.

---

# 68. Site Configuration

Create centralized configuration.

Example:

```ts
export const siteConfig = {
  name: "Lead Automation System",
  description:
    "Implementation guides for building evidence-first client acquisition systems for freelance web developers.",
  url: "",
  supportEmail: "",

  commerce: {
    provider: "lemonsqueezy"
  }
};
```

Do not duplicate these values across pages.

---

# 69. Price Handling

Final retail prices are not defined by this specification unless later configured explicitly.

Each product supports:

```ts
price
checkoutUrl
```

No component should contain an independently hardcoded retail price.

If a price is not configured:

- development may omit the purchase button or render an obvious dev-only placeholder
- production must never render `[PRICE]`, `$0`, `undefined`, or a fabricated amount

---

# 70. Checkout Handling

Create one shared purchase CTA component.

It receives product data and generates the correct checkout action.

Do not scatter raw checkout URLs across page templates.

Track checkout CTA clicks through analytics.

If Lemon Squeezy overlay checkout is later used, isolate that integration from general components so commerce can be changed without rewriting product pages.

---

# 71. SEO Requirements

Every indexable page needs:

- unique `<title>`
- unique meta description
- canonical URL
- Open Graph title
- Open Graph description
- Open Graph image where applicable
- social metadata as appropriate

Generate:

- sitemap
- robots.txt

Use structured data only when valid:

- `Organization`
- `WebSite`
- `Product`
- `BreadcrumbList`
- `Article`
- `FAQPage` only if current search-engine guidance makes it appropriate

Never use schema to claim reviews, ratings, prices, inventory, or offers that are not real.

Product structured data should derive from the same product data used to render visible product pages.

---

# 72. Suggested Homepage Metadata

Title:

**Lead Automation System | Client Acquisition for Web Developers**

Description:

> Build an evidence-first web-development prospecting system with ChatGPT, automation workflows, APIs, or production application infrastructure.

---

# 73. Suggested Product SEO Titles

Tier 1:

**AI Prospecting Starter for Web Developers | Lead Automation System**

Tier 2:

**ChatGPT Client Acquisition System for Web Developers**

Tier 3:

**Automated Lead Engine with n8n & AI for Web Developers**

Tier 4:

**Production Lead Automation System for Web Developers**

Adjust for sensible search-result length during implementation.

---

# 74. Article SEO Rules

Articles should target real informational intent.

Avoid:

- keyword stuffing
- near-duplicate articles
- artificial city/location pages
- dozens of thin comparison posts
- AI-generated filler

Content quality should reflect the same precision as the paid guides.

---

# 75. Internal Linking

Articles should naturally link to:

- relevant methodology sections
- appropriate product(s)
- related articles

Product pages should link to:

- comparison page
- how-it-works page
- adjacent tiers
- relevant articles

Avoid excessive keyword-rich link repetition.

---

# 76. Performance Requirements

Primary goal: a mostly static site with minimal client JavaScript.

Requirements:

- Astro static rendering where possible
- optimized local images
- known image dimensions/aspect ratios
- minimized layout shift
- lazy loading for non-critical images
- no unnecessary third-party scripts
- no huge animation libraries without justification
- no SPA conversion
- no hydration of static marketing sections

Target excellent Core Web Vitals rather than chasing a cosmetic Lighthouse score.

---

# 77. Accessibility Requirements

Target **WCAG 2.2 AA**.

Requirements:

- correct landmarks
- one logical H1 per page
- hierarchical headings
- keyboard-operable controls
- strong visible focus states
- sufficient color contrast
- accessible mobile navigation
- accessible accordions
- accessible tables
- no color-only communication
- descriptive link text
- meaningful image alt text
- decorative imagery hidden appropriately
- reduced motion support
- proper form labels
- no hover-only information
- adequate touch targets

Accessibility is part of component implementation, not a final cleanup task.

---

# 78. Comparison Table Accessibility

Desktop comparison table must use semantic table markup.

Mobile may:

- use controlled horizontal scrolling
- or transform to tier-by-tier grouped cards

Do not remove information on smaller screens.

---

# 79. Analytics

Use lightweight analytics with an easily replaceable provider.

Track at minimum:

```text
page_view
product_view
compare_view
product_cta_click
checkout_click
article_product_cta_click
```

Useful properties:

```text
product_slug
tier
source_page
cta_location
```

Do not collect sensitive data unnecessarily.

---

# 80. Search Console / Webmaster Preparation

Production site should support:

- Google Search Console verification
- sitemap submission
- canonical domain

Use deployment/config mechanisms rather than hardcoding sensitive verification data where inappropriate.

---

# 81. Social Sharing

Product and article pages should have purposeful social preview imagery.

Recommended:

- default site OG image
- product-specific OG images
- article-specific hero image where appropriate

Do not reuse generic AI imagery everywhere.

---

# 82. Error Handling

Required:

- custom 404 experience
- graceful handling of missing product content
- build failure for malformed required content where feasible
- no silent rendering of broken checkout state

External checkout errors are primarily Lemon Squeezy's responsibility, but broken local configuration must be detectable during QA.

---

# 83. Security

V1 has a small attack surface because there is no custom application backend.

Requirements:

- no secrets committed to Git
- no Lemon Squeezy secret API keys exposed client-side
- no sellable PDF files in public website directories
- appropriate security headers through deployment where practical
- safe external-link handling
- dependency maintenance

---

# 84. Content Integrity Rules

Agents must not invent:

- product capabilities
- included downloads
- testimonials
- customer counts
- customer logos
- revenue numbers
- conversion rates
- reply rates
- client counts
- guarantees
- external tool capabilities
- external tool pricing
- screenshots purporting to be real
- legal conclusions

If required content is missing, use clearly marked development placeholders or omit the element rather than fabricating commercial claims.

---

# 85. Product Claim Rules

Allowed:

> Build a repeatable client-acquisition system.

Not allowed:

> Generate 20 clients every month.

Allowed:

> Automate repetitive prospecting operations.

Not allowed:

> Get clients on autopilot while you sleep.

Allowed:

> Qualify prospects from current website evidence.

Not allowed:

> AI automatically finds businesses guaranteed to buy from you.

Allowed:

> Reduce repetitive manual work.

Not allowed:

> Never prospect manually again.

---

# 86. Compliance Positioning

Trust messaging should make clear that:

- users are responsible for applicable law
- users are responsible for provider terms
- users are responsible for sender reputation
- users must honor opt-outs
- automation must not fabricate evidence
- automation must not be used to evade provider controls

Do not make sweeping legal claims about what is universally legal.

---

# 87. Responsive Requirements

Use Tailwind's standard responsive strategy unless a real design requirement justifies custom breakpoints.

Test representative widths around:

- 320px
- 375px
- 430px
- 768px
- 1024px
- 1280px
- 1440px+

No desktop-only composition may become unusable below tablet widths.

---

# 88. Article Reading Experience

Long-form articles require:

- comfortable line height
- readable line length
- clear H2/H3 hierarchy
- table overflow handling
- code-block horizontal scrolling
- strong code contrast
- image captions where useful
- visible links
- accessible callouts

Do not style articles like sales landing pages.

---

# 89. Target Repository Structure

```text
src/
├── assets/
│   ├── articles/
│   ├── brand/
│   ├── diagrams/
│   ├── examples/
│   ├── products/
│   └── screenshots/
│
├── components/
│   ├── articles/
│   ├── layout/
│   ├── marketing/
│   ├── products/
│   └── ui/
│
├── content/
│   ├── articles/
│   ├── faqs/
│   └── products/
│
├── layouts/
│   ├── BaseLayout.astro
│   ├── ArticleLayout.astro
│   └── ProductLayout.astro
│
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── compare.astro
│   ├── faq.astro
│   ├── how-it-works.astro
│   ├── privacy.astro
│   ├── refund-policy.astro
│   ├── terms.astro
│   ├── purchase-complete.astro
│   │
│   ├── articles/
│   │   ├── index.astro
│   │   └── [slug].astro
│   │
│   └── products/
│       ├── index.astro
│       └── [slug].astro
│
├── styles/
│   └── global.css
│
├── utils/
├── content.config.ts
└── config.ts
```

Adjust only when Astro conventions or the existing project make another organization clearly superior.

---

# 90. Development Rules for Agents

1. Read this file before implementing features.
2. Treat it as the V1 source of truth.
3. Preserve the existing Astro stack.
4. Do not add a CMS.
5. Do not add a database.
6. Do not add authentication.
7. Do not add application infrastructure V1 does not require.
8. Prefer Astro over hydrated framework components.
9. Use Svelte only for genuine client interaction.
10. Use Starwind where it adds value rather than recreating generic UI without reason.
11. Store repeating product information once.
12. Do not duplicate product facts across unrelated components.
13. Keep pricing centralized.
14. Keep checkout URLs centralized.
15. Use content collections for products, articles, and FAQs.
16. Use Astro-managed local images.
17. Do not store sellable PDFs in publicly accessible site assets.
18. Build semantic HTML first.
19. Build accessibility into components.
20. Preserve static-site performance.
21. Do not fabricate commercial claims.
22. Do not fabricate customer proof.
23. Do not add features merely because they are common on SaaS sites.
24. Do not expand scope without an explicit requirement.
25. Run the production build before considering implementation complete.

---

# 91. Development Sequence

## Phase 1 — Foundation

Implement:

- global design tokens
- global styles
- typography
- site configuration
- base layout
- header
- footer
- SEO utilities
- content collection schemas

## Phase 2 — Product System

Implement:

- four product content entries
- product card
- product badge
- product grid
- product layout
- product hero
- product CTA
- product preview
- dynamic product route

## Phase 3 — Core Sales Pages

Implement:

- homepage
- products overview
- compare
- how it works

## Phase 4 — Article System

Implement:

- article collection
- article layout
- articles index
- article route
- MDX components
- related product CTA

## Phase 5 — Supporting Pages

Implement:

- FAQ
- About
- Privacy
- Terms
- Refund Policy
- purchase complete
- 404

## Phase 6 — Commerce

Implement:

- Lemon Squeezy product configuration
- checkout URLs
- shared checkout component
- checkout click analytics
- complete test purchase flow

## Phase 7 — SEO / Analytics / Polish

Implement:

- metadata
- structured data
- sitemap
- robots
- OG imagery
- analytics
- Search Console preparation

## Phase 8 — QA

Test all acceptance criteria below.

---

# 92. Launch Content Requirements

Minimum content before production launch:

- completed homepage
- products overview
- all four product pages
- comparison page
- how-it-works page
- FAQ
- About
- finalized legal pages
- final product covers
- real product prices
- working Lemon Squeezy products
- real checkout links
- support email
- final domain
- enough articles that the Articles section does not appear abandoned

If the content library is too thin, omit Articles from primary navigation until it is credible.

---

# 93. Product Preview Requirement

Before launch, each product should ideally have:

- final cover image
- at least 2–3 representative preview images from the real PDF

No fake guide pages.

---

# 94. Testimonials

V1 does not require testimonials.

If no legitimate testimonials exist, do not create a testimonial section.

The site should sell through:

- specificity
- visible methodology
- actual product previews
- architecture
- clear product differentiation

rather than fabricated social proof.

---

# 95. Future Features Explicitly Deferred

Future versions may eventually explore:

- customer accounts
- web-based guide access
- update libraries
- downloadable templates
- workflow files
- source code
- configuration generators
- interactive calculators
- system builders
- customer-specific tool-stack recommendations
- community
- subscriptions
- SaaS implementation

None of these should complicate V1 architecture now.

Avoid premature infrastructure for hypothetical features.

---

# 96. V1 Definition of Done

The website is V1-complete when all of the following are true.

## Product clarity

- A first-time visitor can explain what the product does after reading the hero and first sections.
- The visitor understands the products are implementation guides.
- The visitor understands the deliverable is a PDF.
- The visitor understands the four-tier progression.
- The visitor understands higher tiers represent more automation and infrastructure.

## Product differentiation

- Tier 1 clearly represents human-supervised ChatGPT prospecting.
- Tier 2 clearly represents scheduled ChatGPT operation.
- Tier 3 clearly represents n8n/API automation.
- Tier 4 clearly represents a production application.

## Positioning

- The site does not present the products as spam automation.
- Evidence-first qualification is prominent.
- Apollo's role is explained accurately.
- The site does not depend on hype or guaranteed-results claims.

## Commerce

- Each product displays the correct configured price.
- Each purchase CTA reaches the correct checkout.
- Successful purchases deliver the correct PDF through Lemon Squeezy.
- Product PDFs are not exposed from public website paths.

## Content

- All required marketing pages exist.
- All four product pages contain accurate guide content.
- FAQ content is accurate.
- Legal pages contain finalized commercial information.
- Article infrastructure works.

## Technical

- production build succeeds
- no console errors in normal use
- no broken routes
- no broken images
- no broken checkout links
- no missing metadata
- sitemap works
- robots.txt works
- 404 works

## Performance

- static content is not unnecessarily hydrated
- images are optimized
- pages are responsive
- layout shift is minimized
- third-party scripts are controlled

## Accessibility

- keyboard navigation works
- focus indicators are visible
- mobile navigation is accessible
- headings are logical
- images have correct alternative treatment
- tables remain usable
- contrast meets requirements
- reduced-motion preference is respected

## Content integrity

- no fake testimonials
- no fake customers
- no fake screenshots
- no fabricated statistics
- no invented deliverables
- no unapproved prices
- no guaranteed-results claims

---

# 97. Final V1 Product Statement

Lead Automation System V1 is:

> A fast, static, content-driven Astro commerce site that sells four downloadable PDF implementation guides teaching freelance web developers how to build increasingly automated, evidence-first client acquisition systems.

Its primary strength should be **clarity**.

A buyer should be able to understand:

```text
WHAT THE SYSTEM DOES
        ↓
WHY THE METHOD IS DIFFERENT
        ↓
WHAT EACH TIER BUILDS
        ↓
WHICH TIER FITS THEM
        ↓
WHAT THEY RECEIVE
        ↓
HOW TO BUY IT
```

Anything that does not materially improve one of those steps should be treated skeptically for V1.
