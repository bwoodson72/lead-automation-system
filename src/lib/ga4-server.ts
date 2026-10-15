import { siteConfig } from "@/config";

type Ga4EventParams = Record<string, unknown>;

type SendGa4EventInput = {
  clientId: string;
  sessionId?: string;
  name: string;
  params?: Ga4EventParams;
};

function measurementProtocolEndpoint(validate = false): URL {
  const apiSecret = import.meta.env.GA4_API_SECRET;
  if (!apiSecret) throw new Error("GA4_API_SECRET is not configured.");

  const measurementId = siteConfig.analytics.googleAnalyticsMeasurementId;
  if (!measurementId) throw new Error("Google Analytics measurement ID is not configured.");

  const endpoint = new URL(validate
    ? "https://www.google-analytics.com/debug/mp/collect"
    : "https://www.google-analytics.com/mp/collect");
  endpoint.searchParams.set("measurement_id", measurementId);
  endpoint.searchParams.set("api_secret", apiSecret);
  return endpoint;
}

function normalizeSessionId(value: string | undefined): string | number | undefined {
  if (!value) return undefined;
  return /^\d+$/.test(value) ? Number(value) : value;
}

export async function sendGa4Event(input: SendGa4EventInput): Promise<void> {
  const sessionId = normalizeSessionId(input.sessionId);
  const params: Ga4EventParams = {
    ...(input.params ?? {}),
    engagement_time_msec: 1,
  };

  if (sessionId !== undefined) params.session_id = sessionId;

  const payload = {
    client_id: input.clientId,
    events: [{ name: input.name, params }],
  };

  // Google's /mp/collect often returns 2xx even for invalid event parameters.
  // In development (or when explicitly enabled for a test environment), use
  // the debug endpoint first. Debug events do not enter analytics reports.
  if (import.meta.env.DEV || import.meta.env.GA4_VALIDATE_EVENTS === "true") {
    const validationResponse = await fetch(measurementProtocolEndpoint(true), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, validation_behavior: "ENFORCE_RECOMMENDATIONS" }),
    });
    if (!validationResponse.ok) {
      throw new Error(`GA4 validation request failed (${validationResponse.status}).`);
    }

    const validation = await validationResponse.json() as {
      validationMessages?: Array<{ fieldPath?: string; validationCode?: string }>;
    };
    if (validation.validationMessages?.length) {
      const summary = validation.validationMessages
        .map((message) => `${message.fieldPath ?? "event"}:${message.validationCode ?? "INVALID"}`)
        .join(", ");
      throw new Error(`GA4 event validation failed: ${summary}`);
    }
  }

  const response = await fetch(measurementProtocolEndpoint(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`GA4 Measurement Protocol request failed (${response.status})${body ? `: ${body}` : ""}`);
  }
}
