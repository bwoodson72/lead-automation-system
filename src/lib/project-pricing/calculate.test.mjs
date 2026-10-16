import assert from "node:assert/strict";
import test from "node:test";
import { calculatePricingQuote } from "./calculate.ts";
import { createExamplePricingInput, PROJECT_PHASE_KEYS } from "./defaults.ts";

function withChanges(changes) {
  const input = createExamplePricingInput();
  changes(input);
  return input;
}
function calculate(input = createExamplePricingInput()) {
  const calculation = calculatePricingQuote(input);
  assert.equal(calculation.valid, true, JSON.stringify(calculation.errors));
  return calculation.result;
}
function near(actual, expected, epsilon = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} != ${expected}`);
}

test("authoritative $7,200 quote fixture uses the whole 60-hour project", () => {
  const q = calculate();
  assert.equal(q.annualBillableHours, 1012);
  assert.equal(q.baseProjectHours, 60);
  near(q.internalHourlyFloor, 88000 / 1012);
  near(q.contingencyBudgetHours, 69);
  near(q.modeledLaborCost, 6000);
  near(q.directProjectExpenses, 250);
  near(q.modeledCostAllocation, 6250);
  near(q.unroundedQuote, 6250 / 0.87);
  assert.equal(q.roundedQuote, 7200);
  near(q.processingFees, 216);
  near(q.plannedSurplus, 734);
  assert.ok(q.unroundedQuote > 7183 && q.unroundedQuote < 7184);
});

test("zero overhead, direct expenses, and fees are valid", () => {
  const q = calculate(withChanges(i => {
    i.baseline.annualOverhead = 0;
    i.project.directExpenses = 0;
    i.protection.variableProcessingRate = 0;
    i.protection.fixedProcessingFee = 0;
    i.protection.surplusMarginRate = 0;
    i.protection.contingencyRate = 0;
    i.protection.roundingIncrement = 1;
  }));
  near(q.internalHourlyFloor, 80000 / 1012);
  near(q.modeledCostAllocation, q.internalHourlyFloor * 60);
  assert.equal(q.processingFees, 0);
  assert.equal(q.roundedQuote, Math.ceil(q.unroundedQuote));
});

test("invalid zero capacity, zero total project hours, and nonfinite inputs return no quote", () => {
  for (const input of [
    withChanges(i => { i.baseline.billableHoursPerWeek = 0; }),
    withChanges(i => { i.baseline.workingWeeks = 0; }),
    withChanges(i => { for (const phase of PROJECT_PHASE_KEYS) i.project.phaseHours[phase] = 0; }),
    withChanges(i => { i.baseline.annualCompensation = Infinity; }),
    withChanges(i => { i.protection.surplusMarginRate = 0.9; i.protection.variableProcessingRate = 0.1; }),
  ]) {
    const r = calculatePricingQuote(input);
    assert.equal(r.valid, false);
    assert.equal("result" in r, false, "Invalid inputs must not return a quote");
    assert.ok(Object.keys(r.errors).length);
  }
});

test("annual overhead is covered inside the hourly floor and is not added again", () => {
  const q = calculate();
  near(q.modeledLaborCost, (80000 + 8000) / 1012 * 69);
  near(q.modeledCostAllocation, q.modeledLaborCost + 250);
  const noOverhead = calculate(withChanges(i => { i.baseline.annualOverhead = 0; }));
  near(q.modeledLaborCost - noOverhead.modeledLaborCost, 8000 / 1012 * 69);
});

test("margin is based on revenue, not cost markup", () => {
  const q = calculate(withChanges(i => {
    i.protection.variableProcessingRate = 0;
    i.protection.roundingIncrement = 1;
  }));
  near(q.unroundedQuote, q.modeledCostAllocation / (1 - 0.1));
  assert.notEqual(q.unroundedQuote, q.modeledCostAllocation * 1.1);
  assert.ok(q.plannedSurplus / q.roundedQuote >= 0.1);
});

test("variable fee is in denominator and fixed whole-quote fee is in numerator only", () => {
  const q = calculate(withChanges(i => {
    i.protection.fixedProcessingFee = 15;
    i.protection.variableProcessingRate = 0.04;
    i.protection.surplusMarginRate = 0.1;
    i.protection.roundingIncrement = 1;
  }));
  near(q.unroundedQuote, (6250 + 15) / 0.86);
  near(q.processingFees, q.roundedQuote * 0.04 + 15);
  near(q.plannedSurplus, q.roundedQuote * 0.96 - 15 - 6250);
});

test("contingency changes budgeted hours and quote, never base hours", () => {
  const noBuffer = calculate(withChanges(i => { i.protection.contingencyRate = 0; }));
  const buffer = calculate(withChanges(i => { i.protection.contingencyRate = 0.4; }));
  assert.equal(noBuffer.baseProjectHours, 60);
  assert.equal(buffer.baseProjectHours, 60);
  near(noBuffer.contingencyBudgetHours, 60);
  near(buffer.contingencyBudgetHours, 84);
  assert.ok(buffer.unroundedQuote > noBuffer.unroundedQuote);
  assert.ok(buffer.roundedQuote > noBuffer.roundedQuote);
});

test("increasing margin increases raw quote at identical project cost", () => {
  const low = calculate(withChanges(i => { i.protection.surplusMarginRate = 0; }));
  const high = calculate(withChanges(i => { i.protection.surplusMarginRate = 0.4; }));
  near(low.modeledCostAllocation, high.modeledCostAllocation);
  assert.ok(high.unroundedQuote > low.unroundedQuote);
});

test("rounding is upward to chosen increment with whole-value and decimal boundaries", () => {
  // The following yields an exact unrounded quote of $200.
  const exact = calculate(withChanges(i => {
    i.baseline.annualCompensation = 1000;
    i.baseline.annualOverhead = 0;
    i.baseline.workingWeeks = 10;
    i.baseline.billableHoursPerWeek = 10;
    for (const phase of PROJECT_PHASE_KEYS) i.project.phaseHours[phase] = 0;
    i.project.phaseHours.development = 20;
    i.project.directExpenses = 0;
    i.protection.contingencyRate = 0;
    i.protection.surplusMarginRate = 0;
    i.protection.variableProcessingRate = 0;
    i.protection.roundingIncrement = 25;
  }));
  assert.equal(exact.unroundedQuote, 200);
  assert.equal(exact.roundedQuote, 200);
  const over = calculate(withChanges(i => {
    i.baseline.annualCompensation = 1000;
    i.baseline.annualOverhead = 0;
    i.baseline.workingWeeks = 10;
    i.baseline.billableHoursPerWeek = 10;
    for (const phase of PROJECT_PHASE_KEYS) i.project.phaseHours[phase] = 0;
    i.project.phaseHours.development = 20;
    i.project.directExpenses = 0.01;
    i.protection.contingencyRate = 0;
    i.protection.surplusMarginRate = 0;
    i.protection.variableProcessingRate = 0;
    i.protection.roundingIncrement = 25;
  }));
  near(over.unroundedQuote, 200.01);
  assert.equal(over.roundedQuote, 225);
  for (const inc of [1, 25, 50, 100]) {
    const r = calculate(withChanges(i => { i.protection.roundingIncrement = inc; }));
    assert.equal(r.roundedQuote % inc, 0);
    assert.ok(r.roundedQuote >= r.unroundedQuote);
    assert.ok(r.roundedQuote < r.unroundedQuote + inc);
  }
});

test("no intermediate rounding of hourly rate or labor allocation", () => {
  const q = calculate();
  const premature = Number((88000 / 1012).toFixed(2)) * 69 + 250;
  assert.notEqual(q.modeledCostAllocation, premature);
  near(q.modeledCostAllocation, 6250);
  near(q.unroundedQuote, q.modeledCostAllocation / 0.87);
});

test("input is not mutated and phase object insertion order does not change totals", () => {
  const input = createExamplePricingInput();
  const copy = structuredClone(input);
  const sortedReverse = withChanges(i => {
    i.project.phaseHours = Object.fromEntries(Object.entries(i.project.phaseHours).reverse());
  });
  const q1 = calculate(input);
  const q2 = calculate(sortedReverse);
  assert.deepEqual(input, copy);
  assert.deepEqual(q1, q2);
});

test("the core quote does not react to scenario overrun until step 04", () => {
  const baseline = calculate();
  const modified = calculate(withChanges(i => { i.overrunRate = 1; }));
  assert.deepEqual(modified, baseline);
});