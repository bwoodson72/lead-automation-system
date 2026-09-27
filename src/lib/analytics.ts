import { siteConfig } from "@/config";

type AnalyticsItem = {
  item_id: string;
  item_name?: string;
  item_category?: string;
  price?: number;
  quantity: number;
};

type EventParams = Record<string, unknown>;

type Gtag = (...args: unknown[]) => void;

type GaIdentity = {
  clientId: string;
  sessionId?: string;
};

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

const CONSENT_KEY = "dbl_analytics_consent";
const CHECKOUT_SELECTOR = "a.lemonsqueezy-button[data-product-slug]";
const GA_GET_TIMEOUT_MS = 750;
let initialized = false;
const trackedViewItems = new WeakSet<HTMLElement>();
let identityPromise: Promise<GaIdentity | undefined> | undefined;

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

function sendEvent(name: string, params: EventParams = {}): void {
  if (!hasAnalyticsConsent() || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

function parsePrice(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function itemFromElement(element: HTMLElement): AnalyticsItem | undefined {
  const itemId = element.dataset.gaItemId ?? element.dataset.productSlug;
  if (!itemId) return undefined;

  const item: AnalyticsItem = {
    item_id: itemId,
    quantity: 1,
  };

  if (element.dataset.gaItemName) item.item_name = element.dataset.gaItemName;
  if (element.dataset.gaItemCategory) item.item_category = element.dataset.gaItemCategory;

  const price = parsePrice(element.dataset.gaPrice);
  if (price !== undefined) item.price = price;

  return item;
}

function ctaLocationFromElement(element: HTMLElement): string | undefined {
  return element.dataset.gaCtaLocation ?? element.dataset.ctaLocation;
}

function ecommerceParams(element: HTMLElement): EventParams {
  const item = itemFromElement(element);
  const price = item?.price;
  const params: EventParams = {};

  if (element.dataset.gaCurrency) params.currency = element.dataset.gaCurrency;
  if (price !== undefined) params.value = price;
  if (item) params.items = [item];

  const ctaLocation = ctaLocationFromElement(element);
  if (ctaLocation) params.cta_location = ctaLocation;
  if (element.dataset.gaItemListName) params.item_list_name = element.dataset.gaItemListName;

  return params;
}

function trackPageContent(): void {
  if (!hasAnalyticsConsent()) return;

  const product = document.querySelector<HTMLElement>("[data-ga-view-item]");
  if (!product || trackedViewItems.has(product)) return;

  trackedViewItems.add(product);
  sendEvent("view_item", ecommerceParams(product));
}

function getGtagField(fieldName: "client_id" | "session_id"): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (!hasAnalyticsConsent() || typeof window.gtag !== "function") {
      resolve(undefined);
      return;
    }

    let finished = false;
    const finish = (value?: unknown) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeoutId);
      if (typeof value === "string" || typeof value === "number") {
        resolve(String(value));
      } else {
        resolve(undefined);
      }
    };

    const timeoutId = window.setTimeout(() => finish(undefined), GA_GET_TIMEOUT_MS);
    window.gtag("get", siteConfig.analytics.googleAnalyticsMeasurementId, fieldName, finish);
  });
}

function getGaIdentity(): Promise<GaIdentity | undefined> {
  if (!hasAnalyticsConsent()) return Promise.resolve(undefined);
  if (identityPromise) return identityPromise;

  identityPromise = Promise.all([
    getGtagField("client_id"),
    getGtagField("session_id"),
  ]).then(([clientId, sessionId]) => {
    if (!clientId) return undefined;
    return { clientId, sessionId };
  }).finally(() => {
    identityPromise = undefined;
  });

  return identityPromise;
}

function isLemonSqueezyCheckout(url: URL): boolean {
  return url.hostname === "lemonsqueezy.com" || url.hostname.endsWith(".lemonsqueezy.com");
}

function setCheckoutCustomValue(url: URL, key: string, value: string | undefined): void {
  if (!value) return;
  url.searchParams.set(`checkout[custom][${key}]`, value);
}

function enrichCheckoutLink(element: HTMLAnchorElement, identity: GaIdentity): void {
  const href = element.getAttribute("href");
  if (!href) return;

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return;
  }

  if (!isLemonSqueezyCheckout(url)) return;

  setCheckoutCustomValue(url, "analytics_consent", "accepted");
  setCheckoutCustomValue(url, "ga_client_id", identity.clientId);
  setCheckoutCustomValue(url, "ga_session_id", identity.sessionId);
  setCheckoutCustomValue(url, "product_slug", element.dataset.productSlug ?? element.dataset.gaItemId);
  setCheckoutCustomValue(url, "item_category", element.dataset.gaItemCategory);
  setCheckoutCustomValue(url, "cta_location", ctaLocationFromElement(element));
  setCheckoutCustomValue(url, "source_path", window.location.pathname);

  element.href = url.toString();
  element.dataset.gaAttributionReady = "true";
}

async function enrichCheckoutLinks(): Promise<void> {
  if (!hasAnalyticsConsent()) return;

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(CHECKOUT_SELECTOR));
  if (links.length === 0) return;

  const identity = await getGaIdentity();
  if (!identity) return;

  for (const link of links) enrichCheckoutLink(link, identity);
}

function handleTrackedClick(event: MouseEvent): void {
  if (!hasAnalyticsConsent()) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const element = target.closest<HTMLElement>("[data-ga-event], [data-event='checkout_click']");
  if (!element) return;

  const eventName = element.dataset.gaEvent
    ?? (element.dataset.event === "checkout_click" ? "begin_checkout" : undefined);
  if (!eventName) return;

  if (eventName === "select_item" || eventName === "begin_checkout" || eventName === "quickstart_checkout_start") {
    sendEvent(eventName, ecommerceParams(element));
    return;
  }

  if (eventName === "product_click") {
    sendEvent(eventName, {
      product_id: element.dataset.gaProductId,
      source_type: element.dataset.gaSourceType || "page",
      source_page: window.location.pathname,
      cta_location: ctaLocationFromElement(element),
    });
    return;
  }

  sendEvent(eventName, {
    cta_location: ctaLocationFromElement(element),
    source_page: window.location.pathname,
  });
}

async function handleCheckoutCapture(event: MouseEvent): Promise<void> {
  if (!hasAnalyticsConsent() || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const link = target.closest<HTMLAnchorElement>(CHECKOUT_SELECTOR);
  if (!link || link.dataset.gaAttributionReady === "true") return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const identity = await getGaIdentity();
  if (identity) enrichCheckoutLink(link, identity);

  const eventName = link.dataset.gaEvent ?? "begin_checkout";
  sendEvent(eventName, ecommerceParams(link));
  window.location.assign(link.href);
}

function onPageReady(): void {
  trackPageContent();
  void enrichCheckoutLinks();
}

export function initializeAnalytics(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  document.addEventListener("click", handleCheckoutCapture, true);
  document.addEventListener("click", handleTrackedClick);
  document.addEventListener("astro:page-load", onPageReady);
  window.addEventListener("dbl:analytics-ready", onPageReady);

  onPageReady();
}
