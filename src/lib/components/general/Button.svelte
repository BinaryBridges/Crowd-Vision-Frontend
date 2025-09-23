<script lang="ts">
  export let variant: 'primary' | 'outline' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let full = false;
  export let loading = false;
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  // Optional aria label for icon-only cases
  export let ariaLabel: string | undefined;

  $: isDisabled = disabled || loading;

  const byVariant: Record<typeof variant, string> = {
    primary:
      'bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500',
    outline:
      'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 disabled:opacity-60',
    ghost:
      'bg-transparent text-zinc-900 hover:bg-zinc-100 disabled:opacity-60'
  };

  const bySize: Record<typeof size, string> = {
    sm: 'h-9 px-3 text-sm gap-2 rounded-lg',
    md: 'h-11 px-4 text-sm gap-3 rounded-xl',
    lg: 'h-12 px-5 text-base gap-3.5 rounded-xl'
  };
</script>
<button
  type={type}
  class={`inline-flex items-center justify-center ${bySize[size]} ${byVariant[variant]} ${full ? 'w-full' : ''} `}
  aria-label={ariaLabel}
  disabled={isDisabled}
>
  <slot name="icon" />
  <span class="whitespace-nowrap">{#if loading}…{/if}<slot /></span>
  <slot name="right" />
</button>
