import type { APIRoute } from "astro";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sendGa4Event } from "@/lib/ga4-server";

export const prerender = false;

type LemonCustomData = Record<string, unknown>;

type LemonOrderItem = {
  product_id?: number | string;
  variant_id?: number | string;
  product_name?: string;
  variant_name?: string;
  price?: number;
};

type LemonOrderAttributes = {
  identifier?: string;
  order_number?: number;
  currency?: string;
  subtotal?: number;
  discount_total?: number;
  tax?: number;
  total?: number;
  refunded?: boolean;
  refunded_amount?: number;
  status?: string;
  test_mode?: boolean;
  first_order_item?: LemonOrderItem;
};

type LemonOrderWebhook = {
  meta?: {
    event_name?: string;
    custom_data?: LemonCustomData;
  };
  data?: {
    type?: string;
    id?: string;
    attributes?: LemonOrderAttributes;
  };
};

type AnalyticsContext = {
  clientId: string;
  sessionId?: string;
  productSlug?: string;
  itemCategory?: string;
  ctaLocation?: string;
  sourcePath?: string;
};

const JSON_HEADERS = { "content-type": "application/json" };

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function customString(customData: LemonCustomData | undefined, key: string): string | undefined {
  const value = customData?.[key];
  if (typeof value === "string" && value.length > 0) return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  if (!signature) return false;

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  const digestBuffer = Buffer.from(digest, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (digestBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(digestBuffer, signatureBuffer);
}

function cents(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function dollars(valueInCents: number): number {
  return Math.round(valueInCents) / 100;
}

function analyticsContext(payload: LemonOrderWebhook): AnalyticsContext | undefined {
  const customData = payload.meta?.custom_data;
  if (customString(customData, "analytics_consent") !== "accepted") return undefined;

  const clientId = customString(customData, "ga_client_id");
  if (!clientId) return undefined;

  return {
    clientId,
    sessionId: customString(customData, "ga_session_id"),
    productSlug: customString(customData, "product_slug"),
    itemCategory: customString(customData, "item_category"),
    ctaLocation: customString(customData, "cta_location"),
    sourcePath: customString(customData, "source_path"),
  };
}

function transactionId(payload: LemonOrderWebhook): string | undefined {
  return payload.data?.attributes?.identifier ?? payload.data?.id;
}

function itemForOrder(payload: LemonOrderWebhook, context: AnalyticsContext, value: number) {
  const orderItem = payload.data?.attributes?.first_order_item;
  const itemId = context.productSlug ?? (orderItem?.product_id != null ? String(orderItem.product_id) : payload.data?.id);
  const itemName = orderItem?.product_name ?? context.productSlug ?? "Developer Business Lab product";

  return {
    item_id: itemId ?? itemName,
    item_name: itemName,
    ...(context.itemCategory ? { item_category: context.itemCategory } : {}),
    ...(orderItem?.variant_name ? { item_variant: orderItem.variant_name } : {}),
    price: value,
    quantity: 1,
  };
}

function attributionParams(context: AnalyticsContext): Record<string, string> {
  return {
    ...(context.ctaLocation ? { cta_location: context.ctaLocation } : {}),
    ...(context.sourcePath ? { source_page: context.sourcePath } : {}),
  };
}

async function forwardOrderCreated(payload: LemonOrderWebhook, context: AnalyticsContext): Promise<string> {
  const attributes = payload.data?.attributes ?? {};
  const id = transactionId(payload);
  if (!id) throw new Error("Lemon Squeezy order is missing a transaction identifier.");

  const currency = attributes.currency?.toUpperCase() || "USD";
  const netRevenueCents = Math.max(0, cents(attributes.subtotal) - cents(attributes.discount_total));
  const netRevenue = dollars(netRevenueCents);
  const tax = dollars(cents(attributes.tax));
  const item = itemForOrder(payload, context, netRevenue);
  const isQuickstart = context.productSlug === "developer-marketing-quickstart" || cents(attributes.total) === 0;

  await sendGa4Event({
    clientId: context.clientId,
    sessionId: context.sessionId,
    name: "product_acquired",
    params: {
      transaction_id: id,
      affiliation: "Lemon Squeezy",
      currency,
      value: netRevenue,
      acquisition_type: isQuickstart ? "free" : "paid",
      product_id: item.item_id,
      product_name: item.item_name,
      items: [item],
      ...attributionParams(context),
    },
  });

  if (isQuickstart) {
    await sendGa4Event({
      clientId: context.clientId,
      sessionId: context.sessionId,
      name: "generate_lead",
      params: {
        currency,
        value: 0,
        lead_source: "lemon_squeezy",
        product_id: item.item_id,
        product_name: item.item_name,
        transaction_id: id,
        ...attributionParams(context),
      },
    });
    return "generate_lead";
  }

  await sendGa4Event({
    clientId: context.clientId,
    sessionId: context.sessionId,
    name: "purchase",
    params: {
      transaction_id: id,
      affiliation: "Lemon Squeezy",
      currency,
      value: netRevenue,
      tax,
      items: [item],
      ...attributionParams(context),
    },
  });
  return "purchase";
}

async function forwardOrderRefunded(payload: LemonOrderWebhook, context: AnalyticsContext): Promise<string> {
  const attributes = payload.data?.attributes ?? {};
  const id = transactionId(payload);
  if (!id) throw new Error("Lemon Squeezy refund is missing a transaction identifier.");

  const totalCents = cents(attributes.total);
  const refundedCents = cents(attributes.refunded_amount);
  const isFullRefund = attributes.refunded === true || (totalCents > 0 && refundedCents >= totalCents);

  // Lemon Squeezy reports cumulative refunded_amount. Without a durable event store,
  // forwarding multiple partial-refund webhooks can overstate refunds in GA4.
  if (!isFullRefund) return "partial_refund_skipped";

  const currency = attributes.currency?.toUpperCase() || "USD";
  const netRevenueCents = Math.max(0, cents(attributes.subtotal) - cents(attributes.discount_total));
  const netRevenue = dollars(netRevenueCents);
  const tax = dollars(cents(attributes.tax));
  const item = itemForOrder(payload, context, netRevenue);

  await sendGa4Event({
    clientId: context.clientId,
    sessionId: context.sessionId,
    name: "refund",
    params: {
      transaction_id: id,
      affiliation: "Lemon Squeezy",
      currency,
      value: netRevenue,
      tax,
      items: [item],
      ...attributionParams(context),
    },
  });

  return "refund";
}

export const POST: APIRoute = async ({ request }) => {
  const signingSecret = import.meta.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!signingSecret) {
    console.error("Lemon Squeezy webhook received before LEMON_SQUEEZY_WEBHOOK_SECRET was configured.");
    return json(503, { ok: false, error: "Webhook is not configured." });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature") ?? "";
  if (!verifySignature(rawBody, signature, signingSecret)) {
    return json(401, { ok: false, error: "Invalid webhook signature." });
  }

  let payload: LemonOrderWebhook;
  try {
    payload = JSON.parse(rawBody) as LemonOrderWebhook;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON payload." });
  }

  const eventName = payload.meta?.event_name ?? request.headers.get("x-event-name") ?? "";
  if (payload.data?.type !== "orders" || (eventName !== "order_created" && eventName !== "order_refunded")) {
    return json(200, { ok: true, forwarded: false, reason: "ignored_event" });
  }

  if (payload.data.attributes?.test_mode === true) {
    return json(200, { ok: true, forwarded: false, reason: "test_order" });
  }

  const context = analyticsContext(payload);
  if (!context) {
    return json(200, { ok: true, forwarded: false, reason: "analytics_not_consented_or_identity_missing" });
  }

  try {
    const forwardedEvent = eventName === "order_created"
      ? await forwardOrderCreated(payload, context)
      : await forwardOrderRefunded(payload, context);

    return json(200, {
      ok: true,
      forwarded: forwardedEvent !== "partial_refund_skipped",
      event: forwardedEvent,
      order_id: payload.data?.id,
    });
  } catch (error) {
    console.error("Failed to forward Lemon Squeezy webhook to GA4.", {
      eventName,
      orderId: payload.data?.id,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return json(500, { ok: false, error: "Analytics forwarding failed." });
  }
};
