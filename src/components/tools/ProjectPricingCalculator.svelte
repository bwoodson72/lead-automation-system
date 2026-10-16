<script lang="ts">
  import PricingNumberInput from "./PricingNumberInput.svelte";
  import { trackPricingCalculatorEvent } from "@/lib/analytics";
  import { createPricingInteractionTracker } from "@/lib/project-pricing/interaction-events";
  import {
    createExamplePricingInput,
    EXAMPLE_INPUT_LABEL,
    PRICING_FIELD_LIMITS,
    QUOTE_ROUNDING_INCREMENTS,
    PROJECT_PHASE_KEYS,
    PROJECT_PHASE_LABELS,
  } from "@/lib/project-pricing/defaults";
  import { calculatePricing, calculatePricingQuote, HOURLY_FLOOR_COMPARISON_LABELS } from "@/lib/project-pricing/calculate";
  import { formatHours, formatPercentage, formatUSD, formatUSDPerHour } from "@/lib/project-pricing/format";
  import { parsePricingNumber, validatePricingInput } from "@/lib/project-pricing/validate";
  import { buildPricingSummary, copyPricingSummary, INTERNAL_PLANNING_LABEL } from "@/lib/project-pricing/summary";
  import type { BusinessBaseline, PricingErrorField, ProjectPhaseKey, QuoteProtection } from "@/lib/project-pricing/types";

  type BaselineKey = keyof BusinessBaseline;
  type TextBaseline = Record<BaselineKey, string>;
  type TextPhases = Record<ProjectPhaseKey, string>;
  type TextProtection = Record<keyof Omit<QuoteProtection, "roundingIncrement">, string>;

  const BASELINE_FIELDS: ReadonlyArray<{ key: BaselineKey; label: string; hint: string }> = [
    {
      key: "annualCompensation",
      label: "What you want to pay yourself each year (USD)",
      hint: "Pre-personal-income-tax compensation to yourself. Include tax and benefits reserves in your target if needed.",
    },
    {
      key: "annualOverhead",
      label: "Yearly business running costs (USD)",
      hint: "Recurring business costs such as software, insurance, and equipment, excluding expenses specific to this project.",
    },
    {
      key: "workingWeeks",
      label: "Working weeks per year",
      hint: "Allow for time off, holidays, and other weeks you will not work (1–52).",
    },
    {
      key: "billableHoursPerWeek",
      label: "Hours you can charge clients each week",
      hint: "Only hours you can actually charge to clients, not all hours spent working (up to 80).",
    },
  ];

  function sampleTextBaseline(): TextBaseline {
    const source = createExamplePricingInput().baseline;
    return {
      annualCompensation: String(source.annualCompensation),
      annualOverhead: String(source.annualOverhead),
      workingWeeks: String(source.workingWeeks),
      billableHoursPerWeek: String(source.billableHoursPerWeek),
    };
  }

  function sampleTextPhases(): TextPhases {
    const source = createExamplePricingInput().project.phaseHours;
    return Object.fromEntries(PROJECT_PHASE_KEYS.map((key) => [key, String(source[key])])) as TextPhases;
  }

  // Protection percentage inputs are displayed as whole percentage points:
  // "15" in the UI corresponds to 0.15 in the domain contract.
  function sampleTextProtection(): TextProtection {
    const sample = createExamplePricingInput().protection;
    return {
      contingencyRate: String(sample.contingencyRate * 100),
      surplusMarginRate: String(sample.surplusMarginRate * 100),
      variableProcessingRate: String(sample.variableProcessingRate * 100),
      fixedProcessingFee: String(sample.fixedProcessingFee),
    };
  }

  const PROTECTION_FIELDS: ReadonlyArray<{
    key: keyof TextProtection;
    label: string;
    hint: string;
  }> = [
    {
      key: "contingencyRate",
      label: "Extra time for uncertainty (%)",
      hint: "Adds a buffer to your estimated project hours. For example, 15% turns 60 hours into a 69-hour budget. This is not extra cash.",
    },
    {
      key: "surplusMarginRate",
      label: "Target surplus (% of the final quote)",
      hint: "The share of the final quote you want left after estimated labor, job expenses, and processing fees (0–40%). Not a markup or guaranteed profit.",
    },
    {
      key: "variableProcessingRate",
      label: "Payment-processing fee (% of quote)",
      hint: "Your estimated percentage of the quoted revenue (0–15%); the example is not a merchant-specific fee.",
    },
    {
      key: "fixedProcessingFee",
      label: "Fixed payment fees for this quote (USD)",
      hint: "Estimated total fixed processing charges for the entire quote, not per installment.",
    },
  ];

  let baseline = $state<TextBaseline>(sampleTextBaseline());
  let phaseHours = $state<TextPhases>(sampleTextPhases());
  let directExpenses = $state(String(createExamplePricingInput().project.directExpenses));
  let protection = $state<TextProtection>(sampleTextProtection());
  let roundingIncrement = $state(String(createExamplePricingInput().protection.roundingIncrement));
  let exampleUntouched = $state(true);
  let overrunPercent = $state(20);
  let scenarioUntouched = $state(true);
  let touched = $state<Partial<Record<PricingErrorField, boolean>>>({});
  let copyFeedback = $state("");
  let printFeedback = $state("");
  let manualCopyVisible = $state(false);

  // Component/visit-local state; never store numeric inputs or event flags in storage.
  const pricingAnalytics = createPricingInteractionTracker(trackPricingCalculatorEvent);
  let financialEditSequence = $state(0);

  // Preserve each editable string exactly while typing. Only the model passed
  // to the validation layer is parsed; invalid entries never become results.
  function asNumber(text: string, field: Parameters<typeof parsePricingNumber>[1]): number | undefined {
    const parsed = parsePricingNumber(text, field);
    return parsed.valid ? parsed.value : parsed.reason === "required" ? undefined : Number.NaN;
  }

  function displayedPercent(text: string, field: "contingencyRate" | "surplusMarginRate" | "variableProcessingRate"): number | undefined {
    // The pure parser interprets explicitly suffixed percentages, and it
    // rejects malformed strings; preserve the entered text until blur.
    const normalized = text.trim();
    if (!normalized) return undefined;
    return asNumber(normalized.endsWith("%") ? normalized : `${normalized}%`, field);
  }

  const draft = $derived.by(() => {
    const initial = createExamplePricingInput();
    return {
      ...initial,
      baseline: {
        annualCompensation: asNumber(baseline.annualCompensation, "annualCompensation"),
        annualOverhead: asNumber(baseline.annualOverhead, "annualOverhead"),
        workingWeeks: asNumber(baseline.workingWeeks, "workingWeeks"),
        billableHoursPerWeek: asNumber(baseline.billableHoursPerWeek, "billableHoursPerWeek"),
      },
      project: {
        phaseHours: Object.fromEntries(
          PROJECT_PHASE_KEYS.map((key) => [key, asNumber(phaseHours[key], "phaseHours")]),
        ),
        directExpenses: asNumber(directExpenses, "directExpenses"),
      },
      protection: {
        contingencyRate: displayedPercent(protection.contingencyRate, "contingencyRate"),
        surplusMarginRate: displayedPercent(protection.surplusMarginRate, "surplusMarginRate"),
        variableProcessingRate: displayedPercent(protection.variableProcessingRate, "variableProcessingRate"),
        fixedProcessingFee: asNumber(protection.fixedProcessingFee, "fixedProcessingFee"),
        roundingIncrement: asNumber(roundingIncrement, "roundingIncrement"),
      },
      // Percent on the slider is normalized to the fraction required by the domain model.
      overrunRate: overrunPercent / 100,
    };
  });

  const validation = $derived(validatePricingInput(draft));
  // One authoritative calculation API; it refuses incomplete or invalid models.
  // No pricing formulas are reproduced inside this component.
  const quoteCalculation = $derived(calculatePricingQuote(draft));
  const quote = $derived(quoteCalculation.valid ? quoteCalculation.result : null);

  // React only after Svelte has applied the user's input binding and model validation.
  // Scenario edits alone do not increment this sequence or trigger a completion.
  $effect(() => {
    if (financialEditSequence > 0) {
      pricingAnalytics.evaluated(validation.valid && quoteCalculation.valid);
    }
  });
  // The existing scenario engine preserves the quote while changing actual hours.
  const scenarioCalculation = $derived(calculatePricing(draft));
  const scenario = $derived(scenarioCalculation.valid ? scenarioCalculation.result : null);
  const summaryText = $derived(
    scenario && validation.valid ? buildPricingSummary(validation.value, scenario) : "",
  );
  const baselineValid = $derived(BASELINE_FIELDS.every(({ key }) => !validation.errors[key]));
  const hourlyBaseline = $derived.by(() => {
    if (!baselineValid) return null;
    const { annualCompensation, annualOverhead, workingWeeks, billableHoursPerWeek } = draft.baseline;
    if ([annualCompensation, annualOverhead, workingWeeks, billableHoursPerWeek].some((value) => value === undefined)) {
      return null;
    }
    const annualBillableHours = workingWeeks! * billableHoursPerWeek!;
    if (annualBillableHours <= 0 || !Number.isFinite(annualBillableHours)) return null;
    return {
      annualBillableHours,
      internalHourlyFloor: (annualCompensation! + annualOverhead!) / annualBillableHours,
    };
  });

  const projectHoursValid = $derived(PROJECT_PHASE_KEYS.every((key) => !validation.errors[`phaseHours.${key}`]) && !validation.errors["phaseHours.total"]);
  const baseHours = $derived.by(() => {
    if (!projectHoursValid) return null;
    return PROJECT_PHASE_KEYS.reduce((total, key) => total + (draft.project.phaseHours[key] ?? 0), 0);
  });

  function markTouched(field: PricingErrorField): void {
    touched[field] = true;
  }

  function fieldError(field: PricingErrorField): string | undefined {
    return touched[field] ? validation.errors[field] : undefined;
  }

  function clearActionFeedback(): void {
    copyFeedback = "";
    printFeedback = "";
    manualCopyVisible = false;
  }

  function startBlank(): void {
    pricingAnalytics.inputsReset();
    baseline = { annualCompensation: "", annualOverhead: "", workingWeeks: "", billableHoursPerWeek: "" };
    phaseHours = Object.fromEntries(PROJECT_PHASE_KEYS.map((key) => [key, ""])) as TextPhases;
    directExpenses = "";
    protection = { contingencyRate: "", surplusMarginRate: "", variableProcessingRate: "", fixedProcessingFee: "" };
    roundingIncrement = "";
    overrunPercent = 20;
    scenarioUntouched = true;
    touched = {};
    exampleUntouched = false;
    clearActionFeedback();
  }

  function resetToExample(): void {
    pricingAnalytics.inputsReset();
    baseline = sampleTextBaseline();
    phaseHours = sampleTextPhases();
    directExpenses = String(createExamplePricingInput().project.directExpenses);
    protection = sampleTextProtection();
    roundingIncrement = String(createExamplePricingInput().protection.roundingIncrement);
    overrunPercent = createExamplePricingInput().overrunRate * 100;
    scenarioUntouched = true;
    touched = {};
    exampleUntouched = true;
    // Do not change any visit-level first-completion analytics state here.
    clearActionFeedback();
  }

  async function handleCopy(): Promise<void> {
    if (!summaryText || !validation.valid || !scenario) return;
    printFeedback = "";
    const copied = await copyPricingSummary(
      summaryText,
      typeof navigator !== "undefined" ? navigator.clipboard : undefined,
    );
    manualCopyVisible = !copied;
    if (copied) pricingAnalytics.copySucceeded();
    copyFeedback = copied
      ? "Internal planning summary copied to clipboard."
      : "Clipboard access was unavailable or denied. Select and copy the text in the box below.";
  }

  function handlePrint(): void {
    if (!summaryText || !validation.valid || !scenario) return;
    copyFeedback = "";
    manualCopyVisible = false;
    if (typeof window === "undefined" || typeof window.print !== "function") {
      printFeedback = "Printing isn't supported in this browser.";
      return;
    }
    try {
      window.print();
      pricingAnalytics.printDialogInvoked();
      printFeedback = "Use your browser's print dialog to print or save this internal planning estimate.";
    } catch {
      printFeedback = "The print dialog could not be opened. Try your browser's Print command.";
    }
  }

  function markEdited(): void {
    pricingAnalytics.financialInputEdited();
    financialEditSequence += 1;
    exampleUntouched = false;
    clearActionFeedback();
  }

  function markScenarioEdited(): void {
    scenarioUntouched = false;
    exampleUntouched = false;
    pricingAnalytics.scenarioAdjusted();
    clearActionFeedback();
  }
</script>

<div class="print:hidden border border-border bg-background p-5 sm:p-8">
  <div class="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
    <div class="max-w-2xl">
      <p class="text-sm font-semibold text-primary-accent">Free tool — quote and overrun estimates</p>
      <h3 class="mt-2 text-xl font-semibold text-foreground">Estimate your business and project work</h3>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        {exampleUntouched ? EXAMPLE_INPUT_LABEL : "Your draft entries — review every field before making a pricing decision."}
      </p>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">{exampleUntouched ? "The displayed quote is based on illustrative assumptions, not your business or a market-rate recommendation." : "Your live cost-based estimate updates with valid inputs; it does not predict what a client will pay."}</p>
    </div>
    <div class="flex flex-wrap gap-3">
      <button
        type="button"
        onclick={startBlank}
        class="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline"
      >Start blank</button>
      <button
        type="button"
        onclick={resetToExample}
        class="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline"
      >Reset to example</button>
    </div>
  </div>

  <fieldset class="mt-8">
    <legend class="text-xl font-semibold text-foreground">A. What your business needs to earn</legend>
    <p class="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
      Enter your annual pay goal and running costs. The calculator divides that total by
      the client hours you can realistically bill—not every hour you work—to find how much
      revenue each billable hour needs to bring in. This is an internal target, not a rate to advertise.
    </p>
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      {#each BASELINE_FIELDS as field (field.key)}
        <PricingNumberInput
          id={`pricing-${field.key}`}
          label={field.label}
          description={field.hint}
          bind:value={baseline[field.key]}
          error={fieldError(field.key)}
          onFieldInput={markEdited}
          onFieldBlur={() => markTouched(field.key)}
        />
      {/each}
    </div>
    {#if hourlyBaseline}
      <dl class="mt-6 grid gap-4 rounded-md border border-border bg-card/50 p-5 sm:grid-cols-2">
        <div>
          <dt class="text-sm text-muted-foreground">Annual billable capacity</dt>
          <dd class="mt-1 text-xl font-semibold text-foreground">{formatHours(hourlyBaseline.annualBillableHours)}</dd>
        </div>
        <div>
          <dt class="text-sm text-muted-foreground">Revenue needed per billable hour (internal floor)</dt>
          <dd class="mt-1 text-xl font-semibold text-foreground">{formatUSDPerHour(hourlyBaseline.internalHourlyFloor)}</dd>
        </div>
      </dl>
    {:else}
      <p class="mt-6 border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        Enter valid business figures to see your annual billable capacity and internal hourly floor.
      </p>
    {/if}
  </fieldset>

  <fieldset class="mt-10 border-t border-border pt-8">
    <legend class="text-xl font-semibold text-foreground">B. Estimate the entire project</legend>
    <p class="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
      Include planning, client communication, QA, revisions, and handoff—not just coding.
      Enter 0 for phases the project does not need. Hours use quarter-hour (0.25) increments.
    </p>
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      {#each PROJECT_PHASE_KEYS as key (key)}
        <PricingNumberInput
          id={`pricing-phase-${key}`}
          label={`${PROJECT_PHASE_LABELS[key]} (hours)`}
          description={`0–${PRICING_FIELD_LIMITS.phaseHours.max} hours; use 0 if not needed.`}
          bind:value={phaseHours[key]}
          error={fieldError(`phaseHours.${key}`)}
          onFieldInput={markEdited}
          onFieldBlur={() => markTouched(`phaseHours.${key}`)}
        />
      {/each}
    </div>
    <div class="mt-6 border border-border bg-card/50 p-5">
      <p class="text-sm text-muted-foreground">Total base project hours</p>
      {#if baseHours !== null}
        <p class="mt-1 text-xl font-semibold text-foreground">{formatHours(baseHours)}</p>
      {:else}
        <p class="mt-1 text-sm text-muted-foreground">Complete valid phase hours to calculate the total.</p>
      {/if}
      {#if validation.errors["phaseHours.total"] && PROJECT_PHASE_KEYS.every((key) => touched[`phaseHours.${key}`])}
        <p class="mt-2 text-sm text-error">{validation.errors["phaseHours.total"]}</p>
      {/if}
    </div>
    <div class="mt-6 max-w-xl">
      <PricingNumberInput
        id="pricing-directExpenses"
        label="Direct project expenses (USD)"
        description="Costs specific to this job, such as subcontractors or project-only licenses. Do not include annual overhead again."
        bind:value={directExpenses}
        error={fieldError("directExpenses")}
        onFieldInput={markEdited}
        onFieldBlur={() => markTouched("directExpenses")}
      />
    </div>
  </fieldset>

  <fieldset class="mt-10 border-t border-border pt-8">
    <legend class="text-xl font-semibold text-foreground">C. Allow for risk, fees, and extra margin</legend>
    <p class="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
      A contingency gives you extra hours for predictable uncertainty. Target surplus is
      the share of your final quote left after estimated labor, project costs, and processing fees;
      it is not simply a percentage added to your cost. The default values are examples, not industry standards.
    </p>
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      {#each PROTECTION_FIELDS as field (field.key)}
        <PricingNumberInput
          id={`pricing-${field.key}`}
          label={field.label}
          description={field.hint}
          bind:value={protection[field.key]}
          error={fieldError(field.key)}
          onFieldInput={markEdited}
          onFieldBlur={() => markTouched(field.key)}
        />
      {/each}
      <div class="space-y-2">
        <label for="pricing-roundingIncrement" class="block text-sm font-medium text-foreground">
          Round the quote up to
        </label>
        <select
          id="pricing-roundingIncrement"
          bind:value={roundingIncrement}
          oninput={markEdited}
          onblur={() => markTouched("roundingIncrement")}
          aria-invalid={Boolean(fieldError("roundingIncrement"))}
          aria-describedby={["pricing-roundingIncrement-hint", fieldError("roundingIncrement") ? "pricing-roundingIncrement-error" : ""].filter(Boolean).join(" ")}
          class="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-error"
        >
          <option value="">Choose a rounding increment</option>
          {#each QUOTE_ROUNDING_INCREMENTS as amount (amount)}
            <option value={String(amount)}>{formatUSD(amount)}</option>
          {/each}
        </select>
        <p id="pricing-roundingIncrement-hint" class="text-sm leading-5 text-muted-foreground">
          Always rounds upward; it never lowers the estimated quote.
        </p>
        {#if fieldError("roundingIncrement")}
          <p id="pricing-roundingIncrement-error" class="text-sm leading-5 text-error">{fieldError("roundingIncrement")}</p>
        {/if}
      </div>
    </div>
  </fieldset>

  <section class="mt-10 border-t border-border pt-8" aria-labelledby="pricing-results-heading">
    <h3 id="pricing-results-heading" class="text-xl font-semibold text-foreground">D. Your cost-based starting quote</h3>
    <p class="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
      This is what the job needs to bring in under your assumptions, including your income
      and overhead target. It is not necessarily what a client will pay—or the most you could charge.
      Taxes are not calculated automatically.
    </p>
    {#if quote}
      <div class="mt-6 border border-border bg-card p-5 sm:p-8">
        <p class="text-sm font-semibold text-primary-accent">
          {exampleUntouched ? "Illustrative example — not your quote" : "Estimate based on your entered assumptions"}
        </p>
        <p class="mt-3 text-sm text-muted-foreground">Estimated cost-based fixed-price quote</p>
        <p class="mt-1 break-words text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">{formatUSD(quote.roundedQuote)}</p>
        <p class="mt-3 text-sm text-muted-foreground">
          Rounded up from {formatUSD(quote.unroundedQuote)} using your selected increment.
        </p>
        <dl class="mt-8 grid gap-4 sm:grid-cols-2">
          <div class="border-t border-border pt-4">
            <dt class="text-sm text-muted-foreground">Annual billable capacity</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatHours(quote.annualBillableHours)}</dd>
          </div>
          <div class="border-t border-border pt-4">
            <dt class="text-sm text-muted-foreground">Revenue needed per billable hour</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatUSDPerHour(quote.internalHourlyFloor)}</dd>
          </div>
          <div class="border-t border-border pt-4">
            <dt class="text-sm text-muted-foreground">Base project hours</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatHours(quote.baseProjectHours)}</dd>
          </div>
          <div class="border-t border-border pt-4">
            <dt class="text-sm text-muted-foreground">Hours budgeted with contingency</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatHours(quote.contingencyBudgetHours)}</dd>
          </div>
          <div class="border-t border-border pt-4">
            <dt class="text-sm text-muted-foreground">Internal labor allocation</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatUSD(quote.modeledLaborCost)}</dd>
          </div>
          <div class="border-t border-border pt-4">
            <dt class="text-sm text-muted-foreground">Direct project expenses</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatUSD(quote.directProjectExpenses)}</dd>
          </div>
          <div class="border-t border-border pt-4">
            <dt class="text-sm text-muted-foreground">Estimated cost of the project</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatUSD(quote.modeledCostAllocation)}</dd>
          </div>
          <div class="border-t border-border pt-4">
            <dt class="text-sm text-muted-foreground">Estimated variable + fixed processing fees</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatUSD(quote.processingFees)}</dd>
          </div>
          <div class="border-t border-border pt-4 sm:col-span-2">
            <dt class="text-sm text-muted-foreground">Amount left after modeled costs and fees</dt>
            <dd class="mt-1 text-xl font-semibold text-foreground">{formatUSD(quote.plannedSurplus)}</dd>
          </div>
        </dl>
        <details class="mt-8 border-t border-border pt-5">
          <summary class="cursor-pointer rounded-sm py-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline">
            See calculation
          </summary>
          <div class="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Annual billable hours = working weeks × billable hours per week.</p>
            <p>Internal hourly floor = (annual compensation goal + annual overhead) ÷ annual billable hours.</p>
            <p>Budgeted labor hours = base project hours × (1 + contingency rate).</p>
            <p>Modeled cost allocation = internal hourly floor × budgeted labor hours + direct project expenses.</p>
            <p>Unrounded quote = (modeled cost allocation + whole-quote fixed processing fees) ÷ (1 − variable processing rate − target surplus margin).</p>
            <p class="break-words font-mono text-xs leading-6 text-foreground">quote = ceil((((floor × baseHours × (1 + contingency)) + directExpenses + fixedFees) / (1 − variableFee − margin)) / roundingIncrement) × roundingIncrement</p>
            <p>Final quote = unrounded quote rounded <strong class="text-foreground">up</strong> to the selected {formatUSD(draft.protection.roundingIncrement ?? 0)} increment.</p>
            <p>Modeled processing fees = final quote × {formatPercentage(draft.protection.variableProcessingRate ?? 0)} + fixed processing fees.</p>
            <p>Modeled surplus = final quote − processing fees − modeled cost allocation. The margin is a share of revenue, not markup on the underlying costs.</p>
          </div>
        </details>

        <section class="mt-8 border-t border-border pt-8" aria-labelledby="pricing-overrun-heading">
          <h4 id="pricing-overrun-heading" class="text-lg font-semibold text-foreground">
            What if the project takes longer than planned?
          </h4>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">
            You've estimated {formatHours(quote.baseProjectHours)} for a {formatUSD(quote.roundedQuote)} fixed-price job.
            What happens if it takes longer? Move the slider to add hours to your original estimate.
            Your quote stays {formatUSD(quote.roundedQuote)}, even as you spend more time on the work.
          </p>
          <div class="mt-6 rounded-md border border-border bg-background p-4 sm:p-5">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <label for="pricing-overrun" class="text-sm font-semibold text-foreground">
                Additional project hours
              </label>
              <output for="pricing-overrun" class="text-xl font-semibold tabular-nums text-foreground">{overrunPercent}%</output>
            </div>
            <input
              id="pricing-overrun"
              type="range"
              min="0"
              max="100"
              step="5"
              bind:value={overrunPercent}
              oninput={markScenarioEdited}
              aria-describedby="pricing-overrun-help"
              aria-valuetext={`${overrunPercent}% additional project hours`}
              class="mt-4 block h-11 w-full cursor-pointer accent-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline"
            />
            <div class="mt-1 flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>0%</span><span>100%</span>
            </div>
            <p id="pricing-overrun-help" class="mt-3 text-sm leading-6 text-muted-foreground">
              {scenarioUntouched
                ? "Illustrative 20% overrun — move the slider to try a different scenario."
                : "Selected scenario. Use arrow keys while focused on the slider to change by 5 percentage points."}
            </p>
          </div>

          {#if scenario}
            <p class="mt-5 border-l-2 border-primary bg-card/50 p-4 text-sm leading-6 text-foreground" aria-live="polite" aria-atomic="true">
              At {overrunPercent}% extra time, you'll work {formatHours(scenario.actualScenarioHours)} instead of
              {formatHours(quote.baseProjectHours)}. The quote remains {formatUSD(quote.roundedQuote)},
              and you recover {formatUSDPerHour(scenario.recoveredPerActualHour)} per actual hour
              after payment fees and direct expenses.
            </p>
            <dl class="mt-6 grid gap-4 sm:grid-cols-2">
              <div class="border-t border-border pt-4">
                <dt class="text-sm leading-6 text-muted-foreground">Actual hours with overrun</dt>
                <dd class="mt-1 text-lg font-semibold tabular-nums text-foreground">{formatHours(scenario.actualScenarioHours)}
                  <p class="mt-1 text-xs font-normal text-muted-foreground">Based on {formatHours(scenario.baseProjectHours)} originally estimated.</p>
                </dd>
              </div>
              <div class="border-t border-border pt-4">
                <dt class="text-sm leading-6 text-muted-foreground">Amount recovered for each hour actually worked</dt>
                <dd class="mt-1 text-lg font-semibold tabular-nums text-foreground">{formatUSDPerHour(scenario.recoveredPerActualHour)}
                  <p class="mt-1 text-xs font-normal leading-5 text-muted-foreground">After direct job expenses and payment-processing fees.</p>
                </dd>
              </div>
              <div class="border-t border-border pt-4">
                <dt class="text-sm leading-6 text-muted-foreground">Amount above your hourly target after extra work</dt>
                <dd class="mt-1 text-lg font-semibold tabular-nums text-foreground">{formatUSD(scenario.scenarioSurplus)}
                  <p class="mt-1 text-xs font-normal leading-5 text-muted-foreground">After accounting for the internal hourly floor over actual hours.</p>
                </dd>
              </div>
              <div class="border-t border-border pt-4">
                <dt class="text-sm leading-6 text-muted-foreground">Most hours before falling below your target</dt>
                <dd class="mt-1 text-lg font-semibold tabular-nums text-foreground">{formatHours(scenario.maxHoursAtFloor)}
                  <p class="mt-1 text-xs font-normal leading-5 text-muted-foreground">Approximate threshold before hourly recovery drops below your target.</p>
                </dd>
              </div>
            </dl>
            <div class="mt-6 rounded-md border border-border bg-background p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Compared with your internal hourly floor</p>
              <p class="mt-2 text-lg font-semibold text-foreground">
                {scenario.hourlyFloorComparison === "above"
                  ? "Above target"
                  : scenario.hourlyFloorComparison === "at"
                    ? "At target"
                    : "Below target"}
              </p>
              <p class="mt-1 text-sm leading-6 text-muted-foreground">
                {HOURLY_FLOOR_COMPARISON_LABELS[scenario.hourlyFloorComparison]}:
                {formatUSDPerHour(scenario.recoveredPerActualHour)} recovered against a
                {formatUSDPerHour(scenario.internalHourlyFloor)} internal target.
              </p>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                Falling below your compensation-and-overhead target does not necessarily mean an accounting loss.
                This is an internal recovery comparison, not a forecast of profit.
              </p>
            </div>
          {/if}
          <p class="mt-5 text-sm leading-6 text-muted-foreground">
            Before you commit, revisit discovery, QA, client communication, revisions, and unknown
            requirements. When scope cannot be estimated responsibly, paid discovery may be safer
            than promising one fixed price for work you have not defined.
          </p>
        </section>
        <section class="mt-8 border-t border-border pt-6" aria-labelledby="pricing-next-step">
          <h4 id="pricing-next-step" class="text-lg font-semibold text-foreground">What comes after the estimate?</h4>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">
            This free calculator shows what a project needs to earn under your assumptions.
            The Web Developer Pricing System covers the wider decisions: defining scope,
            investigating uncertainty, choosing the right pricing model, setting payment
            terms, and protecting the price you agree on.
          </p>
          <a
            href="/products/web-developer-pricing-system/"
            data-ga-event="product_click"
            data-ga-product-id="web-developer-pricing-system"
            data-ga-source-type="calculator"
            data-ga-cta-location="result_next_step"
            class="mt-4 inline-flex min-h-11 items-center rounded-sm py-2 text-sm font-semibold text-primary-accent underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline"
          >Explore the Web Developer Pricing System →</a>
        </section>
      </div>
    {:else}
      <div class="mt-6 border border-border bg-card p-5 sm:p-8">
        <p class="font-semibold text-foreground">A quote is not available yet.</p>
        <p class="mt-2 text-sm leading-6 text-muted-foreground">
          Complete valid entries across business baseline, project hours, direct expenses, and
          quote protection to see your cost-based estimate. Invalid inputs never produce a quote.
        </p>
        {#if !quoteCalculation.valid && Object.keys(quoteCalculation.errors).some((key) => !validation.errors[key as PricingErrorField])}
          <p class="mt-3 text-sm text-error">The current figures could not produce a finite quote. Review your inputs.</p>
        {/if}
      </div>
    {/if}
  </section>
  <section class="mt-8 border-t border-border pt-6" aria-labelledby="pricing-actions-heading">
    <h3 id="pricing-actions-heading" class="text-lg font-semibold text-foreground">Keep your internal estimate</h3>
    <p class="mt-2 text-sm leading-6 text-muted-foreground">
      Copy a plain-text summary or use your browser's print dialog. These actions are available
      only when every required input is valid. They do not save or send your figures anywhere.
    </p>
    <div class="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        onclick={handleCopy}
        disabled={!summaryText}
        class="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline disabled:cursor-not-allowed disabled:opacity-50"
      >Copy summary</button>
      <button
        type="button"
        onclick={handlePrint}
        disabled={!summaryText}
        class="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline disabled:cursor-not-allowed disabled:opacity-50"
      >Print estimate</button>
    </div>
    <p class="mt-3 text-sm leading-6 text-muted-foreground">{INTERNAL_PLANNING_LABEL}</p>
    <div role="status" aria-live="polite" aria-atomic="true" class="mt-3 text-sm leading-6 text-foreground">
      {copyFeedback || printFeedback}
    </div>
    {#if manualCopyVisible && summaryText}
      <div class="mt-4">
        <label for="pricing-manual-summary" class="block text-sm font-semibold text-foreground">Select and copy this summary</label>
        <textarea
          id="pricing-manual-summary"
          readonly
          value={summaryText}
          rows="9"
          class="mt-2 w-full rounded-md border border-input bg-background p-3 font-mono text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline"
        ></textarea>
      </div>
    {/if}
  </section>
  <p class="mt-8 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
    Estimates are for internal planning, not client proposals. Review assumptions and project scope before sending a price.
  </p>
</div>

{#if summaryText}
  <article class="hidden bg-white p-0 text-black print:block" aria-labelledby="pricing-print-heading">
    <h2 id="pricing-print-heading" class="sr-only">Internal pricing estimate report</h2>
    <pre class="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-black">{summaryText}</pre>
  </article>
{/if}