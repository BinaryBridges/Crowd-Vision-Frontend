<script lang="ts">
  type Variant = 'primary' | 'secondary' | 'ghost';
  export let as: 'button' | 'a' = 'button';
  export let href: string | undefined;
  export let variant: Variant = 'primary';
  export let className = '';
</script>

<svelte:element
  this={as}
  href={href}
  class={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition
    ${variant === 'primary'   ? 'bg-zinc-900 text-white hover:bg-black' : ''}
    ${variant === 'secondary' ? 'bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50' : ''}
    ${variant === 'ghost'     ? 'bg-transparent text-zinc-700 hover:bg-zinc-100' : ''}
    ${className}`}
>
  <slot />
</svelte:element>