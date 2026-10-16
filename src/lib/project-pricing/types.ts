/** The nine independent kinds of work included in a fixed-price project estimate. */
export const PROJECT_PHASE_KEYS = [
  "discoveryPlanning",
  "design",
  "development",
  "integrations",
  "clientCommunication",
  "qualityAssurance",
  "revisions",
  "deploymentHandoff",
  "other",
] as const;

export type ProjectPhaseKey = (typeof PROJECT_PHASE_KEYS)[number];
export type ProjectPhaseHours = Record<ProjectPhaseKey, number>;
export type QuoteRoundingIncrement = 1 | 25 | 50 | 100;

/** Compensation is pre-personal-income-tax; overhead excludes direct project costs. */
export interface BusinessBaseline {
  annualCompensation: number;
  annualOverhead: number;
  workingWeeks: number;
  billableHoursPerWeek: number;
}

export interface ProjectEstimate {
  phaseHours: ProjectPhaseHours;
  directExpenses: number;
}

/**
 * Rates are fractions, never whole percentage points: 15% = 0.15.
 * Margin and variable fees are shares of quote revenue, not cost markups.
 */
export interface QuoteProtection {
  contingencyRate: number;
  surplusMarginRate: number;
  variableProcessingRate: number;
  fixedProcessingFee: number;
  roundingIncrement: QuoteRoundingIncrement;
}

/**
 * All money fields are USD; hours are decimal hours. No date, API, or browser
 * state is required to create or use the pricing data contract.
 */
export interface PricingInput {
  baseline: BusinessBaseline;
  project: ProjectEstimate;
  protection: QuoteProtection;
  /** Fraction, so a 20% overrun is 0.20. */
  overrunRate: number;
}

/** Output shape for the calculation stage; no calculation exists in step 01. */
export interface PricingResult {
  annualBillableHours: number;
  internalHourlyFloor: number;
  baseProjectHours: number;
  contingencyBudgetHours: number;
  modeledCostAllocation: number;
  unroundedQuote: number;
  roundedQuote: number;
  processingFees: number;
  plannedSurplus: number;
  actualScenarioHours: number;
  recoveredPerActualHour: number;
  scenarioSurplus: number;
  maxHoursAtFloor: number;
}

/** Field-specific errors for step 02 validation, including each phase key. */
export type PricingErrorField =
  | keyof BusinessBaseline
  | keyof Omit<ProjectEstimate, "phaseHours">
  | keyof QuoteProtection
  | "overrunRate"
  | `phaseHours.${ProjectPhaseKey}`
  | "phaseHours.total";

export type PricingErrors = Partial<Record<PricingErrorField, string>>;
