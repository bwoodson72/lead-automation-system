<script lang="ts">
  import {
    EXAMPLE_INPUT_LABEL,
    EXAMPLE_PRICING_INPUT,
    PROJECT_PHASE_KEYS,
    PROJECT_PHASE_LABELS,
  } from "@/lib/project-pricing/defaults";

  let showPhaseBreakdown = $state(false);

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const example = EXAMPLE_PRICING_INPUT;
  const phases = PROJECT_PHASE_KEYS.map((key) => ({
    key,
    label: PROJECT_PHASE_LABELS[key],
    hours: example.project.phaseHours[key],
  }));
  const totalHours = phases.reduce((sum, phase) => sum + phase.hours, 0);
</script>

<div class="border border-border bg-background p-6 sm:p-8">
  <p class="text-sm font-semibold text-primary-accent">Development preview — not an active calculator</p>
  <h3 class="mt-3 text-xl font-semibold text-foreground">Illustrative starting assumptions</h3>
  <p class="mt-2 text-sm leading-6 text-muted-foreground">{EXAMPLE_INPUT_LABEL}</p>

  <dl class="mt-6 grid gap-4 sm:grid-cols-2">
    <div class="border border-border bg-card/50 p-4">
      <dt class="text-sm text-muted-foreground">Annual compensation goal</dt>
      <dd class="mt-1 text-xl font-semibold text-foreground">{money.format(example.baseline.annualCompensation)}</dd>
    </div>
    <div class="border border-border bg-card/50 p-4">
      <dt class="text-sm text-muted-foreground">Annual business overhead</dt>
      <dd class="mt-1 text-xl font-semibold text-foreground">{money.format(example.baseline.annualOverhead)}</dd>
    </div>
    <div class="border border-border bg-card/50 p-4">
      <dt class="text-sm text-muted-foreground">Working weeks per year</dt>
      <dd class="mt-1 text-xl font-semibold text-foreground">{example.baseline.workingWeeks}</dd>
    </div>
    <div class="border border-border bg-card/50 p-4">
      <dt class="text-sm text-muted-foreground">Billable hours per week</dt>
      <dd class="mt-1 text-xl font-semibold text-foreground">{example.baseline.billableHoursPerWeek}</dd>
    </div>
  </dl>

  <div class="mt-6 border-t border-border pt-5">
    <p class="text-sm text-muted-foreground">Illustrative project labor: <strong class="text-foreground">{totalHours} hours</strong></p>
    <button
      type="button"
      aria-expanded={showPhaseBreakdown}
      aria-controls="example-project-phases"
      onclick={() => (showPhaseBreakdown = !showPhaseBreakdown)}
      class="mt-3 inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline"
    >
      {showPhaseBreakdown ? "Hide example work phases" : "Show example work phases"}
    </button>

    {#if showPhaseBreakdown}
      <dl id="example-project-phases" class="mt-4 divide-y divide-border border border-border px-4">
        {#each phases as phase (phase.key)}
          <div class="flex items-center justify-between gap-4 py-3 text-sm">
            <dt class="text-muted-foreground">{phase.label}</dt>
            <dd class="shrink-0 font-medium text-foreground">{phase.hours} hr</dd>
          </div>
        {/each}
      </dl>
    {/if}
  </div>
  <p class="mt-6 text-sm leading-6 text-muted-foreground">
    The values above are sample inputs only. They do not represent a quote for your project.
    Input editing, validation, and live quote results will be added in later steps.
  </p>
</div>