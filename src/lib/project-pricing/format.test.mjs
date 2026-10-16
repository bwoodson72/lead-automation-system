import test from "node:test";
import assert from "node:assert/strict";
import { formatUSD, formatUSDPerHour, formatHours, formatPercentage } from "./format.ts";
import { calculatePricing } from "./calculate.ts";
import { createExamplePricingInput } from "./defaults.ts";

test("money and hourly recovery display USD cents and grouping", () => {
  assert.equal(formatUSD(7200), "$7,200.00");
  assert.equal(formatUSD(0), "$0.00");
  assert.equal(formatUSD(93.527777777), "$93.53");
  assert.equal(formatUSDPerHour(93.527777777), "$93.53/hr");
  assert.equal(formatUSDPerHour(88000 / 1012), "$86.96/hr");
});

test("hours display quarter-hours, grouping and singular/plural", () => {
  assert.equal(formatHours(72), "72 hours");
  assert.equal(formatHours(0.25), "0.25 hours");
  assert.equal(formatHours(1), "1 hour");
  assert.equal(formatHours(1.5), "1.5 hours");
  assert.equal(formatHours(1012), "1,012 hours");
});

test("percentage formatting expects fractional rates and preserves 0.1%", () => {
  assert.equal(formatPercentage(0.15), "15%");
  assert.equal(formatPercentage(0.001), "0.1%");
  assert.equal(formatPercentage(1), "100%");
  assert.equal(formatPercentage(0), "0%");
});

test("formatting is pure: result fields retain unrounded values", () => {
  const r = calculatePricing(createExamplePricingInput());
  assert.equal(r.valid, true);
  const before = structuredClone(r.result);
  assert.equal(formatUSDPerHour(r.result.recoveredPerActualHour), "$93.53/hr");
  assert.equal(formatUSDPerHour(r.result.internalHourlyFloor), "$86.96/hr");
  assert.equal(formatHours(r.result.actualScenarioHours), "72 hours");
  assert.deepEqual(r.result, before);
  assert.notEqual(r.result.recoveredPerActualHour, 93.53);
});