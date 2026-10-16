import assert from "node:assert/strict";
import test from "node:test";
import {
  createPricingInteractionTracker,
  PRICING_CALCULATOR_EVENTS,
  pricingCalculatorEventParams,
} from "./interaction-events.ts";

function harness(consentInitially = true) {
  let consent = consentInitially;
  const events = [];
  const tracker = createPricingInteractionTracker((event, placement) => {
    if (!consent) return false;
    events.push({ event, placement });
    return true;
  });
  return { tracker, events, grant: () => (consent = true), deny: () => (consent = false) };
}

test("authoritative event set contains no financial fields or ecommerce events", () => {
  assert.deepEqual(PRICING_CALCULATOR_EVENTS, [
    "pricing_calc_start", "pricing_calc_complete", "pricing_calc_overrun",
    "pricing_calc_copy", "pricing_calc_print",
  ]);
});

test("loading an example or applying either reset emits no events", () => {
  const { tracker, events } = harness();
  tracker.evaluated(true);
  tracker.inputsReset();
  tracker.evaluated(true);
  tracker.inputsReset();
  assert.deepEqual(events, []);
});

test("first financial edit produces start then complete only after validation", () => {
  const { tracker, events } = harness();
  tracker.financialInputEdited();
  tracker.evaluated(false);
  tracker.financialInputEdited();
  tracker.evaluated(true);
  tracker.financialInputEdited();
  tracker.evaluated(true);
  assert.deepEqual(events.map(x => x.event), ["pricing_calc_start", "pricing_calc_complete"]);
});

test("scenario-only adjustments fire start and overrun, not complete", () => {
  const { tracker, events } = harness();
  tracker.evaluated(true);
  for (let i = 0; i <= 20; i++) tracker.scenarioAdjusted();
  tracker.evaluated(true);
  assert.deepEqual(events.map(x => x.event), ["pricing_calc_start", "pricing_calc_overrun"]);
});

test("financial edit after scenario-only activity completes once", () => {
  const { tracker, events } = harness();
  tracker.scenarioAdjusted();
  tracker.financialInputEdited();
  tracker.evaluated(true);
  assert.deepEqual(events.map(x => x.event), [
    "pricing_calc_start", "pricing_calc_overrun", "pricing_calc_complete",
  ]);
});

test("reset clears pending completion but preserves sent visit milestones", () => {
  const { tracker, events } = harness();
  tracker.financialInputEdited();
  tracker.evaluated(false);
  tracker.inputsReset();
  tracker.evaluated(true); // resetting to a valid example is not a completion
  assert.deepEqual(events.map(x => x.event), ["pricing_calc_start"]);
  tracker.financialInputEdited();
  tracker.evaluated(true);
  tracker.inputsReset();
  tracker.financialInputEdited();
  tracker.evaluated(true);
  assert.deepEqual(events.map(x => x.event), ["pricing_calc_start", "pricing_calc_complete"]);
});

test("consent denied suppresses events; later genuine interactions may be recorded", () => {
  const { tracker, events, grant } = harness(false);
  tracker.financialInputEdited();
  tracker.evaluated(true);
  tracker.scenarioAdjusted();
  tracker.copySucceeded();
  tracker.printDialogInvoked();
  assert.equal(events.length, 0);
  grant();
  tracker.financialInputEdited();
  tracker.evaluated(true);
  tracker.scenarioAdjusted();
  assert.deepEqual(events.map(x => x.event), [
    "pricing_calc_start", "pricing_calc_complete", "pricing_calc_overrun",
  ]);
});

test("revoking consent immediately suppresses subsequent send attempts", () => {
  const { tracker, events, deny } = harness();
  tracker.financialInputEdited();
  tracker.evaluated(true);
  deny();
  tracker.copySucceeded();
  tracker.printDialogInvoked();
  assert.deepEqual(events.map(x => x.event), ["pricing_calc_start", "pricing_calc_complete"]);
});

test("copy is tracked only when caller confirms success, once per success action", () => {
  const { tracker, events } = harness();
  // Permission rejection does not invoke copySucceeded.
  assert.equal(events.length, 0);
  tracker.copySucceeded();
  tracker.copySucceeded();
  assert.deepEqual(events, [
    { event: "pricing_calc_copy", placement: "copy_summary" },
    { event: "pricing_calc_copy", placement: "copy_summary" },
  ]);
});

test("printing tracks the dialog invocation, not an assumed physical print", () => {
  const { tracker, events } = harness();
  tracker.printDialogInvoked();
  tracker.printDialogInvoked();
  assert.deepEqual(events, [
    { event: "pricing_calc_print", placement: "print_estimate" },
    { event: "pricing_calc_print", placement: "print_estimate" },
  ]);
});

test("every event is a name and optional fixed placement; no input is accepted", () => {
  const { tracker, events } = harness();
  tracker.financialInputEdited();
  tracker.evaluated(true);
  tracker.scenarioAdjusted();
  tracker.copySucceeded();
  tracker.printDialogInvoked();
  for (const entry of events) {
    assert.deepEqual(Object.keys(entry), ["event", "placement"]);
    assert.ok(PRICING_CALCULATOR_EVENTS.includes(entry.event));
    assert.ok(entry.placement === undefined || ["copy_summary", "print_estimate"].includes(entry.placement));
  }
});

test("whitelisted event parameters are fixed; no financial values are present", () => {
  assert.deepEqual(pricingCalculatorEventParams(), {
    tool_id: "freelance_project_pricing_calculator",
    source_page: "/tools/freelance-project-pricing-calculator/",
  });
  assert.deepEqual(pricingCalculatorEventParams("copy_summary"), {
    tool_id: "freelance_project_pricing_calculator",
    source_page: "/tools/freelance-project-pricing-calculator/",
    cta_location: "copy_summary",
  });
  for (const value of Object.values(pricingCalculatorEventParams("print_estimate"))) {
    assert.equal(typeof value, "string");
  }
});