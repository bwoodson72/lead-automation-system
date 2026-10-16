/**
 * Page-visit-only interaction milestones. No input values or financial amounts
 * are accepted by these methods. The supplied sender is consent-gated by the
 * site's existing analytics module and reports whether delivery was permitted.
 */
export const PRICING_CALCULATOR_EVENTS = [
  "pricing_calc_start",
  "pricing_calc_complete",
  "pricing_calc_overrun",
  "pricing_calc_copy",
  "pricing_calc_print",
] as const;

export type PricingCalculatorEvent = (typeof PRICING_CALCULATOR_EVENTS)[number];
export type PricingCalculatorPlacement = "copy_summary" | "print_estimate";
export const PRICING_TOOL_ID = "freelance_project_pricing_calculator";
export const PRICING_SOURCE_PAGE = "/tools/freelance-project-pricing-calculator/";

/** All transmitted parameters are predefined strings; never forward form state. */
export function pricingCalculatorEventParams(placement?: PricingCalculatorPlacement) {
  return {
    tool_id: PRICING_TOOL_ID,
    source_page: PRICING_SOURCE_PAGE,
    ...(placement ? { cta_location: placement } : {}),
  };
}

export type PricingCalculatorEventSender = (
  event: PricingCalculatorEvent,
  placement?: PricingCalculatorPlacement,
) => boolean;

export function createPricingInteractionTracker(send: PricingCalculatorEventSender) {
  let started = false;
  let completed = false;
  let overrunTracked = false;
  let financialEditPending = false;

  function markStart(): void {
    if (!started && send("pricing_calc_start")) started = true;
  }

  return {
    /** Only a user-generated input/change callback may call this method. */
    financialInputEdited(): void {
      financialEditPending = true;
      markStart();
    },
    scenarioAdjusted(): void {
      markStart();
      if (!overrunTracked && send("pricing_calc_overrun")) overrunTracked = true;
    },
    /** Call after reactive state settles, never with unvalidated numbers. */
    evaluated(isValid: boolean): void {
      if (completed || !financialEditPending || !isValid) return;
      if (send("pricing_calc_complete")) {
        completed = true;
        financialEditPending = false;
      }
    },
    /** Reset buttons change sample inputs, not visit-level milestones. */
    inputsReset(): void {
      financialEditPending = false;
    },
    copySucceeded(): void {
      send("pricing_calc_copy", "copy_summary");
    },
    printDialogInvoked(): void {
      send("pricing_calc_print", "print_estimate");
    },
  };
}