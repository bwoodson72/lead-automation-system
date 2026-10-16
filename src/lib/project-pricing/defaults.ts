import {
  PROJECT_PHASE_KEYS,
  type PricingInput,
  type ProjectPhaseHours,
  type ProjectPhaseKey,
  type QuoteRoundingIncrement,
} from "./types.ts";

/** Phase order is defined once in PROJECT_PHASE_KEYS and reused by later UI. */
export const PROJECT_PHASE_LABELS = {
  discoveryPlanning: "Discovery and planning",
  design: "Design",
  development: "Development",
  integrations: "Integrations",
  clientCommunication: "Client communication and project management",
  qualityAssurance: "Quality assurance and testing",
  revisions: "Revisions",
  deploymentHandoff: "Deployment and handoff",
  other: "Other work",
} as const satisfies Record<ProjectPhaseKey, string>;

/** All numeric ranges and input precision live here, not in UI handlers. */
export const PRICING_FIELD_LIMITS = {
  annualCompensation: { min: 0, exclusiveMin: true, max: 2_000_000, step: 0.01, unit: "USD" },
  annualOverhead: { min: 0, exclusiveMin: false, max: 1_000_000, step: 0.01, unit: "USD" },
  workingWeeks: { min: 1, exclusiveMin: false, max: 52, step: 1, unit: "weeks" },
  billableHoursPerWeek: { min: 0, exclusiveMin: true, max: 80, step: 0.25, unit: "hours/week" },
  phaseHours: { min: 0, exclusiveMin: false, max: 2_000, step: 0.25, unit: "hours" },
  directExpenses: { min: 0, exclusiveMin: false, max: 1_000_000, step: 0.01, unit: "USD" },
  contingencyRate: { min: 0, exclusiveMin: false, max: 0.5, step: 0.01, unit: "fraction" },
  surplusMarginRate: { min: 0, exclusiveMin: false, max: 0.4, step: 0.01, unit: "fraction" },
  variableProcessingRate: { min: 0, exclusiveMin: false, max: 0.15, step: 0.001, unit: "fraction" },
  fixedProcessingFee: { min: 0, exclusiveMin: false, max: 1_000_000, step: 0.01, unit: "USD" },
  overrunRate: { min: 0, exclusiveMin: false, max: 1, step: 0.05, unit: "fraction" },
} as const;

/** Quote prices are always rounded UP to a selected whole-dollar increment. */
export const QUOTE_ROUNDING_INCREMENTS = [1, 25, 50, 100] as const satisfies readonly QuoteRoundingIncrement[];

/**
 * Data conventions:
 * - USD monetary amounts may have cent precision (0.01).
 * - Time is measured in decimal hours; project phases use quarter hours (0.25).
 * - Rates and scenario overruns are FRACTIONS (15% => 0.15), not 15.
 * - Rate UI can display percentages; only parsing/validation should convert them.
 * - Limits inform validation only; values must NEVER be silently clamped.
 * - These are illustrative defaults, not recommended industry benchmarks.
 */
export const EXAMPLE_PRICING_INPUT: Readonly<PricingInput> = {
  baseline: {
    annualCompensation: 80_000,
    annualOverhead: 8_000,
    workingWeeks: 46,
    billableHoursPerWeek: 22,
  },
  project: {
    phaseHours: {
      discoveryPlanning: 6,
      design: 8,
      development: 24,
      integrations: 6,
      clientCommunication: 5,
      qualityAssurance: 5,
      revisions: 4,
      deploymentHandoff: 2,
      other: 0,
    } satisfies ProjectPhaseHours,
    directExpenses: 250,
  },
  protection: {
    contingencyRate: 0.15,
    surplusMarginRate: 0.10,
    variableProcessingRate: 0.03,
    fixedProcessingFee: 0,
    roundingIncrement: 100,
  },
  overrunRate: 0.20,
};

/** Create independent editable state; never mutate the shared example object. */
export function createExamplePricingInput(): PricingInput {
  return {
    baseline: { ...EXAMPLE_PRICING_INPUT.baseline },
    project: {
      phaseHours: { ...EXAMPLE_PRICING_INPUT.project.phaseHours },
      directExpenses: EXAMPLE_PRICING_INPUT.project.directExpenses,
    },
    protection: { ...EXAMPLE_PRICING_INPUT.protection },
    overrunRate: EXAMPLE_PRICING_INPUT.overrunRate,
  };
}

export const EXAMPLE_INPUT_LABEL = "Example values — replace these with your numbers";

/** Expose the prescribed display order without duplicating phase names. */
export { PROJECT_PHASE_KEYS };
