import { PROJECT_PHASE_KEYS } from "./types.ts";
import type { PricingErrors, PricingQuoteResult } from "./types.ts";
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