import { PRICING_FIELD_LIMITS, PROJECT_PHASE_KEYS, QUOTE_ROUNDING_INCREMENTS } from "./defaults.ts";
import type { PricingErrors, PricingInput, ProjectPhaseHours, ProjectPhaseKey, QuoteRoundingIncrement } from "./types.ts";

/** Numeric inputs are normalized (USD, decimal hours, fractional rates) before validation. */
export type PricingValidationResult =
  | { valid: true; value: PricingInput; errors: PricingErrors }
  | { valid: false; errors: PricingErrors; value?: never };

export type NumericField = keyof typeof PRICING_FIELD_LIMITS | "roundingIncrement";
export type NumericParseResult =
  | { valid: true; value: number }
  | { valid: false; reason: "required" | "invalid" };

const RATE_FIELDS = new Set<NumericField>([
  "contingencyRate", "surplusMarginRate", "variableProcessingRate", "overrunRate",
]);
const MONEY_FIELDS = new Set<NumericField>([
  "annualCompensation", "annualOverhead", "directExpenses", "fixedProcessingFee",
]);

/**
 * Parse an editable field WITHOUT imposing min/max/step restrictions. The UI can
 * preserve raw text until blur. Plain numeric rates are fractions (`0.15`),
 * while explicitly suffixed percentages are converted (`15%` -> `0.15`).
 * Monetary fields accept a leading $ and correctly grouped commas; malformed
 * grouping, trailing junk, scientific notation and arbitrary symbols fail.
 */
export function parsePricingNumber(raw: string | number | null | undefined, field: NumericField): NumericParseResult {
  if (raw === null || raw === undefined) return { valid: false, reason: "required" };
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? { valid: true, value: raw } : { valid: false, reason: "invalid" };
  }

  const text = raw.trim();
  if (!text) return { valid: false, reason: "required" };

  const isRate = RATE_FIELDS.has(field);
  const hasPercent = text.endsWith("%");
  if (hasPercent && !isRate) return { valid: false, reason: "invalid" };
  const part = hasPercent ? text.slice(0, -1).trim() : text;
  const isMoney = MONEY_FIELDS.has(field);
  const numericText = isMoney ? part.replace(/^\$\s*/, "") : part;
  // Sign is retained to allow validation to explain negative values clearly.
  const numberPattern = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
  if (!numberPattern.test(numericText)) return { valid: false, reason: "invalid" };

  const numeric = Number(numericText.replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return { valid: false, reason: "invalid" };
  const value = hasPercent ? numeric / 100 : numeric;
  return Number.isFinite(value) ? { valid: true, value } : { valid: false, reason: "invalid" };
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function stepAligned(value: number, step: number): boolean {
  // Compare in the original units to avoid binary float false negatives.
  const nearest = Math.round(value / step);
  return Math.abs(value - nearest * step) <= 1e-9 && (value === 0 || nearest !== 0);
}

/** No silent coercion or clamping. An invalid model never receives a value. */
export function validatePricingInput(input: unknown): PricingValidationResult {
  const errors: PricingErrors = {};
  const source = record(input);
  const baseline = record(source.baseline);
  const project = record(source.project);
  const phases = record(project.phaseHours);
  const protection = record(source.protection);

  function read(field: Exclude<NumericField, "phaseHours" | "roundingIncrement">, raw: unknown, errorKey: keyof PricingErrors = field): number | undefined {
    if (raw === undefined || raw === null || raw === "") {
      errors[errorKey] = "This field is required.";
      return undefined;
    }
    if (typeof raw !== "number" || !Number.isFinite(raw)) {
      errors[errorKey] = "Enter a finite number.";
      return undefined;
    }
    const limits = PRICING_FIELD_LIMITS[field];
    if (raw < limits.min || (limits.exclusiveMin && raw <= limits.min) || raw > limits.max) {
      errors[errorKey] = limits.exclusiveMin
        ? `Enter a value greater than ${limits.min} and no more than ${limits.max}.`
        : `Enter a value from ${limits.min} to ${limits.max}.`;
      return undefined;
    }
    if (!stepAligned(raw, limits.step)) {
      errors[errorKey] = `Use increments of ${limits.step} ${limits.unit}.`;
      return undefined;
    }
    return raw;
  }

  function readPhase(key: ProjectPhaseKey): number | undefined {
    const field = `phaseHours.${key}` as const;
    const raw = phases[key];
    if (raw === undefined || raw === null || raw === "") {
      errors[field] = "This phase needs a number; enter 0 if no work is expected.";
      return undefined;
    }
    if (typeof raw !== "number" || !Number.isFinite(raw)) {
      errors[field] = "Enter a finite number of hours.";
      return undefined;
    }
    const { min, max, step } = PRICING_FIELD_LIMITS.phaseHours;
    if (raw < min || raw > max) {
      errors[field] = `Enter between ${min} and ${max} hours.`;
      return undefined;
    }
    if (!stepAligned(raw, step)) {
      errors[field] = "Use quarter-hour (0.25) increments.";
      return undefined;
    }
    return raw;
  }

  const annualCompensation = read("annualCompensation", baseline.annualCompensation);
  const annualOverhead = read("annualOverhead", baseline.annualOverhead);
  const workingWeeks = read("workingWeeks", baseline.workingWeeks);
  const billableHoursPerWeek = read("billableHoursPerWeek", baseline.billableHoursPerWeek);
  const parsedPhases = {} as Partial<ProjectPhaseHours>;
  for (const key of PROJECT_PHASE_KEYS) {
    const value = readPhase(key);
    if (value !== undefined) parsedPhases[key] = value;
  }
  if (PROJECT_PHASE_KEYS.every(key => parsedPhases[key] !== undefined)) {
    const totalHours = PROJECT_PHASE_KEYS.reduce((sum, key) => sum + (parsedPhases[key] ?? 0), 0);
    if (totalHours <= 0) errors["phaseHours.total"] = "The project must include more than zero total hours.";
  }
  const directExpenses = read("directExpenses", project.directExpenses);
  const contingencyRate = read("contingencyRate", protection.contingencyRate);
  const surplusMarginRate = read("surplusMarginRate", protection.surplusMarginRate);
  const variableProcessingRate = read("variableProcessingRate", protection.variableProcessingRate);
  const fixedProcessingFee = read("fixedProcessingFee", protection.fixedProcessingFee);
  const overrunRate = read("overrunRate", source.overrunRate);

  let roundingIncrement: QuoteRoundingIncrement | undefined;
  const rawRounding = protection.roundingIncrement;
  if (rawRounding === null || rawRounding === undefined || rawRounding === "") {
    errors.roundingIncrement = "Select a quote-rounding increment.";
  } else if (typeof rawRounding !== "number" || !QUOTE_ROUNDING_INCREMENTS.some(n => n === rawRounding)) {
    errors.roundingIncrement = "Choose $1, $25, $50, or $100.";
  } else {
    roundingIncrement = rawRounding as QuoteRoundingIncrement;
  }

  // Defense in depth: current independent maxima already limit the combined rate.
  if (typeof protection.surplusMarginRate === "number" && Number.isFinite(protection.surplusMarginRate)
    && typeof protection.variableProcessingRate === "number" && Number.isFinite(protection.variableProcessingRate)
    && protection.surplusMarginRate + protection.variableProcessingRate >= 1) {
    errors.surplusMarginRate = "Surplus margin plus processing rate must be below 100%.";
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  return {
    valid: true,
    errors,
    value: {
      baseline: {
        annualCompensation: annualCompensation!,
        annualOverhead: annualOverhead!,
        workingWeeks: workingWeeks!,
        billableHoursPerWeek: billableHoursPerWeek!,
      },
      project: { phaseHours: parsedPhases as ProjectPhaseHours, directExpenses: directExpenses! },
      protection: {
        contingencyRate: contingencyRate!,
        surplusMarginRate: surplusMarginRate!,
        variableProcessingRate: variableProcessingRate!,
        fixedProcessingFee: fixedProcessingFee!,
        roundingIncrement: roundingIncrement!,
      },
      overrunRate: overrunRate!,
    },
  };
}