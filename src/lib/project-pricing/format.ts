/** Browser-independent, display-only helpers. Financial math must use raw numbers. */
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const hourFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0, maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent", minimumFractionDigits: 0, maximumFractionDigits: 1,
});

/** Dollars, always showing cents. Does not change the underlying amount. */
export function formatUSD(amount: number): string {
  return usdFormatter.format(amount);
}

/** Dollars recovered or required per hour; cents matter to comparison. */
export function formatUSDPerHour(rate: number): string {
  return `${formatUSD(rate)}/hr`;
}

/** Decimal hours (quarter-hour values are preserved in display). */
export function formatHours(hours: number): string {
  return `${hourFormatter.format(hours)} ${hours === 1 ? "hour" : "hours"}`;
}

/** Input must be a fractional rate (0.15 -> 15%; 0.001 -> 0.1%). */
export function formatPercentage(fraction: number): string {
  return percentFormatter.format(fraction);
}