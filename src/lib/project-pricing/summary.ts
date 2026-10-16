import { PROJECT_PHASE_KEYS } from "./types.ts";
import { PROJECT_PHASE_LABELS } from "./defaults.ts";
import { formatHours, formatPercentage, formatUSD, formatUSDPerHour } from "./format.ts";
import type { PricingInput, PricingResult } from "./types.ts";

export const INTERNAL_PLANNING_LABEL = "Internal planning estimate — not a client proposal";

/**
 * Deliberately accept only validated numeric data and calculated results.
 * No DOM values, notes, client details, or arbitrary user text enters exports.
 * Both clipboard and print views use this single report text.
 */
export function buildPricingSummary(input: PricingInput, result: PricingResult): string {
  const { baseline, project, protection } = input;
  return [
    "Developer Business Lab — Freelance Project Pricing Calculator",
    INTERNAL_PLANNING_LABEL,
    "",
    `Cost-based fixed-price quote estimate: ${formatUSD(result.roundedQuote)}`,
    `Unrounded estimate: ${formatUSD(result.unroundedQuote)}`,
    `Rounding increment: ${formatUSD(protection.roundingIncrement)}`,
    "",
    "Business baseline",
    `Annual owner compensation goal (before personal income tax): ${formatUSD(baseline.annualCompensation)}`,
    `Annual business overhead: ${formatUSD(baseline.annualOverhead)}`,
    `Working weeks per year: ${baseline.workingWeeks}`,
    `Billable hours per week: ${formatHours(baseline.billableHoursPerWeek)}`,
    `Annual billable capacity: ${formatHours(result.annualBillableHours)}`,
    `Internal hourly floor: ${formatUSDPerHour(result.internalHourlyFloor)}`,
    "",
    "Project estimate",
    ...PROJECT_PHASE_KEYS.map((key) => `${PROJECT_PHASE_LABELS[key]}: ${formatHours(project.phaseHours[key])}`),
    `Base project hours: ${formatHours(result.baseProjectHours)}`,
    `Direct project expenses: ${formatUSD(result.directProjectExpenses)}`,
    "",
    "Quote protections and modeled costs",
    `Labor contingency: ${formatPercentage(protection.contingencyRate)}`,
    `Contingency-budgeted hours: ${formatHours(result.contingencyBudgetHours)}`,
    `Target surplus margin on quote revenue: ${formatPercentage(protection.surplusMarginRate)}`,
    `Variable payment-processing rate: ${formatPercentage(protection.variableProcessingRate)}`,
    `Fixed processing fees for whole quote: ${formatUSD(protection.fixedProcessingFee)}`,
    `Modeled labor allocation: ${formatUSD(result.modeledLaborCost)}`,
    `Total modeled cost allocation (including direct expenses): ${formatUSD(result.modeledCostAllocation)}`,
    `Modeled payment-processing fees: ${formatUSD(result.processingFees)}`,
    `Modeled surplus after cost allocation and fees: ${formatUSD(result.plannedSurplus)}`,
    "",
    "Project-overrun scenario (quote stays fixed)",
    `Selected overrun: ${formatPercentage(input.overrunRate)}`,
    `Actual modeled hours (from base hours): ${formatHours(result.actualScenarioHours)}`,
    `Recovered revenue per actual hour: ${formatUSDPerHour(result.recoveredPerActualHour)}`,
    `Modeled scenario surplus: ${formatUSD(result.scenarioSurplus)}`,
    `Maximum modeled hours at internal hourly floor: ${formatHours(result.maxHoursAtFloor)}`,
    `Recovery compared with internal target: ${result.hourlyFloorComparison}`,
    "",
    "Planning only: this cost-based estimate does not establish a market price or guarantee profit.",
    "Below-target hourly recovery is not necessarily an accounting loss.",
  ].join("\n");
}

/** Returns false for permission denials or missing clipboard APIs; never throws. */
export async function copyPricingSummary(
  text: string,
  clipboard?: { writeText(text: string): Promise<void> },
): Promise<boolean> {
  if (!clipboard) return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}