import { siteConfig } from "@/config";
import {
  PRICING_CALCULATOR_EVENTS,
  PRICING_SOURCE_PAGE,
  pricingCalculatorEventParams,
  type PricingCalculatorEvent,
  type PricingCalculatorPlacement,
} from "./project-pricing/interaction-events.ts";

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
    LemonSqueezy?: { Url?: { Open?: (url: string) => void } };
  }
}

const CONSENT_KEY = "dbl_analytics_consent";
const CHECKOUT_SELECTOR = "a.lemonsqueezy-button[data-product-slug]";
// Allow the GA4 library time to initialize after consent is granted.
const GA_GET_TIMEOUT_MS = 1800;
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

/**
 * Strictly consent-controlled analytics for the calculator. Caller can supply
 * only a known event and optional placement; never accept numeric form inputs,
 * reports, URL parameters, or client-generated text.
 * Boolean result means the GA4 event was submitted to gtag, not delivered.
 */
export function trackPricingCalculatorEvent(
  event: PricingCalculatorEvent,
  placement?: PricingCalculatorPlacement,
): boolean {
  if (typeof window === "undefined" || window.location.pathname !== PRICING_SOURCE_PAGE) return false;
  if (!PRICING_CALCULATOR_EVENTS.includes(event)) return false;
  if (!hasAnalyticsConsent() || typeof window.gtag !== "function") return false;

  try {
    sendEvent(event, pricingCalculatorEventParams(placement));
    return true;
  } catch {
    return false;
  }
}

function parsePrice(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function fallbackViewItem(element: HTMLElement): HTMLElement | undefined {
  const pageItem = document.querySelector<HTMLElement>("[data-ga-view-item]");
  if (!pageItem || pageItem === element) return undefined;

  const elementId = element.dataset.gaItemId ?? element.dataset.productSlug;
  const pageItemId = pageItem.dataset.gaItemId ?? pageItem.dataset.productSlug;
  if (elementId && pageItemId && elementId !== pageItemId) return undefined;

  return pageItem;
}

function itemFromElement(element: HTMLElement): AnalyticsItem | undefined {
  const fallback = fallbackViewItem(element);
  const itemId = element.dataset.gaItemId
    ?? element.dataset.productSlug
    ?? fallback?.dataset.gaItemId
    ?? fallback?.dataset.productSlug;
  if (!itemId) return undefined;

  const item: AnalyticsItem = {
    item_id: itemId,
    quantity: 1,
  };

  const itemName = element.dataset.gaItemName ?? fallback?.dataset.gaItemName;
  const itemCategory = element.dataset.gaItemCategory ?? fallback?.dataset.gaItemCategory;
  if (itemName) item.item_name = itemName;
  if (itemCategory) item.item_category = itemCategory;

  const price = parsePrice(element.dataset.gaPrice ?? fallback?.dataset.gaPrice);
  if (price !== undefined) item.price = price;

  return item;
}

function ctaLocationFromElement(element: HTMLElement): string | undefined {
  return element.dataset.gaCtaLocation ?? element.dataset.ctaLocation;
}

function ecommerceParams(element: HTMLElement): EventParams {
  const fallback = fallbackViewItem(element);
  const item = itemFromElement(element);
  const price = item?.price;
  const params: EventParams = {
    source_page: window.location.pathname,
  };

  const currency = element.dataset.gaCurrency ?? fallback?.dataset.gaCurrency;
  if (currency) params.currency = currency;
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

function cookieClientId(): string | undefined {
  if (!hasAnalyticsConsent()) return undefined;

  // The standard _ga cookie stores the same two-part client ID returned by gtag.
  const gaCookie = document.cookie.split(";").map((part) => part.trim())
    .find((part) => part.startsWith("_ga="));
  const raw = gaCookie?.slice("_ga=".length);
  const match = raw?.match(/^GA\d+\.\d+\.(\d+)\.(\d+)$/);
  return match ? `${match[1]}.${match[2]}` : undefined;
}

function getGaIdentity(): Promise<GaIdentity | undefined> {
  if (!hasAnalyticsConsent()) return Promise.resolve(undefined);
  if (identityPromise) return identityPromise;

  identityPromise = Promise.all([
    getGtagField("client_id"),
    getGtagField("session_id"),
  ]).then(([clientId, sessionId]) => {
    const resolvedClientId = clientId ?? cookieClientId();
    if (!resolvedClientId) return undefined;
    return { clientId: resolvedClientId, sessionId };
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

function enrichCheckoutLink(element: HTMLAnchorElement, identity?: GaIdentity): void {
  const href = element.getAttribute("href");
  if (!href) return;

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return;
  }

  if (!isLemonSqueezyCheckout(url)) return;

  const fallback = fallbackViewItem(element);
  setCheckoutCustomValue(url, "analytics_consent", "accepted");
  setCheckoutCustomValue(url, "ga_client_id", identity?.clientId);
  setCheckoutCustomValue(url, "ga_session_id", identity?.sessionId);
  setCheckoutCustomValue(url, "product_slug", element.dataset.productSlug ?? element.dataset.gaItemId ?? fallback?.dataset.gaItemId);
  setCheckoutCustomValue(url, "item_category", element.dataset.gaItemCategory ?? fallback?.dataset.gaItemCategory);
  setCheckoutCustomValue(url, "cta_location", ctaLocationFromElement(element));
  setCheckoutCustomValue(url, "source_path", window.location.pathname);

  element.href = url.toString();
  // A consented visitor without a client ID can still check out, but should
  // be distinguishable from a visitor who declined consent in webhook logs.
  element.dataset.gaAttributionReady = identity ? "true" : "partial";
}

async function enrichCheckoutLinks(): Promise<void> {
  if (!hasAnalyticsConsent()) return;

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(CHECKOUT_SELECTOR));
  if (links.length === 0) return;

  const identity = await getGaIdentity();
  for (const link of links) enrichCheckoutLink(link, identity);
}

function sendTrackedEvent(element: HTMLElement, eventName: string): void {
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

function handleTrackedClick(event: MouseEvent): void {
  if (!hasAnalyticsConsent()) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const element = target.closest<HTMLElement>("[data-ga-event], [data-event='checkout_click']");
  if (!element) return;

  const eventName = element.dataset.gaEvent
    ?? (element.dataset.event === "checkout_click" ? "begin_checkout" : undefined);
  if (!eventName) return;

  sendTrackedEvent(element, eventName);

  const secondaryEventName = element.dataset.gaSecondaryEvent;
  if (secondaryEventName && secondaryEventName !== eventName) {
    sendTrackedEvent(element, secondaryEventName);
  }
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

  if (link.dataset.gaCheckoutOpening === "true") return;
  link.dataset.gaCheckoutOpening = "true";

  const identity = await getGaIdentity();
  enrichCheckoutLink(link, identity);

  if (!identity) {
    console.info("[checkout-attribution] Consented checkout without GA4 client ID.");
  }

  const eventName = link.dataset.gaEvent ?? "begin_checkout";
  sendTrackedEvent(link, eventName);

  const secondaryEventName = link.dataset.gaSecondaryEvent;
  if (secondaryEventName && secondaryEventName !== eventName) {
    sendTrackedEvent(link, secondaryEventName);
  }

  // Preserve the overlay when our async attribution step intercepts a click.
  // Otherwise the first click would unexpectedly leave the site.
  if (typeof window.LemonSqueezy?.Url?.Open === "function") {
    window.LemonSqueezy.Url.Open(link.href);
  } else {
    window.location.assign(link.href);
  }
  delete link.dataset.gaCheckoutOpening;
}

const viewedNewsletterForms = new WeakSet<HTMLFormElement>();
const watchedNewsletterRoots = new WeakSet<HTMLElement>();
let newsletterViewObserver: IntersectionObserver | undefined;

function newsletterParams(form: HTMLFormElement): EventParams {
  return {
    cta_location: form.dataset.dblPlacement || "website",
    source_page: window.location.pathname,
  };
}

function trackNewsletterViews(): void {
  newsletterViewObserver?.disconnect();
  if (!hasAnalyticsConsent() || typeof IntersectionObserver === "undefined") return;

  newsletterViewObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.35) continue;
      const form = entry.target;
      if (!(form instanceof HTMLFormElement) || viewedNewsletterForms.has(form)) continue;
      viewedNewsletterForms.add(form);
      sendEvent("newsletter_form_view", newsletterParams(form));
      observer.unobserve(form);
    }
  }, { threshold: [0.35] });

  for (const form of document.querySelectorAll<HTMLFormElement>("[data-dbl-newsletter-form]")) {
    if (!viewedNewsletterForms.has(form)) newsletterViewObserver.observe(form);
  }
}

function onNewsletterSubmit(event: Event): void {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches("[data-dbl-newsletter-form]")) return;
  sendEvent("newsletter_signup_submit", newsletterParams(form));
}

function observeNewsletterResults(): void {
  for (const root of document.querySelectorAll<HTMLElement>("[data-newsletter-root]")) {
    if (watchedNewsletterRoots.has(root)) continue;
    watchedNewsletterRoots.add(root);

    const observer = new MutationObserver(() => {
      if (root.dataset.newsletterSuccessTracked === "true") {
        observer.disconnect();
        return;
      }

      // Only a Kit-rendered success state counts, never a button click alone.
      const success = root.querySelector<HTMLElement>(
        ".formkit-alert-success, .formkit-success, [data-element='success']",
      );
      if (!success?.textContent?.trim()) return;

      root.dataset.newsletterSuccessTracked = "true";
      const form = root.querySelector<HTMLFormElement>("[data-dbl-newsletter-form]");
      sendEvent("newsletter_signup_success", {
        cta_location: form?.dataset.dblPlacement || "website",
        source_page: window.location.pathname,
      });
      observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
  }
}

function onPageReady(): void {
  trackPageContent();
  void enrichCheckoutLinks();
  trackNewsletterViews();
  observeNewsletterResults();
}

export function initializeAnalytics(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  document.addEventListener("click", handleCheckoutCapture, true);
  document.addEventListener("click", handleTrackedClick);
  document.addEventListener("submit", onNewsletterSubmit, true);
  document.addEventListener("astro:page-load", onPageReady);
  window.addEventListener("dbl:analytics-ready", onPageReady);

  onPageReady();
}
