import assert from "node:assert/strict";
import test from "node:test";
import {
  createExamplePricingInput,
  EXAMPLE_INPUT_LABEL,
  EXAMPLE_PRICING_INPUT,
  PRICING_FIELD_LIMITS,
  PROJECT_PHASE_KEYS,
  PROJECT_PHASE_LABELS,
  QUOTE_ROUNDING_INCREMENTS,
} from "./defaults.ts";

function sumHours(phases) {
  return PROJECT_PHASE_KEYS.reduce((total, phase) => total + phases[phase], 0);
}

test("example contains the prescribed nine phases totaling 60 hours", () => {
  assert.equal(PROJECT_PHASE_KEYS.length, 9);
  assert.deepEqual(Object.keys(EXAMPLE_PRICING_INPUT.project.phaseHours), [...PROJECT_PHASE_KEYS]);
  assert.equal(sumHours(EXAMPLE_PRICING_INPUT.project.phaseHours), 60);
  assert.equal(new Set(PROJECT_PHASE_KEYS).size, 9);
  for (const phase of PROJECT_PHASE_KEYS) {
    assert.ok(PROJECT_PHASE_LABELS[phase], `Label missing for ${phase}`);
  }
});

test("example values use the declared USD, fractional-rate, and quarter-hour conventions", () => {
  const example = EXAMPLE_PRICING_INPUT;
  assert.deepEqual(example.baseline, {
    annualCompensation: 80_000,
    annualOverhead: 8_000,
    workingWeeks: 46,
    billableHoursPerWeek: 22,
  });
  assert.deepEqual(example.protection, {
    contingencyRate: 0.15,
    surplusMarginRate: 0.10,
    variableProcessingRate: 0.03,
    fixedProcessingFee: 0,
    roundingIncrement: 100,
  });
  assert.equal(example.project.directExpenses, 250);
  assert.equal(example.overrunRate, 0.20);
  assert.match(EXAMPLE_INPUT_LABEL, /Example values/);
  for (const phase of PROJECT_PHASE_KEYS) {
    assert.equal((example.project.phaseHours[phase] * 4) % 1, 0);
  }
});

test("configured ranges and allowed quote increments are explicit", () => {
  assert.equal(PRICING_FIELD_LIMITS.annualCompensation.max, 2_000_000);
  assert.equal(PRICING_FIELD_LIMITS.annualOverhead.max, 1_000_000);
  assert.equal(PRICING_FIELD_LIMITS.directExpenses.max, 1_000_000);
  assert.equal(PRICING_FIELD_LIMITS.phaseHours.max, 2_000);
  assert.equal(PRICING_FIELD_LIMITS.phaseHours.step, 0.25);
  assert.equal(PRICING_FIELD_LIMITS.contingencyRate.max, 0.5);
  assert.equal(PRICING_FIELD_LIMITS.overrunRate.step, 0.05);
  assert.deepEqual(QUOTE_ROUNDING_INCREMENTS, [1, 25, 50, 100]);
});

test("each example instance is independent, including nested phase hours", () => {
  const first = createExamplePricingInput();
  const second = createExamplePricingInput();
  first.project.phaseHours.development = 100;
  first.baseline.annualCompensation = 123;
  first.protection.contingencyRate = 0.40;
  assert.equal(second.project.phaseHours.development, 24);
  assert.equal(second.baseline.annualCompensation, 80_000);
  assert.equal(second.protection.contingencyRate, 0.15);
  assert.equal(EXAMPLE_PRICING_INPUT.project.phaseHours.development, 24);
});
