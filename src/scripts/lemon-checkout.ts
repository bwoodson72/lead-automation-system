/**
 * Lemon.js attaches checkout listeners to the elements present when it loads.
 * Astro's ClientRouter replaces them during navigation, so refresh after
 * each completed navigation. Existing hrefs remain the fallback.
 */
type LemonWindow = Window & {
  LemonSqueezy?: { Refresh?: () => void; Url?: { Close?: () => void } };
};

const LEMON_SCRIPT_SRC = "https://app.lemonsqueezy.com/js/lemon.js";

let navigationNumber = 0;
let refreshedNavigation = -1;
let watchingScript: HTMLScriptElement | null = null;

function refreshCurrentPage(): void {
  if (refreshedNavigation === navigationNumber) return;

  const lemon = (window as LemonWindow).LemonSqueezy;
  if (typeof lemon?.Refresh !== "function") return;

  lemon.Refresh();
  refreshedNavigation = navigationNumber;
}

function handlePageLoad(): void {
  navigationNumber += 1;
  refreshCurrentPage();

  if (refreshedNavigation === navigationNumber) return;

  // The deferred CDN script may finish after Astro's initial page-load.
  // Listen for its completion once; do not poll or inject another script.
  const script = document.querySelector<HTMLScriptElement>(
    `script[src="${LEMON_SCRIPT_SRC}"]`,
  );
  if (!script || watchingScript === script) return;

  watchingScript = script;
  script.addEventListener(
    "load",
    () => {
      watchingScript = null;
      refreshCurrentPage();
    },
    { once: true },
  );
  script.addEventListener(
    "error",
    () => {
      watchingScript = null;
    },
    { once: true },
  );
}

// Astro's bundled module script executes once across ClientRouter transitions.
document.addEventListener("astro:page-load", handlePageLoad);
 
// The free-item confirmation inside Lemon Squeezy has no close control of its
// own. This host-page control works without reaching into the provider iframe.
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("#dbl-lemon-close")) {
    (window as LemonWindow).LemonSqueezy?.Url?.Close?.();
  }
});
