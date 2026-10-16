import test from "node:test";
import assert from "node:assert/strict";
import { createExamplePricingInput } from "./defaults.ts";
import { parsePricingNumber, validatePricingInput } from "./validate.ts";

function inputWith(edit) {
  const sample = createExamplePricingInput();
  edit(sample);
  return sample;
}
function errorFor(input, key) {
  const result = validatePricingInput(input);
  assert.equal(result.valid, false, `Expected an invalid input for ${key}`);
  assert.equal("value" in result, false, "Invalid models must not expose pricing values");
  assert.ok(result.errors[key], `Missing ${key} error: ${JSON.stringify(result.errors)}`);
  return result.errors[key];
}

test("example model passes and returns a distinct normalized value", () => {
  const input = createExamplePricingInput();
  const result = validatePricingInput(input);
  assert.equal(result.valid, true);
  assert.deepEqual(result.value, input);
  assert.notEqual(result.value, input);
  assert.notEqual(result.value.project.phaseHours, input.project.phaseHours);
  assert.deepEqual(result.errors, {});
});

test("required missing owner pay differs from numeric zero", () => {
  assert.match(errorFor(inputWith(i => { i.baseline.annualCompensation = undefined; }), "annualCompensation"), /required/i);
  assert.match(errorFor(inputWith(i => { i.baseline.annualCompensation = 0; }), "annualCompensation"), /greater than 0/i);
  assert.match(errorFor(inputWith(i => { i.baseline.annualCompensation = ""; }), "annualCompensation"), /required/i);
});

test("zero overhead, expenses, fixed fees and unused phase hours are permitted", () => {
  const i = inputWith(i => {
    i.baseline.annualOverhead = 0;
    i.project.directExpenses = 0;
    i.protection.fixedProcessingFee = 0;
    i.project.phaseHours.other = 0;
  });
  assert.equal(validatePricingInput(i).valid, true);
});

test("missing project phases require explicit zero, and all-zero phase totals fail", () => {
  assert.match(errorFor(inputWith(i => { delete i.project.phaseHours.other; }), "phaseHours.other"), /enter 0/i);
  errorFor(inputWith(i => { Object.keys(i.project.phaseHours).forEach(k => { i.project.phaseHours[k] = 0; }); }), "phaseHours.total");
});

test("all required nested groups must be present", () => {
  const result = validatePricingInput({});
  assert.equal(result.valid, false);
  for (const key of ["annualCompensation", "phaseHours.development", "directExpenses", "surplusMarginRate", "roundingIncrement", "overrunRate"]) {
    assert.ok(result.errors[key], key);
  }
});

test("rejects non-finite values and strings in a normalized numeric model", () => {
  for (const v of [NaN, Infinity, -Infinity, "100", null]) {
    errorFor(inputWith(i => { i.baseline.annualOverhead = v; }), "annualOverhead");
  }
  errorFor(inputWith(i => { i.project.phaseHours.development = Infinity; }), "phaseHours.development");
  errorFor(inputWith(i => { i.protection.roundingIncrement = NaN; }), "roundingIncrement");
});

test("negative numbers and upper caps are rejected instead of being clamped", () => {
  for (const [key, amt] of [["annualCompensation", -1], ["annualOverhead", -1], ["annualOverhead", 1_000_000.01], ["annualCompensation", 2_000_000.01], ["billableHoursPerWeek", 81], ["workingWeeks", 53]]) {
    errorFor(inputWith(i => { i.baseline[key] = amt; }), key);
  }
  errorFor(inputWith(i => { i.project.directExpenses = 1_000_000.01; }), "directExpenses");
  errorFor(inputWith(i => { i.project.phaseHours.other = 2_000.25; }), "phaseHours.other");
  errorFor(inputWith(i => { i.protection.fixedProcessingFee = -1; }), "fixedProcessingFee");
});

test("working weeks and billable capacity must be valid", () => {
  for (const weeks of [0, 0.5, 52.5]) errorFor(inputWith(i => { i.baseline.workingWeeks = weeks; }), "workingWeeks");
  for (const hours of [0, -1, 0.1, 80.25]) errorFor(inputWith(i => { i.baseline.billableHoursPerWeek = hours; }), "billableHoursPerWeek");
  assert.equal(validatePricingInput(inputWith(i => { i.baseline.workingWeeks = 52; i.baseline.billableHoursPerWeek = 80; })).valid, true);
});

test("project phases accept quarter-hour increments only", () => {
  for (const v of [0.1, 0.3, 1.125, 0.01]) errorFor(inputWith(i => { i.project.phaseHours.design = v; }), "phaseHours.design");
  for (const v of [0, 0.25, 0.5, 1.75, 1999.75, 2000]) {
    const result = validatePricingInput(inputWith(i => { i.project.phaseHours.design = v; }));
    assert.equal(result.valid, true, `valid phase value ${v}`);
  }
});

test("rate field boundaries, increments, and negative limits", () => {
  for (const [name, accepted, rejected] of [
    ["contingencyRate", [0, 0.01, 0.5], [-0.01, 0.505, 0.51]],
    ["surplusMarginRate", [0, 0.01, 0.4], [-0.01, 0.005, 0.41]],
    ["variableProcessingRate", [0, 0.001, 0.15], [-0.001, 0.0005, 0.151]],
  ]) {
    for (const v of accepted) assert.equal(validatePricingInput(inputWith(i => { i.protection[name] = v; })).valid, true, `${name} ${v}`);
    for (const v of rejected) errorFor(inputWith(i => { i.protection[name] = v; }), name);
  }
});

test("margin + processing fees cannot equal or exceed 100%", () => {
  const bad = inputWith(i => { i.protection.surplusMarginRate = 0.9; i.protection.variableProcessingRate = 0.1; });
  assert.match(errorFor(bad, "surplusMarginRate"), /below 100%/);
});

test("rounding increment must be an exact permitted numeric option", () => {
  for (const v of [1, 25, 50, 100]) assert.equal(validatePricingInput(inputWith(i => { i.protection.roundingIncrement = v; })).valid, true);
  for (const v of [0, 5, 10, 200, "100", undefined]) errorFor(inputWith(i => { i.protection.roundingIncrement = v; }), "roundingIncrement");
});

test("overrun is limited to five-point percentage increments", () => {
  for (const v of [0, 0.05, 0.2, 1]) assert.equal(validatePricingInput(inputWith(i => { i.overrunRate = v; })).valid, true);
  for (const v of [-0.05, 0.01, 0.07, 1.05]) errorFor(inputWith(i => { i.overrunRate = v; }), "overrunRate");
});

test("money parser accepts grouped commas, optional dollar prefix and whitespace", () => {
  for (const raw of ["$80,000", "  80,000  ", "$ 80,000.50", "80000.50"]) {
    const result = parsePricingNumber(raw, "annualCompensation");
    assert.deepEqual(result, { valid: true, value: raw.includes(".50") ? 80000.5 : 80000 });
  }
  assert.deepEqual(parsePricingNumber("$0", "annualOverhead"), { valid: true, value: 0 });
  assert.deepEqual(parsePricingNumber(300, "directExpenses"), { valid: true, value: 300 });
  assert.deepEqual(parsePricingNumber("", "directExpenses"), { valid: false, reason: "required" });
  assert.deepEqual(parsePricingNumber(undefined, "directExpenses"), { valid: false, reason: "required" });
});

test("percent parser converts explicit percent strings to fractional rates", () => {
  for (const [s, v] of [["15%", 0.15], [" 10 % ", 0.1], ["3%", 0.03], ["20%", 0.2], ["0%", 0]]) {
    assert.deepEqual(parsePricingNumber(s, "contingencyRate"), { valid: true, value: v });
  }
  assert.deepEqual(parsePricingNumber("0.15", "contingencyRate"), { valid: true, value: 0.15 });
  assert.deepEqual(parsePricingNumber("15", "contingencyRate"), { valid: true, value: 15 });
  assert.deepEqual(parsePricingNumber("10%", "annualOverhead"), { valid: false, reason: "invalid" });
});

test("malformed or ambiguous pasted strings must fail without arbitrary character stripping", () => {
  for (const raw of ["12,34", "1,00,000", "$80,00", "80k", "USD 80000", "100abc", "1e3", "1_000", "$ $100", "100,", "1 000", "12.3.4", " +2 "]) {
    assert.deepEqual(parsePricingNumber(raw, "annualCompensation"), { valid: false, reason: "invalid" }, raw);
  }
  for (const raw of ["$10", "10%%", "10%junk", "1,0%", "NaN", "Infinity", "1e2%", " "]) {
    assert.equal(parsePricingNumber(raw, "surplusMarginRate").valid, false, raw);
  }
  assert.deepEqual(parsePricingNumber(Infinity, "annualOverhead"), { valid: false, reason: "invalid" });
  assert.deepEqual(parsePricingNumber(NaN, "annualOverhead"), { valid: false, reason: "invalid" });
});