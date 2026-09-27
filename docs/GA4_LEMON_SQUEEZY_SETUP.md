# GA4 + Lemon Squeezy conversion tracking

This layer completes the Developer Business Lab analytics funnel after a visitor leaves the site for Lemon Squeezy checkout.

## What the implementation sends

Browser-side GA4 continues to measure page views, product views, product selection, article-to-product movement, and checkout starts.

For visitors who accepted analytics cookies, Lemon Squeezy checkout links are enriched with non-identifying analytics context:

- GA4 client ID
- GA4 session ID
- local product slug
- product category when available
- CTA location
- source path
- an explicit analytics-consent marker

The Lemon Squeezy webhook then sends server-side GA4 Measurement Protocol events:

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

Keep `begin_checkout`, `quickstart_checkout_start`, `view_item`, and `select_item` as funnel diagnostics.

## Test matrix

Before relying on reporting, verify all four cases:

1. Paid test order after accepting analytics -> one GA4 `purchase`.
2. Free Quickstart order after accepting analytics -> one GA4 `generate_lead`.
3. Full refund -> one GA4 `refund` tied to the original transaction ID.
4. Order after rejecting analytics -> webhook succeeds but sends no GA4 event.

Use Lemon Squeezy webhook logs and GA4 DebugView/Realtime during testing.

## Duplicate and partial-refund behavior

Paid purchases use the Lemon Squeezy order identifier as GA4 `transaction_id`, giving GA4 a stable transaction key for duplicate-purchase protection.

The site does not currently have a durable application database. Lemon Squeezy's `refunded_amount` is cumulative, so this implementation intentionally forwards full refunds and skips partial-refund events rather than risk subtracting cumulative partial refunds more than once. If partial refunds become operationally important, add a small durable webhook-event store before forwarding refund deltas.
