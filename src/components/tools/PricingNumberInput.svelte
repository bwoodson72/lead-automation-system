<script lang="ts">
  interface Props {
    id: string;
    label: string;
    value: string;
    description?: string;
    error?: string;
    onFieldBlur: () => void;
    onFieldInput: () => void;
  }

  let {
    id,
    label,
    value = $bindable(),
    description,
    error,
    onFieldBlur,
    onFieldInput,
  }: Props = $props();
</script>

<div class="space-y-2">
  <label for={id} class="block text-sm font-medium text-foreground">{label}</label>
  <input
    {id}
    type="text"
    inputmode="decimal"
    autocomplete="off"
    spellcheck="false"
    bind:value
    oninput={onFieldInput}
    onblur={onFieldBlur}
    aria-invalid={Boolean(error)}
    aria-describedby={[description ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
    class="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-outline focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-error"
  />
  {#if description}
    <p id={`${id}-hint`} class="text-sm leading-5 text-muted-foreground">{description}</p>
  {/if}
  {#if error}
    <p id={`${id}-error`} class="text-sm leading-5 text-error">{error}</p>
  {/if}
</div>