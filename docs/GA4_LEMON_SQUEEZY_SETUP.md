# GA4 + Lemon Squeezy conversion tracking

This layer completes the Developer Business Lab analytics funnel after a visitor leaves the site for Lemon Squeezy checkout.

## Canonical DBL funnel

The site should be analyzed with this funnel rather than GA4's default cart-based Purchase Journey report:

1. `session_start` / landing-page activity
2. `select_item` when a visitor chooses a product from a list or merchandising surface
3. `view_item` when a visitor reaches a product or bundle sales page
4. `begin_checkout` for every Lemon Squeezy checkout click, including the free Developer Marketing Quickstart
5. `product_acquired` for every successfully completed Lemon Squeezy acquisition
6. `purchase` for paid orders, or `generate_lead` for the free Developer Marketing Quickstart

DBL does not have a shopping cart, so `add_to_cart` should not be synthesized merely to populate GA4's canned Purchase Journey report.

The Quickstart may additionally emit `quickstart_checkout_start` as a diagnostic event, but `begin_checkout` is the canonical checkout-start event.

## What the implementation sends

Browser-side GA4 measures page views, product views, product selection, article-to-product movement, and checkout starts.

For visitors who accepted analytics cookies, Lemon Squeezy checkout links are enriched with non-identifying analytics context:

- GA4 client ID
- GA4 session ID
- local product slug
- product category when available
- CTA location
- source path
- an explicit analytics-consent marker

The Lemon Squeezy webhook sends server-side GA4 Measurement Protocol events:

- every successful `order_created` -> `product_acquired`
- paid `order_created` -> `purchase`
- free Quickstart `order_created` -> `generate_lead`
- full `order_refunded` -> `refund`

No checkout name, email address, street address, or payment-card information is sent to Google Analytics by this implementation.

## Required production configuration

### 1. Create a GA4 Measurement Protocol API secret

In Google Analytics:

1. Open **Admin**.
2. Open **Data streams**.
3. Select the Developer Business Lab web stream (`G-YQ65JDDLF8`).
4. Open **Measurement Protocol API secrets**.
5. Create a secret for the website webhook integration.
6. Add the secret to Vercel as `GA4_API_SECRET`.

Do not expose this value through a `PUBLIC_` environment variable.

### 2. Configure the Lemon Squeezy webhook signing secret

Choose a signing secret in Lemon Squeezy and add the same value to Vercel as:

`LEMON_SQUEEZY_WEBHOOK_SECRET`

Do not expose this value through a `PUBLIC_` environment variable.

### 3. Add the webhook in Lemon Squeezy

Use this callback URL:

`https://www.developerbusinesslab.com/api/webhooks/lemonsqueezy/`

Subscribe to:

- `order_created`
- `order_refunded`

Use the exact same signing secret stored in Vercel.

### 4. Redeploy after adding server-side environment variables

Redeploy production so the serverless webhook function receives the new secrets.

### 5. Configure GA4 key events

Use these as the completed-conversion events:

- `purchase` for paid orders
- `generate_lead` for completed Developer Marketing Quickstart acquisition

Keep `product_acquired`, `begin_checkout`, `quickstart_checkout_start`, `view_item`, and `select_item` as funnel diagnostics. `product_acquired` is the universal completion event across free and paid products.

## Test matrix

Before relying on reporting, verify all four cases:

1. Paid test order after accepting analytics -> one `product_acquired` and one `purchase`.
2. Free Quickstart order after accepting analytics -> one `product_acquired` and one `generate_lead`.
3. Full refund -> one GA4 `refund` tied to the original transaction ID.
4. Order after rejecting analytics -> webhook succeeds but sends no GA4 event.

For the Quickstart, also verify that clicking the checkout CTA produces `begin_checkout`; `quickstart_checkout_start` may appear as an additional diagnostic event.

Use Lemon Squeezy webhook logs and GA4 DebugView/Realtime during testing.

## Duplicate and partial-refund behavior

Paid purchases use the Lemon Squeezy order identifier as GA4 `transaction_id`, giving GA4 a stable transaction key for duplicate-purchase protection.

The site does not currently have a durable application database. Lemon Squeezy's `refunded_amount` is cumulative, so this implementation intentionally forwards full refunds and skips partial-refund events rather than risk subtracting cumulative partial refunds more than once. If partial refunds become operationally important, add a small durable webhook-event store before forwarding refund deltas.
