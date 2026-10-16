<script lang="ts">
  import PricingNumberInput from "./PricingNumberInput.svelte";
  import {
    createExamplePricingInput,
    EXAMPLE_INPUT_LABEL,
    PRICING_FIELD_LIMITS,
    PROJECT_PHASE_KEYS,
    PROJECT_PHASE_LABELS,
  } from "@/lib/project-pricing/defaults";
  import { formatHours, formatUSDPerHour } from "@/lib/project-pricing/format";
  import { parsePricingNumber, validatePricingInput } from "@/lib/project-pricing/validate";
  import type { BusinessBaseline, PricingErrorField, ProjectPhaseKey } from "@/lib/project-pricing/types";

  type BaselineKey = keyof BusinessBaseline;
  type TextBaseline = Record<BaselineKey, string>;
  type TextPhases = Record<ProjectPhaseKey, string>;

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

  let baseline = $state<TextBaseline>(sampleTextBaseline());
  let phaseHours = $state<TextPhases>(sampleTextPhases());
  let directExpenses = $state(String(createExamplePricingInput().project.directExpenses));
  let exampleUntouched = $state(true);
  let touched = $state<Partial<Record<PricingErrorField, boolean>>>({});

  // Preserve each editable string exactly while typing. Only the model passed
  // to the validation layer is parsed; invalid entries never become results.
  function asNumber(text: string, field: Parameters<typeof parsePricingNumber>[1]): number | undefined {
    const parsed = parsePricingNumber(text, field);
    return parsed.valid ? parsed.value : parsed.reason === "required" ? undefined : Number.NaN;
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
    };
  });

  const validation = $derived(validatePricingInput(draft));
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
      <p class="text-sm font-semibold text-primary-accent">Development preview — sections A and B</p>
      <h3 class="mt-2 text-xl font-semibold text-foreground">Estimate your business and project work</h3>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        {exampleUntouched ? EXAMPLE_INPUT_LABEL : "Your draft entries — review every field before making a pricing decision."}
      </p>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">{exampleUntouched ? "These are sample assumptions, not a quote or recommendation." : "No final quote is calculated in this preview."}</p>
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

  <p class="mt-8 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
    This development preview only models your baseline and estimated labor. Contingency,
    target surplus, payment fees, and the cost-based fixed-price quote are coming in later steps.
  </p>
</div>