import assert from "node:assert/strict";
import test from "node:test";
import { createExamplePricingInput, PROJECT_PHASE_KEYS } from "./defaults.ts";
import { calculatePricing } from "./calculate.ts";
import { buildPricingSummary, copyPricingSummary, INTERNAL_PLANNING_LABEL } from "./summary.ts";

function sampleReport() {
  const input = createExamplePricingInput();
  const result = calculatePricing(input);
  assert.equal(result.valid, true);
  return { input, result: result.result, text: buildPricingSummary(input, result.result) };
}

test("copied and printed summary matches the exact authoritative quote and scenario", () => {
  const { text } = sampleReport();
  assert.match(text, /Cost-based fixed-price quote estimate: \$7,200\.00/);
  assert.match(text, /Annual billable capacity: 1,012 hours/);
  assert.match(text, /Internal hourly floor: \$86\.96\/hr/);
  assert.match(text, /Base project hours: 60 hours/);
  assert.match(text, /Contingency-budgeted hours: 69 hours/);
  assert.match(text, /Modeled payment-processing fees: \$216\.00/);
  assert.match(text, /Modeled surplus after cost allocation and fees: \$734\.00/);
  assert.match(text, /Selected overrun: 20%/);
  assert.match(text, /Actual modeled hours \(from base hours\): 72 hours/);
  assert.match(text, /Recovered revenue per actual hour: \$93\.53\/hr/);
  assert.ok(text.includes(INTERNAL_PLANNING_LABEL));
});

test("report includes each phase only once and fixed fee and direct expense assumptions", () => {
  const { text, input } = sampleReport();
  for (const key of PROJECT_PHASE_KEYS) {
    assert.match(text, new RegExp(`: ${input.project.phaseHours[key]} hours`));
  }
  assert.match(text, /Fixed processing fees for whole quote: \$0\.00/);
  assert.match(text, /Direct project expenses: \$250\.00/);
});

test("scenario adjustments change only scenario text, not quoted price", () => {
  const first = sampleReport();
  first.input.overrunRate = 0.5;
  const laterResult = calculatePricing(first.input);
  assert.equal(laterResult.valid, true);
  const later = buildPricingSummary(first.input, laterResult.result);
  assert.match(later, /Cost-based fixed-price quote estimate: \$7,200\.00/);
  assert.match(later, /Actual modeled hours \(from base hours\): 90 hours/);
  assert.notEqual(later, first.text);
});

test("summary uses only typed numeric inputs, not added names or arbitrary notes", () => {
  const { input, result } = sampleReport();
  input.clientName = "SECRET CUSTOMER";
  input.privateNotes = "INTERNAL NOTES";
  input.project.privateNotes = "PROJECT SECRET";
  const report = buildPricingSummary(input, result);
  for (const sensitive of ["SECRET CUSTOMER", "INTERNAL NOTES", "PROJECT SECRET"]) {
    assert.equal(report.includes(sensitive), false);
  }
});

test("missing or rejecting clipboard reports failure without throwing", async () => {
  assert.equal(await copyPricingSummary("test"), false);
  assert.equal(await copyPricingSummary("test", { writeText: async () => { throw new Error("Permission denied"); } }), false);
});

test("permitted clipboard writes exactly the report text", async () => {
  const { text } = sampleReport();
  let written;
  assert.equal(await copyPricingSummary(text, { writeText: async (value) => { written = value; } }), true);
  assert.equal(written, text);
});

test("invalid blank data never yields a printable or copyable calculated result", () => {
  const input = createExamplePricingInput();
  input.baseline.annualCompensation = 0;
  const calculation = calculatePricing(input);
  assert.equal(calculation.valid, false);
  assert.equal("result" in calculation, false);
});