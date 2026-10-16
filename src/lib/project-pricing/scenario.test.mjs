import test from "node:test";
import assert from "node:assert/strict";
import {
  calculatePricing, calculatePricingQuote, compareHourlyRecovery,
  HOURLY_FLOOR_COMPARISON_LABELS,
} from "./calculate.ts";
import { createExamplePricingInput, PROJECT_PHASE_KEYS } from "./defaults.ts";

function example(modify = () => {}) {
  const input = createExamplePricingInput();
  modify(input);
  return input;
}
function result(input) {
  const output = calculatePricing(input);
  assert.equal(output.valid, true, JSON.stringify(output.errors));
  return output.result;
}
function near(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test("authoritative 20% scenario models 72 actual hours and $93.53/hour recovery", () => {
  const r = result(example());
  assert.equal(r.baseProjectHours, 60);
  near(r.contingencyBudgetHours, 69);
  assert.equal(r.actualScenarioHours, 72);
  assert.equal(r.roundedQuote, 7200);
  near(r.processingFees, 216);
  near(r.recoveredPerActualHour, (7200 - 216 - 250) / 72);
  assert.equal(Number(r.recoveredPerActualHour.toFixed(2)), 93.53);
  near(r.internalHourlyFloor, 88000 / 1012);
  near(r.scenarioSurplus, 7200 - 216 - 250 - 72 * (88000 / 1012));
  near(r.maxHoursAtFloor, (7200 - 216 - 250) / (88000 / 1012));
  assert.equal(r.hourlyFloorComparison, "above");
});

test("overrun never changes fixed quote and higher overruns lower hourly recovery", () => {
  const before = result(example(i => { i.overrunRate = 0; }));
  const middle = result(example(i => { i.overrunRate = 0.5; }));
  const after = result(example(i => { i.overrunRate = 1; }));
  assert.deepEqual([before.actualScenarioHours, middle.actualScenarioHours, after.actualScenarioHours], [60, 90, 120]);
  assert.equal(before.roundedQuote, middle.roundedQuote);
  assert.equal(middle.roundedQuote, after.roundedQuote);
  assert.equal(before.processingFees, after.processingFees);
  assert.equal(before.maxHoursAtFloor, after.maxHoursAtFloor);
  assert.ok(before.recoveredPerActualHour > middle.recoveredPerActualHour);
  assert.ok(middle.recoveredPerActualHour > after.recoveredPerActualHour);
  assert.equal(after.hourlyFloorComparison, "below");
  assert.ok(before.scenarioSurplus > middle.scenarioSurplus);
  assert.ok(middle.scenarioSurplus > after.scenarioSurplus);
});

test("scenario uses base project hours, not contingency hours", () => {
  const a = result(example(i => { i.overrunRate = 0; }));
  assert.equal(a.actualScenarioHours, 60);
  const b = result(example(i => { i.protection.contingencyRate = 0.5; }));
  assert.equal(b.contingencyBudgetHours, 90);
  assert.equal(b.actualScenarioHours, 72);
});

test("direct expenses and variable/fixed processing fees are each deducted exactly once", () => {
  const r = result(example(i => {
    i.protection.fixedProcessingFee = 15;
    i.protection.variableProcessingRate = 0.04;
    i.protection.surplusMarginRate = 0.1;
    i.overrunRate = 0;
  }));
  near(r.processingFees, 0.04 * r.roundedQuote + 15);
  near(r.recoveredPerActualHour, (r.roundedQuote - r.processingFees - r.directProjectExpenses) / 60);
  near(r.scenarioSurplus, r.roundedQuote - r.processingFees - r.directProjectExpenses - 60 * r.internalHourlyFloor);
});

test("invalid zero-hour and zero-capacity inputs cannot reach divisions", () => {
  for (const input of [
    example(i => { for (const phase of PROJECT_PHASE_KEYS) i.project.phaseHours[phase] = 0; }),
    example(i => { i.baseline.billableHoursPerWeek = 0; }),
    example(i => { i.baseline.workingWeeks = 0; }),
    example(i => { i.overrunRate = 1.05; }),
  ]) {
    const v = calculatePricing(input);
    assert.equal(v.valid, false);
    assert.equal("result" in v, false);
    assert.ok(Object.keys(v.errors).length > 0);
  }
});

test("hourly-floor comparison includes exact, near-equality, above and below", () => {
  assert.equal(compareHourlyRecovery(100, 100), "at");
  assert.equal(compareHourlyRecovery(100 + 1e-9, 100), "at");
  assert.equal(compareHourlyRecovery(100 - 1e-9, 100), "at");
  assert.equal(compareHourlyRecovery(100.0001, 100), "above");
  assert.equal(compareHourlyRecovery(99.9999, 100), "below");
  assert.throws(() => compareHourlyRecovery(Infinity, 1), RangeError);
  assert.match(HOURLY_FLOOR_COMPARISON_LABELS.at, /^At your internal hourly floor$/);
  assert.doesNotMatch(HOURLY_FLOOR_COMPARISON_LABELS.below, /losing money|loss|profit/i);
});

test("input property insertion order has no effect and source input is unchanged", () => {
  const original = example();
  const snapshot = structuredClone(original);
  const reversed = example(i => {
    i.project.phaseHours = Object.fromEntries(Object.entries(i.project.phaseHours).reverse());
  });
  assert.deepEqual(result(original), result(reversed));
  assert.deepEqual(original, snapshot);
});

test("scenario wrapper matches preexisting quote computation exactly", () => {
  const input = example();
  const quote = calculatePricingQuote(input);
  assert.equal(quote.valid, true);
  const scenario = result(input);
  for (const [key, value] of Object.entries(quote.result)) assert.equal(scenario[key], value, key);
});