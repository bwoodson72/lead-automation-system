# Lead Automation System — V1 Website Product Specification

**Status:** Source of truth for V1 product, content, information architecture, design direction, and acceptance criteria.

This file defines what the website must communicate and contain. Engineering implementation rules live in the repository root `AGENTS.md`. Coding agents must read both files before planning or implementing work.

---

## 1. Product Summary

Lead Automation System is a four-tier family of downloadable PDF implementation manuals for freelance web developers and small web-development agencies.

The guides teach increasingly automated versions of the same evidence-first client-acquisition system:

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

The website is a marketing and commerce site. It is not the lead-generation application itself.

The website must:

1. Explain the methodology clearly.
2. Show the difference between the four tiers.
3. Help a visitor choose the correct tier without contacting support.
4. Establish that the products teach complete systems rather than isolated prompts.
5. Sell the four PDF guides through Lemon Squeezy.
6. Support long-term organic acquisition through educational articles.
7. Show credible product imagery, diagrams, examples, and real PDF previews.
8. Remain fast, static-first, accessible, and easy to maintain without a CMS or application backend.

---

## 2. Brand and Umbrella Positioning

### Brand name

**Lead Automation System**

Do not invent a different parent brand without an explicit instruction.

### Primary positioning

# Build Your Own Web-Development Client Acquisition System

Supporting message:

> Learn how to find businesses with real website opportunities, qualify them using evidence, turn that evidence into personalized outreach, manage follow-ups, and progressively automate the entire pipeline.

### Central product principle

> Find a defensible reason to contact the business before writing the email.

### Most important differentiation

The product is not primarily about sending more email. It is about building a better system for deciding **who should receive an email and why**.

---

## 3. What the Product Is

Lead Automation System teaches customers how to:

- identify businesses that may need web-development help
- verify that the business and website are legitimate and current
- inspect the existing website
- distinguish meaningful sales opportunities from arbitrary criticism
- reject businesses when there is no defensible reason to contact them
- find legitimate business contact information
- create outreach based on verified evidence
- manage follow-ups
- stop outreach appropriately
- preserve campaign state
- progressively automate repetitive parts of the process
- test the system before increasing automation or volume
- measure whether the campaign is creating legitimate conversations

The guides are implementation manuals, not motivational courses.

---

## 4. What the Product Is Not

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
- software that runs the full system for the purchaser

The customer is purchasing a downloadable PDF implementation manual for the selected tier.

---

## 5. Primary Audience

Primary audience:

**Freelance web developers and solo/small web-development agencies that need a repeatable client-acquisition system.**

Typical buyer characteristics:

- can build websites but may have little formal sales-system experience
- may depend heavily on referrals
- may prospect manually and inconsistently
- may already experiment with ChatGPT
- may use Google Workspace
- may have tried Apollo, Hunter, or similar platforms
- may want automation but not understand how the tools fit together
- may not understand DNS, deliverability, APIs, n8n, queues, or databases
- may be technically capable but still need a system architecture rather than another collection of tools

The guides explain concepts from first principles, but the technical difficulty rises substantially across tiers.

---

## 6. Core Buyer Problems

### 6.1 Fragmented manual prospecting

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

The problem is not simply that prospecting takes time. The process often has no defined operating architecture.

### 6.2 Generic outreach

A large list is not useful if there is no credible reason to contact each business.

The methodology emphasizes:

```text
EVIDENCE
   ↓
QUALIFICATION
   ↓
BUSINESS CONSEQUENCE
   ↓
OUTREACH ANGLE
```

### 6.3 Tools without strategy

A freelancer can subscribe to ChatGPT, Apollo, Hunter, n8n, and other services and still not have a functioning acquisition system.

Tools are components. The product teaches the architecture.

### 6.4 Automation amplifies mistakes

Automating fabricated findings, poor qualification, duplicates, broken suppression, or weak messaging makes the system worse. The product therefore introduces automation progressively and preserves the same decision logic at every tier.

---

## 7. Product Ladder

Always present the product family as a progression.

```text
TIER 1
AI Prospecting Starter
Human supervised
You + ChatGPT + Google Sheets

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

Do not imply that Tier 4 is inherently the best choice. The correct tier is the lowest one that matches the buyer's current process, technical ability, and desired level of automation.

---

## 8. Tier 1 — AI Prospecting Starter

### Short descriptor

Build a disciplined, evidence-based prospecting workflow with ChatGPT, Google Workspace, and a campaign tracker.

### Intended customer

Freelance web developers who want a repeatable outbound process without APIs or automation builders.

### What the customer builds

A human-supervised workflow in which ChatGPT assists with research and outreach drafting while the customer:

- defines the campaign
- verifies each business and website
- verifies evidence
- controls the campaign tracker
- approves outreach
- sends messages
- manages follow-up
- supervises the full process

### Topics covered

- system fundamentals
- sending domain and mailbox foundation
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
- upgrade path to Tier 2

### Automation level

Low. AI-assisted but human controlled.

### Technical level

Beginner.

### Product-page positioning

> Stop prospecting randomly. Build the process first.

### Deliberate non-capabilities

Tier 1 does not provide or teach a production implementation of:

- unattended lead processing
- API automation
- n8n workflows
- database infrastructure
- production application development

---

## 9. Tier 2 — ChatGPT Client Acquisition System

### Short descriptor

Turn the Tier 1 method into a scheduled, semi-autonomous operating system using ChatGPT, Google Drive, Google Sheets, Gmail, and recurring tasks.

### Intended customer

Freelancers who have proven the basic prospecting method and want recurring research and pipeline management without learning APIs.

### What the customer builds

A scheduled ChatGPT workflow that can:

- read durable campaign state
- research prospects
- draft outreach
- identify due follow-ups
- review campaign activity and replies
- maintain recurring campaign operations
- produce recurring reports

The system remains deliberately low-volume and appropriately supervised.

### Topics covered

- scheduled ChatGPT automation
- sending foundation
- campaign design
- Google Sheets as durable state
- Google Drive
- Gmail connection
- task architecture
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
- upgrade path to APIs and n8n

### Automation level

Moderate. Scheduled and semi-autonomous.

### Technical level

Beginner to intermediate. No API knowledge required.

### Product-page positioning

> Make prospecting a recurring system instead of a recurring chore.

### Deliberate non-capabilities

Tier 2 is not the high-volume unattended implementation. It does not center on:

- n8n orchestration
- custom API pipelines
- application databases
- worker infrastructure

---

## 10. Tier 3 — Automated Lead Engine

### Short descriptor

Deploy an unattended web-development prospecting pipeline with n8n, current website evidence, OpenAI, and Hunter or Apollo.

### Intended customer

Freelancers and solo agencies with a proven campaign that want automated processing without building a custom application.

### What the customer builds

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

### Core technologies

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

### Topics covered

- architecture
- service accounts
- campaign/data schemas
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
- retry paths
- error handling
- daily caps
- metrics
- cost controls
- testing
- dry runs
- launch
- troubleshooting
- upgrade path to Tier 4

### Automation level

High. Designed for unattended processing after correct implementation and testing.

### Technical level

Intermediate. The guide explains concepts from the beginning, but implementation involves APIs, credentials, data structures, and n8n workflows.

### Product-page positioning

> Connect the entire pipeline and let the system do the repetitive work.

### Architectural boundary

Tier 3 remains freelancer-scale workflow automation:

- Google Sheets is the primary campaign state store
- n8n is the primary orchestration layer
- workflow logic handles retries and deduplication

---

## 11. Tier 4 — Production Lead Engine

### Short descriptor

Build and deploy a database-backed lead automation application with Node.js/TypeScript, PostgreSQL, durable jobs, workers, provider integrations, and production controls.

### Intended customer

Developers and agencies that need:

- durable scale
- controlled concurrency
- multiple campaigns
- stronger auditability
- extensibility
- production software architecture

### What the customer builds

A real application in which:

- PostgreSQL owns durable state
- queues own pending work
- workers execute processing
- providers collect evidence
- structured AI makes qualification decisions
- outbound providers handle appropriate sending responsibilities
- external events synchronize state
- externally visible actions are idempotent and auditable

### Core technologies

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

### Topics covered

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

### Automation level

Production-grade.

### Technical level

Advanced implementation, even though the manual explains concepts from first principles.

### Product-page positioning

> When a workflow is no longer enough, build the system as software.

### Tier 3 vs Tier 4

Tier 3:

```text
Google Sheets = primary state
n8n = primary orchestrator
workflow = unit of execution
workflow logic = retries / dedupe
```

Tier 4:

```text
PostgreSQL = system of record
workers/services = orchestrators
queue job = unit of execution
database/queue policies = retries / dedupe
```

---

## 12. Deliverable Format

Each paid product is a **single downloadable PDF**.

Do not imply additional downloads unless they are explicitly added later.

Do not advertise separate:

- spreadsheet templates
- source-code downloads
- prompt-pack files
- workflow exports
- n8n JSON files
- ZIP archives
- bonus guides
- dashboards
- software access
- accounts

The PDF may itself contain prompts, worksheets, code examples, diagrams, tables, and checklists. Those are contents inside the guide, not separate deliverables.

---

## 13. Commerce

Use Lemon Squeezy for V1.

Store name:

**Lead Automation System**

Create four separate Lemon Squeezy products, one per guide.

Lemon Squeezy owns:

- checkout
- payment processing
- receipts
- protected digital PDF delivery
- merchant-of-record functionality provided by the platform

The Astro website must not process card data and must not publicly host the sellable PDFs.

### Purchase flow

```text
VISITOR
   ↓
MARKETING / PRODUCT PAGE
   ↓
BUY GUIDE
   ↓
LEMON SQUEEZY CHECKOUT
   ↓
PAYMENT
   ↓
LEMON SQUEEZY PDF DELIVERY
   ↓
OPTIONAL RETURN TO /purchase-complete/
```

No website account is required.

---

## 14. V1 Technical Shape

The public site is a static-first Astro commerce site.

```text
Astro
│
├── Marketing pages
├── Product content collection
├── Article content collection
├── FAQ content collection
├── Local optimized images
├── Starwind UI components
├── Tailwind CSS v4 theme/tokens
├── Minimal Svelte only when real client-side state is required
│
└── Lemon Squeezy
    └── Checkout + PDF delivery
```

Hosting: Vercel.

No database or custom backend API is required for core V1 functionality.

---

## 15. Information Architecture and Routes

Required routes:

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

Use consistent trailing-slash behavior.

### Primary navigation

Desktop navigation:

- Products
- Compare
- How It Works
- Articles
- FAQ

Primary header CTA:

**Choose Your Guide**

Logo links to `/`.

Products may use a Starwind dropdown/navigation component if it improves usability. Mobile navigation must expose the same core routes.

---

## 16. Homepage Objective

The homepage must answer, in roughly this order:

1. What is this?
2. Why would I need it?
3. What is different about the methodology?
4. How does the system work?
5. Which tier is right for me?
6. What will I learn/build?
7. Why not just use Apollo or another contact platform?
8. What exactly do I receive?
9. How do I buy?

The homepage should not try to teach every implementation detail.

---

## 17. Homepage Content Specification

### 17.1 Hero

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

Trust line:

> Four implementation guides. From AI-assisted prospecting to a production-grade lead engine.

Hero visual:

```text
DISCOVER → VERIFY → ANALYZE → QUALIFY → CONTACT → OUTREACH → FOLLOW UP → TRACK
```

Use a technical pipeline/flow composition, not decorative AI imagery.

### 17.2 Problem section

Heading:

# Prospecting Usually Isn't One Problem. It's Ten Small Jobs.

Copy direction:

> Finding a potential client is only the beginning. You still have to determine whether the business is worth contacting, inspect its current site, find a legitimate contact, decide what matters enough to mention, write the message, track what happened, and remember when to follow up.

> Most freelancers do those jobs manually and inconsistently. The result is a process that consumes hours without ever becoming a real system.

Visual:

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

Closing line:

> Lead Automation System turns those disconnected actions into one defined workflow.

### 17.3 Evidence-first section

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

### 17.4 Worked example

Heading:

# From Raw Lead to a Reason to Talk.

Use a clearly fictional example such as **Summit Ridge Roofing**.

Card 1 — Discovered:

> Local roofing contractor with a current website.

Card 2 — Inspected:

> Verified finding: a primary estimate link on a current service page leads to a dead end.

Card 3 — Business consequence:

> A potential roofing customer attempting to request an estimate can fail to reach the conversion path.

Card 4 — Outreach angle:

> Contact the business about the broken estimate path instead of sending a generic “your website could be better” pitch.

Supporting line:

> The system teaches you to preserve that chain of evidence as automation increases.

### 17.5 Product ladder

Eyebrow:

> Choose your level of automation

Heading:

# Start Where You Are. Automate From There.

Supporting copy:

> All four guides teach the same underlying client-acquisition logic. Each tier replaces more manual work with scheduled automation, APIs, workflows, or application infrastructure.

#### Tier 1 card

**AI Prospecting Starter**

- Badge: `TIER 1`
- Descriptor: **Human supervised**
- Copy: Build the fundamental workflow with ChatGPT, Google Workspace, and a campaign tracker.
- Best for: Freelancers building a disciplined prospecting process for the first time.
- CTA: **Explore Tier 1**

#### Tier 2 card

**ChatGPT Client Acquisition System**

- Badge: `TIER 2`
- Descriptor: **Scheduled**
- Copy: Turn the manual method into a recurring ChatGPT operating system connected to your Google tools.
- Best for: Freelancers who want recurring research and follow-up management without APIs.
- CTA: **Explore Tier 2**

#### Tier 3 card

**Automated Lead Engine**

- Badge: `TIER 3`
- Descriptor: **Automated**
- Copy: Connect discovery, website evidence, AI qualification, enrichment, outreach, and campaign events through n8n and APIs.
- Best for: Freelancers and solo agencies ready to automate the pipeline.
- CTA: **Explore Tier 3**

#### Tier 4 card

**Production Lead Engine**

- Badge: `TIER 4`
- Descriptor: **Production**
- Copy: Replace spreadsheet/workflow state with PostgreSQL, queues, workers, typed services, and production deployment.
- Best for: Developers and agencies building the lead engine as real software.
- CTA: **Explore Tier 4**

Below cards:

**Compare all four guides →**

### 17.6 Automation progression

Use a readable comparison:

```text
MORE HUMAN CONTROL                         MORE SYSTEM CONTROL

Tier 1              Tier 2             Tier 3             Tier 4
─────────────────────────────────────────────────────────────────
ChatGPT             ChatGPT Tasks      n8n + APIs         Node/TS
Google Sheets       Google Tools       Google Sheets      PostgreSQL
Manual approval     Scheduled work     Workflows          Workers
Manual process      Semi-autonomous    Unattended         Production
```

Do not frame human involvement as a defect.

### 17.7 Apollo objection

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
| Why should I contact it? | Verified website evidence | Not its core purpose |
| What should the message discuss? | Approved finding + consequence | Can store/use personalization |
| Who should receive it? | Defines contact requirement | Strong contact/enrichment capability |
| How should the campaign operate? | Defines architecture and safeguards | Can execute parts of the sales workflow |

Closing:

> Think of Apollo as a possible component in the engine, not the methodology itself.

CTA: **See the full system** → `/how-it-works/`

### 17.8 What the buyer learns

Heading:

# This Is an Implementation Manual, Not a Motivation Course.

Groups:

**Prospecting architecture**
- campaign design
- qualification rules
- durable state
- suppression
- deduplication

**Evidence**
- current-site verification
- factual findings
- business consequences
- qualification
- rejection

**Outreach**
- contact discovery
- personalized messaging
- follow-ups
- stop conditions

**Infrastructure**
- Google Workspace
- ChatGPT
- Google Sheets
- n8n
- APIs
- PostgreSQL
- queues
- workers

**Operations**
- testing
- metrics
- failure handling
- cost controls
- deliverability safeguards

### 17.9 Inside the guides

Heading:

# See What You're Actually Buying.

Use real PDF page previews when available.

Suggested captions:

- Step-by-step implementation instructions
- Architecture explained before configuration begins
- Concrete workflow examples
- Checklists for critical launch steps

Supporting line:

> Each guide is written to explain what a component does, why the system needs it, how to implement it, and what failure looks like.

Never use fake guide pages.

### 17.10 Tier recommendation

Prefer a static decision tree in V1.

Heading:

# Which Guide Should You Start With?

```text
Do you already have a repeatable manual prospecting process?

NO → TIER 1
YES ↓

Do you want recurring automation without APIs?

YES → TIER 2
NO ↓

Do you want an automated system without building a custom backend?

YES → TIER 3
NO ↓

Do you want to build the engine as a production application?

YES → TIER 4
```

CTA: **Compare Every Tier**

Do not add a JavaScript/Svelte quiz unless it materially improves the user experience.

### 17.11 Trust/guardrails

Heading:

# Automation With Guardrails.

Feature blocks:

**Evidence first** — The system can reject a lead instead of inventing a reason to contact it.

**Stop conditions** — Replies, opt-outs, and hard bounces are treated as state, not obstacles to bypass.

**Controlled volume** — The guides emphasize reputation and legitimate campaign operation rather than maximizing raw sends.

**Durable records** — The system maintains enough state to prevent duplicate and inappropriate outreach.

**Progressive automation** — Automation increases only after the underlying process is understood and tested.

### 17.12 Featured FAQ

Show approximately six:

1. Is this a lead-generation service?
2. Do I need Apollo?
3. Do I need to know how to code?
4. Which tier should I start with?
5. Are these video courses?
6. What exactly do I receive after purchase?

CTA: **View all FAQs**

### 17.13 Final CTA

Heading:

# Build the System Instead of Repeating the Chore.

Copy:

> Start with the level that matches how you work today and build toward as much automation as you actually need.

Primary CTA: **Compare the Guides**

Secondary CTA: **View All Products**

---

## 18. Products Overview Page

Route: `/products/`

H1:

# Four Ways to Build the Same Client Acquisition System.

Intro:

> Every guide follows the same evidence-first prospecting architecture. What changes is who performs each step: you, ChatGPT, an automation workflow, or a production application.

Each product card includes:

- tier
- title
- automation level
- technical level
- short promise
- key tools
- best-for statement
- configured price
- product CTA

Follow with a simplified tier comparison and a link to `/compare/`.

---

## 19. Shared Product Page Structure

Every product page should contain:

1. Breadcrumb
2. Tier badge
3. Product title
4. Short descriptor
5. Real product cover
6. Configured price
7. Purchase CTA
8. Best-for statement
9. What the customer will build
10. Architecture diagram
11. What the guide covers
12. Tools used
13. Automation level
14. Technical level / prerequisites
15. Real inside-the-guide previews
16. What the guide deliberately does not do
17. Comparison with adjacent tier(s)
18. Relevant FAQ
19. Final purchase CTA

The page should answer:

> What will I be capable of building after implementing this guide?

not merely:

> How many pages are in the PDF?

---

## 20. Tier 1 Product Page

Route: `/products/ai-prospecting-starter/`

H1: **AI Prospecting Starter**

Badge: **Tier 1 · Human Supervised**

Hero descriptor:

> Build a disciplined, evidence-based client prospecting workflow with ChatGPT, Google Workspace, and a campaign tracker.

Best for:

> Freelance web developers who want a repeatable outbound process without APIs or automation builders.

Primary CTA:

**Buy AI Prospecting Starter — [configured price]**

What you will build:

> A human-supervised system in which ChatGPT helps research prospects and draft outreach while you verify the evidence, control the campaign tracker, approve messages, and send.

Architecture:

```text
YOU DEFINE CAMPAIGN
      ↓
CHATGPT RESEARCH
      ↓
YOU VERIFY EVIDENCE
      ↓
GOOGLE SHEETS STATE
      ↓
CHATGPT DRAFTS
      ↓
YOU SEND / FOLLOW UP
```

Section heading:

# Build the Foundation Before You Automate It.

Primary coverage:

- sending identity
- domain/mailbox fundamentals
- SPF / DKIM / DMARC
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

“This is not” section:

- unattended automation
- API automation
- bulk sending
- an Apollo requirement

Next tier:

**When Tier 2 makes sense**

> Upgrade when the workflow works but repeatedly initiating research, follow-up review, and reporting yourself has become the bottleneck.

---

## 21. Tier 2 Product Page

Route: `/products/chatgpt-client-acquisition-system/`

H1: **ChatGPT Client Acquisition System**

Badge: **Tier 2 · Scheduled**

Hero descriptor:

> Turn the Tier 1 method into a scheduled, semi-autonomous daily operating system using ChatGPT and connected Google tools.

Best for:

> Freelancers who want recurring research and pipeline management without building API workflows.

Primary CTA:

**Buy ChatGPT Client Acquisition System — [configured price]**

What you will build:

> A recurring ChatGPT workflow that reads campaign state, researches prospects, drafts outreach, identifies due follow-ups, reviews campaign activity, and produces operational reports.

Architecture:

```text
SCHEDULED TASK
      ↓
CHATGPT
      ↕
GOOGLE SHEETS CAMPAIGN STATE
      ↕
GMAIL / GOOGLE TOOLS
      ↓
DRAFT / REVIEW / ACTION
      ↓
UPDATED STATE + REPORTING
```

Section heading:

# Make the Process Recurring Without Building an API Stack.

Primary coverage:

- scheduled ChatGPT workflows
- campaign state
- Drive / Sheets / Gmail connections
- recurring task architecture
- prospecting tasks
- follow-up / reply review
- weekly reporting
- task prompts
- sending safeguards
- testing
- supervision
- limitations
- troubleshooting
- metrics

Not intended for:

- high-volume unattended processing
- n8n/API workflow orchestration
- custom backend infrastructure

Adjacent tiers:

- Tier 1 if the methodology itself is not established.
- Tier 3 when recurring ChatGPT tasks are no longer enough and provider APIs should become an unattended workflow.

---

## 22. Tier 3 Product Page

Route: `/products/automated-lead-engine/`

H1: **Automated Lead Engine**

Badge: **Tier 3 · Automated**

Hero descriptor:

> Deploy an unattended web-development prospecting pipeline with n8n, current website evidence, OpenAI, and Hunter or Apollo.

Best for:

> Freelancers and solo agencies with a proven campaign that want unattended processing without building a custom application.

Primary CTA:

**Buy Automated Lead Engine — [configured price]**

Architecture:

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

Primary coverage:

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
- retries
- cost controls
- testing
- launch
- operations

Critical statement:

> The system is allowed to produce zero qualified leads from a batch. Automation does not create permission to fabricate findings.

Tier 3 vs Tier 4:

**Tier 3**
- Google Sheets owns primary campaign state
- n8n orchestrates processing
- workflows handle retries and dedupe
- optimized for freelancer/solo operation

**Tier 4**
- PostgreSQL owns state
- workers/services orchestrate processing
- queue infrastructure manages work
- database constraints enforce uniqueness
- built for stronger scale and extensibility

---

## 23. Tier 4 Product Page

Route: `/products/production-lead-engine/`

H1: **Production Lead Engine**

Badge: **Tier 4 · Production**

Hero descriptor:

> Build and deploy a database-backed web-development lead automation application with Node.js/TypeScript, PostgreSQL, workers, queues, provider APIs, and production controls.

Best for:

> Developers and agencies that want durable state, controlled concurrency, multiple campaigns, stronger auditability, and an architecture they can extend.

Primary CTA:

**Buy Production Lead Engine — [configured price]**

Architecture:

```text
                 POSTGRESQL
                SYSTEM STATE
                     │
                  JOB QUEUE
                     │
                   WORKERS
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    DISCOVERY     CRAWLING   QUALIFICATION
        └────────────┼────────────┘
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

Primary coverage:

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

Section heading:

# Do You Actually Need Tier 4?

Copy:

> If a single freelancer campaign can operate comfortably in Google Sheets and n8n, Tier 3 is probably enough. Tier 4 exists for the point where durable concurrency, custom behavior, larger datasets, multiple campaigns, auditability, or application-level control justify real software infrastructure.

---

## 24. Compare Page

Route: `/compare/`

H1:

# Which Lead Automation System Is Right for You?

Intro:

> The underlying strategy does not change. The difference is how much of the workflow you want the system to execute for you.

Required dimensions:

| Capability | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
| --- | --- | --- | --- | --- |
| Evidence-first qualification | Yes | Yes | Yes | Yes |
| Google Workspace | Yes | Yes | Yes | Yes |
| ChatGPT | Yes | Yes | API/AI layer | API/AI layer |
| Google Sheets state | Yes | Yes | Yes | Non-primary |
| Human-led workflow | Primary | Reduced | Minimal operational | Administrative |
| Scheduled ChatGPT | No | Yes | Not primary | Not primary |
| APIs | No | No | Yes | Yes |
| n8n | No | No | Yes | Non-primary |
| Automated discovery | Assisted | Scheduled/assisted | Yes | Yes |
| Automated site evidence | No | Assisted | Yes | Yes |
| Automated qualification | Assisted | Assisted | Yes | Yes |
| Contact enrichment | Manual/optional | Assisted | Automated | Automated |
| Sequence integration | No | Limited/provider dependent | Yes | Yes |
| Webhooks | No | No | Yes | Yes |
| PostgreSQL | No | No | No | Yes |
| Job queue | No | No | No | Yes |
| Workers | No | No | No | Yes |
| Multi-campaign architecture | Manual | Limited | Possible | Designed for it |
| Best for | Learning the system | Recurring operation | Freelancer automation | Production software |
| Complexity | Low | Low-medium | Medium | High |

Quick recommendation:

- **Tier 1:** You need the methodology.
- **Tier 2:** The methodology works and you want ChatGPT handling recurring operations.
- **Tier 3:** You want the workflow running through connected APIs.
- **Tier 4:** You want to own the lead engine as a software system.

---

## 25. How It Works Page

Route: `/how-it-works/`

H1:

# The Lead Engine, From Discovery to Conversation.

This page explains the methodology independently of a tier.

Required sections:

### 1. Design the campaign

Define service, niche, geography, offer, CTA, qualification requirements, contact requirements, rejection rules, and send limits.

### 2. Discover businesses

Discovery creates candidates, not automatically qualified prospects.

### 3. Verify the business

Confirm company identity, current website, relevant service offering, and domain relationship.

### 4. Inspect the current site

Collect current, observable evidence.

### 5. Qualify or reject

A finding must be factual, current, relevant to the service, meaningful to the business, and sufficient to justify outreach.

### 6. Find a legitimate contact

Use public business information and reputable discovery/verification tools. Do not teach dictionary/guessing attacks against possible email addresses.

### 7. Turn evidence into an angle

```text
FINDING
  ↓
BUSINESS CONSEQUENCE
  ↓
RELEVANT IMPROVEMENT
  ↓
CONCISE OUTREACH
```

### 8. Send deliberately

Maintain sender identity, authentication, appropriate volume, campaign state, and opt-out mechanisms.

### 9. Follow up

Follow-up depends on recorded campaign state.

### 10. Stop appropriately

Stop conditions include reply, opt-out, hard bounce, suppression state, and other campaign-defined exclusions.

### 11. Measure the system

Useful metrics include discovered leads, researched leads, qualified leads, contacts found, messages sent, replies, conversations, consultations, bounce rate, opt-outs, and cost per qualified lead when relevant.

Closing concept:

# Automate only after the decision process works.

---

## 26. Articles Hub and Content Strategy

Route: `/articles/`

H1:

# Client Acquisition Systems for Web Developers

Intro:

> Practical guides to prospecting, qualification, outreach, automation, and the infrastructure behind a repeatable web-development sales pipeline.

Article cards include title, description, category, publish date, and hero image.

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

V1 does not require every article to exist at launch. If fewer than about three substantive articles exist, omit Articles from primary navigation rather than launching an empty-looking content section.

### Article layout

Every article should contain:

- breadcrumb
- title
- description/deck
- publication date
- updated date when present
- hero image
- article body
- table of contents when useful
- inline images when useful
- one contextually relevant product CTA
- end-of-article CTA
- related articles
- author attribution where appropriate

Do not turn educational articles into repetitive sales landing pages.

---

## 27. FAQ Page

Route: `/faq/`

H1:

# Frequently Asked Questions

Required core answers:

### What do I receive?

> You receive the PDF implementation guide for the tier you purchase.

### Are these video courses?

> No. The V1 products are downloadable PDF implementation manuals.

### Do I get software?

> No. The guides teach you how to build and operate the systems using the tools described in the relevant tier.

### Which tier should I start with?

> Start with the lowest tier whose prerequisites and workflow you already understand. Tier 1 establishes the core methodology. Tier 2 adds recurring ChatGPT operation. Tier 3 introduces API automation. Tier 4 turns the architecture into production software.

### Do I have to buy the tiers in order?

> No. A technically experienced buyer can choose the tier appropriate to their existing skills and system.

### Do I need Apollo?

> No. Apollo is optional in relevant workflows. It can serve as a useful discovery, enrichment, and outbound component, but the qualification methodology does not depend on Apollo.

### Do I need Hunter?

> Not for every tier. The relevant guides explain where contact discovery and verification tools fit into the architecture.

### Do I need Google Workspace?

> The guides are built around a legitimate business sending identity, and Google Workspace is the primary mailbox environment described by the system.

### Do I need to know how to code?

> Not for Tier 1 or Tier 2. Tier 3 introduces APIs and n8n. Tier 4 requires building and deploying a software application even though the guide explains concepts from the beginning.

### Will this guarantee clients?

> No. The system provides a structured method for prospecting and outreach. Results still depend on your market, offer, positioning, evidence quality, messaging, deliverability, and sales ability.

### Is this a high-volume cold email system?

> No. The methodology emphasizes evidence-based personalized outreach, controlled sending, suppression, and sender reputation.

### What version will I receive?

> Buyers receive the version currently distributed through the product delivery system according to the current sales terms.

Do not promise lifetime updates unless explicitly established.

---

## 28. About Page

Route: `/about/`

H1:

# Built From a Real Prospecting Problem.

Copy direction:

> Lead Automation System grew from a practical problem: finding good web-development prospects took too much repetitive work, while conventional lead databases still left the most important question unanswered—why should this particular business want to talk to a web developer?

> The solution was not simply to automate sending. It was to define the decision process before sending: verify the business, inspect the current site, preserve factual evidence, qualify the opportunity, find the appropriate contact, and only then create outreach.

> The four guides document increasingly automated versions of that system, from a human-supervised ChatGPT workflow through a production database-backed application.

Author section:

**Brian Woodson**

Position as a web developer, builder of the system, and practitioner documenting the implementation. Do not invent inflated credentials or unverifiable claims.

CTA: **Compare the Guides**

---

## 29. Legal Pages

Required:

- `/privacy/`
- `/terms/`
- `/refund-policy/`

Final legal language must be reviewed before launch.

Do not let an agent invent binding commercial promises for:

- refund window
- refund conditions
- legal business name
- business address
- governing law
- update policy
- product license terms

Use clearly identified configuration/placeholders until those facts are supplied.

---

## 30. Purchase Complete Page

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

## 31. Content Collections

There is no CMS. The Git repository is the content source of truth.

Primary collections:

```text
products
articles
faqs
```

### Product collection

Directory:

`src/content/products/`

Recommended entries:

```text
01-ai-prospecting-starter.mdx
02-chatgpt-client-acquisition-system.mdx
03-automated-lead-engine.mdx
04-production-lead-engine.mdx
```

Recommended fields:

```ts
{
  title,
  shortTitle,
  slug,
  tier,
  tagline,
  description,
  audience,
  promise,
  automationLevel,
  technicalLevel,
  heroImage,
  heroAlt,
  previewImages,
  whatYouBuild,
  topics,
  tools,
  prerequisites,
  outcomes,
  limitations,
  price,
  checkoutUrl,
  version,
  pageCount,
  lastUpdated,
  featured,
  order
}
```

Required fields should be validated with Astro's content schema and `image()` where appropriate. Product facts, pricing, and checkout URLs must not be duplicated across unrelated components.

### Article collection

Directory:

`src/content/articles/`

Use MDX.

Recommended fields:

```ts
{
  title,
  description,
  publishedAt,
  updatedAt,
  heroImage,
  heroAlt,
  category,
  tags,
  relatedProducts,
  featured,
  draft
}
```

### FAQ collection

Directory:

`src/content/faqs/`

Recommended fields:

```ts
{
  question,
  answer,
  category,
  tiers,
  featured,
  order
}
```

---

## 32. Images and Product Previews

Primary structure:

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

Do not use `/public` for normal product/article images just to simplify paths. Reserve public assets for files that genuinely need stable public URLs.

Every meaningful image needs useful alternative text. Decorative visuals should not create redundant screen-reader output.

### Product covers

Each guide needs a distinct cover that clearly belongs to the same family and shows:

- tier number
- guide title
- short descriptor
- Lead Automation System branding

Visual progression:

- Tier 1: simple human + AI workflow
- Tier 2: scheduled/recurring system
- Tier 3: connected workflow nodes
- Tier 4: database/worker/application architecture

Avoid generic robot heads, glowing brains, humanoid AI art, fake SaaS dashboards, handshakes, money imagery, and luxury imagery.

### PDF previews

Each product page should support 2–3 representative images exported from the real PDF, such as:

- table of contents
- architecture/workflow page
- implementation page
- code/configuration example

Never fabricate preview pages and do not expose enough high-resolution content to recreate the complete guide.

---

## 33. Design Direction

Overall aesthetic:

- dark
- minimal
- technical
- premium
- serious
- restrained
- highly legible

The site should feel like engineering/documentation translated into a polished commercial experience.

It should not feel like a generic funnel, crypto site, AI hype page, corporate SaaS clone, or online-course template.

### Visual motifs

Prefer:

- pipelines
- nodes
- connectors
- state transitions
- evidence cards
- data records
- workflow diagrams
- architecture diagrams
- real guide previews
- code/configuration snippets where useful

### Animation

Use only restrained motion:

- hover/focus transitions
- accordion/menu transitions
- subtle pipeline state changes when useful

Avoid constant floating objects, parallax, animated gradient blobs, autoplay backgrounds, and heavy scroll-trigger animation.

Respect reduced-motion preferences.

---

## 34. Tailwind v4 Theme and Design Tokens

The project uses Tailwind CSS v4's CSS-first theme model through the existing `src/styles/starwind.css` file. Do **not** introduce a Tailwind v3-style `tailwind.config.js` merely to define colors.

`src/styles/starwind.css` is the single approved project stylesheet and contains:

- Tailwind import
- Starwind-required imports/plugins
- `@custom-variant` definitions
- `@theme` / `@theme inline` token mappings
- `:root` and `.dark` semantic CSS variables
- minimal approved `@layer base` rules
- Starwind-required keyframes

Components and pages do not contain custom CSS.

### Required semantic color tokens

Continue using Starwind's existing semantic token contract:

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

The site is dark-first. The default dark visual target is:

```text
background              neutral-950
foreground              neutral-50
card                    neutral-900
card-foreground         neutral-50
popover                 neutral-900
popover-foreground      neutral-50
primary                 blue-600
primary-foreground      neutral-50
primary-accent          blue-400
secondary               neutral-800
secondary-foreground    neutral-50
secondary-accent        neutral-200
muted                   neutral-900
muted-foreground        neutral-400
accent                  neutral-800
accent-foreground       neutral-50
info                    sky-400
success                 green-400
warning                 amber-400
error                   red-500
border                  neutral-50 at low opacity
input                   neutral-50 at low opacity
outline                 blue-400
radius                  0.75rem target
```

Exact values may be adjusted modestly for WCAG contrast or Starwind compatibility, but semantic roles must remain stable.

### Tailwind utility rule

Components must consume semantic tokens through classes such as:

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

Opacity modifiers on semantic tokens are allowed, e.g. `bg-primary/10`, `border-primary/20`.

Do not use raw palette colors in page/component markup when a semantic token exists. Do not use arbitrary hex values such as `bg-[#0b0f14]` or `text-[#f4f4f5]`.

### Typography and sizing

Use Tailwind's standard typography, spacing, radius, width, breakpoint, and shadow scales unless the design system establishes a named token for a repeated exception.

Do not use arbitrary values merely to visually nudge a component. Avoid patterns such as:

```text
text-[13px]
max-w-[1180px]
rounded-[18px]
shadow-[...]
tracking-[...]
```

If a non-standard repeated value is genuinely necessary, establish it once in the Tailwind theme rather than repeating arbitrary values.

### Dark mode

Use Starwind's dark-mode contract. The visual design is dark-first. If no user-selectable light theme is implemented in V1, the root layout may intentionally apply the dark theme globally while preserving valid Starwind semantic variables.

---

## 35. Starwind UI Component Strategy

Starwind UI is the default source for standard interactive and presentational UI primitives.

Before hand-building a common primitive, check whether an appropriate Starwind component exists.

Use Starwind for standard controls/components where available, including categories such as:

- buttons
- badges
- cards
- accordions
- dropdown/navigation menus
- dialogs/sheets if needed
- tooltips if needed
- tables when appropriate
- inputs/forms if added later

Install supported components through the documented Starwind CLI and keep generated Starwind source in the configured `src/components/starwind` directory.

Project-specific components such as `ProductCard`, `ProductHero`, `LeadExample`, or `WorkflowDiagram` should compose Starwind primitives and semantic Astro markup rather than recreating standard primitives from scratch.

Custom semantic markup is appropriate where no Starwind primitive is relevant, especially for content layout and diagrams.

Do not leave the site looking like an untouched component-library demo. Product identity comes from composition, typography, content, imagery, and the project theme tokens.

---

## 36. Component and Styling Constraints

These constraints are non-negotiable:

- No `<style>` blocks in `.astro` files.
- No `<style>` blocks in `.svelte` files.
- No `style="..."` attributes for visual styling.
- No CSS modules.
- No per-component stylesheet files.
- No page-specific custom CSS files.
- No arbitrary raw color values in markup.
- No arbitrary Tailwind values unless a one-off technical requirement cannot reasonably use the established scale; repeated values must become theme tokens.
- Component/page styling is Tailwind utility classes only.
- Semantic color classes must come from the Tailwind/Starwind theme tokens.
- `src/styles/starwind.css` is the only approved project stylesheet and exists for Tailwind/Starwind theme infrastructure, not page-by-page styling.

---

## 37. Svelte Usage

Default to Astro.

Use Svelte only when persistent client-side state or interaction genuinely requires it.

Potentially justified examples:

- complex mobile navigation only if Starwind/Astro behavior is insufficient
- a future interactive filter
- a future tier recommendation tool if explicitly approved

Do not use Svelte for static product cards, hero sections, pricing, comparison content, workflow diagrams, ordinary CTAs, article layouts, or footer content.

Do not hydrate static content.

---

## 38. Recommended Project Structure

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
│   ├── starwind/
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
├── lib/
│   └── utils/
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
│   ├── articles/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── products/
│       ├── index.astro
│       └── [slug].astro
│
├── styles/
│   └── starwind.css
│
├── content.config.ts
└── config.ts
```

Do not create `global.css` in addition to `starwind.css`. Keep one theme/style entry point.

---

## 39. Reusable Project Components

Likely composition components:

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
Breadcrumbs.astro
ProductCallout.astro
ScreenshotFrame.astro
```

These are project-level compositions. Standard primitives inside them should use Starwind where available.

Do not create abstraction-heavy component systems before real repetition exists.

---

## 40. Header and Footer

### Header

Desktop:

- logo left
- primary navigation center/right
- primary CTA right

Mobile:

- use an accessible Starwind navigation/menu primitive where appropriate
- keyboard operable
- correct expanded state
- Escape closes overlay/menu behavior when applicable
- focus remains predictable

Avoid an oversized sticky header.

### Footer

Sections:

**Products**
- AI Prospecting Starter
- ChatGPT Client Acquisition System
- Automated Lead Engine
- Production Lead Engine

**Learn**
- How It Works
- Compare
- Articles
- FAQ

**Company**
- About
- support email

**Legal**
- Privacy
- Terms
- Refund Policy

Bottom line:

`© [current year] Lead Automation System. All rights reserved.`

Do not add meaningless social icons when no active social properties exist.

---

## 41. Price and Checkout Data

Final retail prices are not defined by this document unless later explicitly supplied.

Product data supports at minimum:

```text
price
checkoutUrl
```

No component may independently hardcode a retail price or checkout URL.

If price/checkout is not configured:

- development may omit the purchase CTA or show an unmistakable development-only placeholder
- production must never show `[PRICE]`, `$0`, `undefined`, or a fabricated amount

Create one shared product purchase CTA/composition that consumes product data.

---

## 42. Site Configuration

Centralize site-level values, for example:

```ts
export const siteConfig = {
  name: "Lead Automation System",
  description:
    "Implementation guides for building evidence-first client acquisition systems for freelance web developers.",
  url: "",
  supportEmail: "",
  commerce: {
    provider: "lemonsqueezy",
  },
};
```

Do not duplicate site identity or support data through multiple pages.

---

## 43. SEO

Every indexable page needs:

- unique title
- unique meta description
- canonical URL
- Open Graph title
- Open Graph description
- appropriate Open Graph image
- social metadata as appropriate

Generate sitemap and robots.txt.

Use structured data only when valid and supported by visible content:

- Organization
- WebSite
- Product
- BreadcrumbList
- Article
- FAQPage only when current search-engine guidance makes it appropriate

Never fabricate reviews, ratings, offers, inventory, prices, or customer data in schema.

Suggested homepage metadata:

**Title:** `Lead Automation System | Client Acquisition for Web Developers`

**Description:** `Build an evidence-first web-development prospecting system with ChatGPT, automation workflows, APIs, or production application infrastructure.`

Suggested product titles:

- `AI Prospecting Starter for Web Developers | Lead Automation System`
- `ChatGPT Client Acquisition System for Web Developers`
- `Automated Lead Engine with n8n & AI for Web Developers`
- `Production Lead Automation System for Web Developers`

Adjust length during implementation without changing positioning.

---

## 44. Analytics

Use lightweight, replaceable analytics.

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

## 45. Performance

Primary goal: a mostly static site with minimal browser JavaScript.

Requirements:

- static Astro rendering wherever practical
- optimized local images
- known image dimensions/aspect ratios
- minimized layout shift
- lazy loading for non-critical images
- no unnecessary third-party scripts
- no heavy animation framework without explicit justification
- no SPA conversion
- no hydration of static marketing sections
- keep Starwind/Svelte behavior scoped to actual interactive needs

Target excellent Core Web Vitals rather than cosmetic score chasing.

---

## 46. Accessibility

Target WCAG 2.2 AA.

Requirements:

- correct landmarks
- logical H1 and heading hierarchy
- keyboard-operable controls
- visible focus states
- sufficient contrast
- accessible navigation
- accessible Starwind component usage
- accessible accordions and menus
- semantic comparison tables
- no color-only communication
- descriptive links
- meaningful alt text
- decorative images hidden appropriately
- reduced-motion support
- adequate touch targets
- no hover-only critical information

Desktop comparison should use semantic table markup. Mobile may scroll horizontally or use an equivalent grouped layout without removing information.

---

## 47. Security

V1 has a small attack surface.

Requirements:

- no secrets committed to Git
- no Lemon Squeezy secret API keys exposed client-side
- no sellable PDFs in public site assets
- safe external-link behavior
- appropriate deployment security headers where practical
- dependency maintenance

---

## 48. Content Integrity and Claim Rules

Agents must not invent:

- product capabilities
- extra deliverables
- testimonials
- customer numbers
- customer logos
- revenue numbers
- conversion/reply rates
- guarantees
- external tool capabilities
- external tool pricing
- screenshots presented as real
- legal conclusions

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

If required content is missing, omit it or use an explicit development placeholder rather than fabricating commercial proof.

---

## 49. Compliance Positioning

Trust messaging should make clear that:

- users are responsible for applicable law
- users are responsible for provider terms
- users are responsible for sender reputation
- opt-outs must be honored
- automation must not fabricate evidence
- automation must not be used to evade provider controls

Do not make sweeping legal claims about what is universally legal.

---

## 50. V1 Hard Non-Goals

Do not build unless scope is explicitly changed:

- CMS
- Sanity
- WordPress
- Contentful
- Supabase
- Firebase
- website database
- authentication
- registration
- user accounts
- customer dashboard
- course dashboard
- lesson completion
- embedded PDF reader
- custom protected file server
- custom download system
- community/forum/comments
- AI chatbot
- embedded lead-generation software
- interactive lead discovery
- workflow generator
- prompt generator
- subscription management
- custom checkout
- custom payment processing
- custom admin panel

Possible future features must not complicate V1 architecture now.

---

## 51. Development Sequence

### Phase 1 — Foundation

- finalize Tailwind/Starwind semantic theme
- establish BaseLayout and dark-first theme behavior
- site configuration
- SEO utilities
- content schemas
- shared header/footer
- install required Starwind primitives

### Phase 2 — Product system

- four product entries
- product composition components
- product layout
- dynamic product route
- real product cover/preview support

### Phase 3 — Core sales pages

- homepage
- products overview
- compare
- how it works

### Phase 4 — Article system

- article collection
- MDX layout
- articles index
- article route
- controlled MDX composition components
- related product CTA

### Phase 5 — Supporting pages

- FAQ
- About
- Privacy
- Terms
- Refund Policy
- purchase complete
- 404

### Phase 6 — Commerce

- Lemon Squeezy product data
- checkout URLs
- shared purchase CTA
- checkout analytics
- test purchase flow

### Phase 7 — SEO / analytics / polish

- metadata
- structured data
- sitemap
- robots
- OG imagery
- analytics
- Search Console preparation

### Phase 8 — QA

- production build
- responsive QA
- keyboard/accessibility QA
- content integrity QA
- checkout QA
- route/link/image QA
- Core Web Vitals review

---

## 52. Launch Content Requirements

Before production launch, the site requires:

- completed homepage
- products overview
- all four accurate product pages
- comparison page
- how-it-works page
- FAQ
- About
- finalized legal pages
- final product covers
- real prices
- working Lemon Squeezy products
- real checkout links
- support email
- final domain
- enough substantive articles to justify an Articles navigation item

Each product should ideally have 2–3 real PDF preview images.

V1 does not require testimonials. If legitimate testimonials do not exist, do not create a testimonial section.

---

## 53. V1 Definition of Done

### Product clarity

- A first-time visitor can explain what the product does after the hero and early sections.
- The visitor understands the products are downloadable implementation manuals.
- The visitor understands the deliverable is a PDF.
- The visitor understands the four-tier progression.
- The visitor understands that higher tiers mean more automation/infrastructure, not automatically more appropriateness.

### Differentiation

- Tier 1 clearly represents human-supervised ChatGPT prospecting.
- Tier 2 clearly represents scheduled ChatGPT operation.
- Tier 3 clearly represents n8n/API automation.
- Tier 4 clearly represents a production application.

### Positioning

- The site does not present the products as spam automation.
- Evidence-first qualification is prominent.
- Apollo's role is explained accurately.
- No guaranteed-results or passive-income claims appear.

### Design system

- Starwind is used as the default component primitive library where applicable.
- All component/page styling uses Tailwind utility classes.
- No component contains a `<style>` block.
- No inline `style` attributes are used for visual styling.
- Semantic colors come from established Starwind/Tailwind theme tokens.
- No repeated arbitrary values exist where a theme token should be used.
- `src/styles/starwind.css` is the single theme/style entry point.
- The dark-first theme is consistent across pages.

### Commerce

- Every product displays its correct configured price.
- Every purchase CTA reaches the correct Lemon Squeezy product.
- Test purchase flow works.
- Sellable PDFs are not exposed by the website.

### Technical

- production build succeeds
- no normal-use console errors
- no broken routes
- no broken images
- no broken internal links
- no broken checkout links
- metadata is present
- sitemap and robots work
- 404 works

### Performance

- static content is not unnecessarily hydrated
- images are optimized
- layout shift is minimized
- third-party scripts are controlled

### Accessibility

- keyboard navigation works
- focus indicators are visible
- menus/accordions are accessible
- headings are logical
- image alternatives are correct
- tables remain usable
- contrast meets AA requirements
- reduced motion is respected

### Content integrity

- no fake testimonials
- no fake customers
- no fake screenshots
- no fabricated statistics
- no invented deliverables
- no unapproved prices
- no guaranteed-results claims

---

## 54. Final V1 Statement

Lead Automation System V1 is:

> A fast, static, dark-first Astro commerce site that sells four downloadable PDF implementation guides teaching freelance web developers how to build increasingly automated, evidence-first client acquisition systems.

The buyer journey should remain clear:

```text
WHAT THE SYSTEM DOES
        ↓
WHY THE METHOD IS DIFFERENT
        ↓
WHAT EACH TIER BUILDS
        ↓
WHICH TIER FITS THE BUYER
        ↓
WHAT THE BUYER RECEIVES
        ↓
HOW TO PURCHASE
```

Anything that does not materially improve one of those steps should be treated skeptically for V1.
