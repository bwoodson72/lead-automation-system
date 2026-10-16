import { PROJECT_PHASE_KEYS } from "./types.ts";
import type { HourlyFloorComparison, PricingErrors, PricingQuoteResult, PricingResult } from "./types.ts";
import { validatePricingInput } from "./validate.ts";

/** A quote is never returned for an invalid set of inputs. */
export type PricingQuoteCalculation =
  | { valid: true; result: PricingQuoteResult; errors?: never }
  | { valid: false; errors: PricingErrors; result?: never };

/**
 * Estimate the internal economics of one fixed-price job. All rates are
 * fractions of the relevant whole; surplus margin and variable processing
 * fees are fractions of quoted REVENUE, not markups on modeled cost.
 *
 * Intermediate amounts are deliberately not rounded. Only the final quote
 * is rounded UP to the user's chosen USD increment; presentation belongs
 * to a later formatting layer. No tax, market-rate, or sales prediction.
 */
export function calculatePricingQuote(input: unknown): PricingQuoteCalculation {
  const validated = validatePricingInput(input);
  if (!validated.valid) return { valid: false, errors: validated.errors };

  const { baseline, project, protection } = validated.value;
  const annualBillableHours = baseline.workingWeeks * baseline.billableHoursPerWeek;
  const baseProjectHours = PROJECT_PHASE_KEYS.reduce(
    (hours, phase) => hours + project.phaseHours[phase],
    0,
  );
  // Validated inputs guarantee these denominators are positive.
  const internalHourlyFloor =
    (baseline.annualCompensation + baseline.annualOverhead) / annualBillableHours;
  const contingencyBudgetHours = baseProjectHours * (1 + protection.contingencyRate);
  const modeledLaborCost = internalHourlyFloor * contingencyBudgetHours;
  const directProjectExpenses = project.directExpenses;
  // Overhead is already allocated through the internal hourly floor.
  const modeledCostAllocation = modeledLaborCost + directProjectExpenses;

  // Fixed fees apply to the whole quote once; the two fractional rates
  // consume shares of revenue and therefore belong in the denominator.
  const feeAndMarginDenominator =
    1 - protection.variableProcessingRate - protection.surplusMarginRate;
  const unroundedQuote =
    (modeledCostAllocation + protection.fixedProcessingFee) / feeAndMarginDenominator;
  const increment = protection.roundingIncrement;
  const roundedQuote = Math.ceil(unroundedQuote / increment) * increment;
  const processingFees =
    roundedQuote * protection.variableProcessingRate + protection.fixedProcessingFee;
  const plannedSurplus = roundedQuote - processingFees - modeledCostAllocation;

  // Reject arithmetic overflow as well as malformed input; an impossible
  // result is never silently shown as a financial recommendation.
  const amounts = [
    annualBillableHours,
    baseProjectHours,
    internalHourlyFloor,
    contingencyBudgetHours,
    modeledLaborCost,
    modeledCostAllocation,
    unroundedQuote,
    roundedQuote,
    processingFees,
    plannedSurplus,
  ];
  if (amounts.some(amount => !Number.isFinite(amount)) || roundedQuote < unroundedQuote) {
    return {
      valid: false,
      errors: { roundingIncrement: "Unable to calculate a finite quote from these inputs." },
    };
  }

  return {
    valid: true,
    result: {
      annualBillableHours,
      internalHourlyFloor,
      baseProjectHours,
      contingencyBudgetHours,
      modeledLaborCost,
      directProjectExpenses,
      modeledCostAllocation,
      unroundedQuote,
      roundedQuote,
      processingFees,
      plannedSurplus,
    },
  };
}


/** Complete quote plus the selected hours-overrun scenario. */
export type PricingCalculation =
  | { valid: true; result: PricingResult; errors?: never }
  | { valid: false; errors: PricingErrors; result?: never };

/**
 * Rates differing only by floating-point noise count as equal.
 * Tolerance is one part in 10^10 of the larger rate (minimum $1e-9/hour),
 * deliberately much smaller than one cent. This is NOT a commercial buffer.
 */
export function compareHourlyRecovery(
  recoveredPerActualHour: number,
  internalHourlyFloor: number,
): HourlyFloorComparison {
  if (!Number.isFinite(recoveredPerActualHour) || !Number.isFinite(internalHourlyFloor)) {
    throw new RangeError("Hourly recovery and floor must be finite numbers.");
  }
  const tolerance = Math.max(
    1e-9,
    Math.max(Math.abs(recoveredPerActualHour), Math.abs(internalHourlyFloor)) * 1e-10,
  );
  const difference = recoveredPerActualHour - internalHourlyFloor;
  if (Math.abs(difference) <= tolerance) return "at";
  return difference > 0 ? "above" : "below";
}

/** Neutral labels distinguish target recovery from accounting profit/loss. */
export const HOURLY_FLOOR_COMPARISON_LABELS: Readonly<Record<HourlyFloorComparison, string>> = {
  above: "Above your internal hourly floor",
  at: "At your internal hourly floor",
  below: "Below your internal hourly floor",
};

/**
 * Run the quote engine and model what happens when actual labor hours exceed
 * the BASE estimate, not the contingency-adjusted budget. An overrun never
 * changes the agreed fixed-price quote or its associated processing fees.
 *
 * These outputs describe target hourly recovery, not real-world profit or
 * loss. All intermediate calculations retain full JS number precision.
 */
export function calculatePricing(input: unknown): PricingCalculation {
  const validated = validatePricingInput(input);
  if (!validated.valid) return { valid: false, errors: validated.errors };

  const calculatedQuote = calculatePricingQuote(validated.value);
  if (!calculatedQuote.valid) return calculatedQuote;

  const quote = calculatedQuote.result;
  const actualScenarioHours = quote.baseProjectHours * (1 + validated.value.overrunRate);
  const laborRevenue = quote.roundedQuote - quote.processingFees - quote.directProjectExpenses;
  // Validation guarantees nonzero base hours and a positive internal floor.
  const recoveredPerActualHour = laborRevenue / actualScenarioHours;
  const scenarioSurplus = laborRevenue - actualScenarioHours * quote.internalHourlyFloor;
  const maxHoursAtFloor = laborRevenue / quote.internalHourlyFloor;

  if ([actualScenarioHours, recoveredPerActualHour, scenarioSurplus, maxHoursAtFloor]
    .some((value) => !Number.isFinite(value)) || actualScenarioHours <= 0) {
    return {
      valid: false,
      errors: { "phaseHours.total": "Unable to calculate a finite overrun scenario." },
    };
  }

  return {
    valid: true,
    result: {
      ...quote,
      actualScenarioHours,
      recoveredPerActualHour,
      scenarioSurplus,
      maxHoursAtFloor,
      hourlyFloorComparison: compareHourlyRecovery(recoveredPerActualHour, quote.internalHourlyFloor),
    },
  };
}