type AnalyticsItem = {
  item_id: string;
  item_name?: string;
  item_category?: string;
  price?: number;
  quantity: number;
};

type EventParams = Record<string, unknown>;

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

const CONSENT_KEY = "dbl_analytics_consent";
let initialized = false;
const trackedViewItems = new WeakSet<HTMLElement>();

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
  const itemId = element.dataset.gaItemId;
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

function ecommerceParams(element: HTMLElement): EventParams {
  const item = itemFromElement(element);
  const price = item?.price;
  const params: EventParams = {};

  if (element.dataset.gaCurrency) params.currency = element.dataset.gaCurrency;
  if (price !== undefined) params.value = price;
  if (item) params.items = [item];
  if (element.dataset.gaCtaLocation) params.cta_location = element.dataset.gaCtaLocation;
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

function handleTrackedClick(event: MouseEvent): void {
  if (!hasAnalyticsConsent()) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const element = target.closest<HTMLElement>("[data-ga-event]");
  if (!element) return;

  const eventName = element.dataset.gaEvent;
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
      cta_location: element.dataset.gaCtaLocation,
    });
    return;
  }

  sendEvent(eventName, {
    cta_location: element.dataset.gaCtaLocation,
    source_page: window.location.pathname,
  });
}

export function initializeAnalytics(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  document.addEventListener("click", handleTrackedClick);
  document.addEventListener("astro:page-load", trackPageContent);
  window.addEventListener("dbl:analytics-ready", trackPageContent);
}
