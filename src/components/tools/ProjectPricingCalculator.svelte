<script lang="ts">
  import PricingNumberInput from "./PricingNumberInput.svelte";
  import {
    createExamplePricingInput,
    EXAMPLE_INPUT_LABEL,
    PRICING_FIELD_LIMITS,
    QUOTE_ROUNDING_INCREMENTS,
    PROJECT_PHASE_KEYS,
    PROJECT_PHASE_LABELS,
  } from "@/lib/project-pricing/defaults";
  import { calculatePricingQuote } from "@/lib/project-pricing/calculate";
  import { formatHours, formatPercentage, formatUSD, formatUSDPerHour } from "@/lib/project-pricing/format";
  import { parsePricingNumber, validatePricingInput } from "@/lib/project-pricing/validate";
  import type { BusinessBaseline, PricingErrorField, ProjectPhaseKey, QuoteProtection } from "@/lib/project-pricing/types";

  type BaselineKey = keyof BusinessBaseline;
  type TextBaseline = Record<BaselineKey, string>;
  type TextPhases = Record<ProjectPhaseKey, string>;
  type TextProtection = Record<keyof Omit<QuoteProtection, "roundingIncrement">, string>;

  const BASELINE_FIELDS: ReadonlyArray<{ key: BaselineKey; label: string; hint: string }> = [
    {
      key: "annualCompensation",
      label: "Annual owner compensation goal (USD)",
      hint: "Pre-personal-income-tax compensation to yourself. Include tax and benefits reserves in your target if needed.",
    },
    {
      key: "annualOverhead",
      label: "Annual business overhead (USD)",
      hint: "Recurring business costs such as software, insurance, and equipment, excluding expenses specific to this project.",
    },
    {
      key: "workingWeeks",
      label: "Working weeks per year",
      hint: "Allow for time off, holidays, and other weeks you will not work (1–52).",
    },
    {
      key: "billableHoursPerWeek",
      label: "Billable hours per working week",
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
      label: "Labor contingency (%)",
      hint: "Adds a labor-hours allowance for uncertainty (0–50%). It does not reserve cash.",
    },
    {
      key: "surplusMarginRate",
      label: "Target surplus margin (%)",
      hint: "Share of quoted revenue left after modeled labor, direct costs, and processing fees (0–40%). This is margin, not markup or guaranteed accounting profit.",
    },
    {
      key: "variableProcessingRate",
      label: "Variable payment-processing fee (%)",
      hint: "Your estimated percentage of the quoted revenue (0–15%); the example is not a merchant-specific fee.",
    },
    {
      key: "fixedProcessingFee",
      label: "Fixed processing fees for this quote (USD)",
      hint: "Estimated total fixed processing charges for the entire quote, not per installment.",
    },
  ];

  let baseline = $state<TextBaseline>(sampleTextBaseline());
  let phaseHours = $state<TextPhases>(sampleTextPhases());
  let directExpenses = $state(String(createExamplePricingInput().project.directExpenses));
  let protection = $state<TextProtection>(sampleTextProtection());
  let roundingIncrement = $state(String(createExamplePricingInput().protection.roundingIncrement));
  let exampleUntouched = $state(true);
  let touched = $state<Partial<Record<PricingErrorField, boolean>>>({});

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
    };
  });

  const validation = $derived(validatePricingInput(draft));
  // One authoritative calculation API; it refuses incomplete or invalid models.
  // No pricing formulas are reproduced inside this component.
  const quoteCalculation = $derived(calculatePricingQuote(draft));
  const quote = $derived(quoteCalculation.valid ? quoteCalculation.result : null);
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

  function startBlank(): void {
    baseline = { annualCompensation: "", annualOverhead: "", workingWeeks: "", billableHoursPerWeek: "" };
    phaseHours = Object.fromEntries(PROJECT_PHASE_KEYS.map((key) => [key, ""])) as TextPhases;
    directExpenses = "";
    protection = { contingencyRate: "", surplusMarginRate: "", variableProcessingRate: "", fixedProcessingFee: "" };
    roundingIncrement = "";
    touched = {};
    exampleUntouched = false;
  }

  function markEdited(): void {
    exampleUntouched = false;
  }
</script>

<div class="border border-border bg-background p-5 sm:p-8">
  <div class="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
    <div class="max-w-2xl">
      <p class="text-sm font-semibold text-primary-accent">Development preview — sections A through D (overruns coming later)</p>
      <h3 class="mt-2 text-xl font-semibold text-foreground">Estimate your business and project work</h3>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        {exampleUntouched ? EXAMPLE_INPUT_LABEL : "Your draft entries — review every field before making a pricing decision."}
      </p>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">{exampleUntouched ? "The displayed quote is based on illustrative assumptions, not your business or a market-rate recommendation." : "Your live cost-based estimate updates with valid inputs; it does not predict what a client will pay."}</p>
    </div>
    <button
      type="button"
      onclick={startBlank}
      class="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline"
    >Start blank</button>
  </div>

  <fieldset class="mt-8">
    <legend class="text-xl font-semibold text-foreground">A. Your business baseline</legend>
    <p class="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
      Work backward from the compensation and operating costs your client work needs to support.
      Your compensation goal is before personal income taxes, and billable hours are only the hours you can actually invoice.
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
          <dt class="text-sm text-muted-foreground">Sustainable internal hourly floor</dt>
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
    <legend class="text-xl font-semibold text-foreground">B. The entire project</legend>
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
    <legend class="text-xl font-semibold text-foreground">C. Quote protection</legend>
    <p class="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
      Contingency increases budgeted labor hours. Target surplus margin is a percentage of
      quoted revenue remaining after modeled costs and processing fees, not a markup on cost.
      These are editable sample assumptions, not industry averages or a merchant fee quote.
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
    <h3 id="pricing-results-heading" class="text-xl font-semibold text-foreground">D. Cost-based quote estimate</h3>
    <p class="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
      An internal cost-based starting point, not the correct market price, a guarantee of
      profitability, or a client-facing proposal. Tax reserves are not calculated automatically.
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
            <dt class="text-sm text-muted-foreground">Internal hourly floor</dt>
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
            <dt class="text-sm text-muted-foreground">Total modeled cost allocation</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatUSD(quote.modeledCostAllocation)}</dd>
          </div>
          <div class="border-t border-border pt-4">
            <dt class="text-sm text-muted-foreground">Estimated variable + fixed processing fees</dt>
            <dd class="mt-1 font-semibold text-foreground">{formatUSD(quote.processingFees)}</dd>
          </div>
          <div class="border-t border-border pt-4 sm:col-span-2">
            <dt class="text-sm text-muted-foreground">Modeled surplus after costs and processing</dt>
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
  <p class="mt-8 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
    Overrun scenarios, copy, print, and reset-to-example will be introduced in later steps.
    This page remains a development preview.
  </p>
</div>