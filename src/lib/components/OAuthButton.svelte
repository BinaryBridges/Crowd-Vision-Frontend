<script lang="ts">
  export let provider: 'google' | 'facebook' = 'google';
  export let label = '';
</script>

<button
  type="button"
  class="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium hover:bg-zinc-50"
>
  {#if provider === 'google'}
    <!-- Google G -->
    <svg viewBox="0 0 24 24" class="size-5" aria-hidden="true">
      <path d="M21.35 11.1H12v2.9h5.3c-.23 1.46-1.6 4.2-5.3 4.2-3.2 0-5.8-2.64-5.8-5.9s2.6-5.9 5.8-5.9c1.83 0 3.07.77 3.78 1.43l2.58-2.5C17.2 3.1 15.03 2 12 2 6.98 2 2.9 6.08 2.9 11.2S6.98 20.4 12 20.4c6.04 0 9.1-4.24 9.1-8.2 0-.55-.06-1.1-.15-1.6z" fill="currentColor"/>
    </svg>
  {:else}
    <!-- Facebook f -->
    <svg viewBox="0 0 24 24" class="size-5" aria-hidden="true">
      <path d="M13.5 20.5v-7h2.3l.35-2.7h-2.65V8.6c0-.78.22-1.31 1.35-1.31h1.44V4.86A19.63 19.63 0 0 0 14.3 4c-2.06 0-3.47 1.26-3.47 3.57v2h-2.33v2.7h2.33v7h2.67z" fill="currentColor"/>
    </svg>
  {/if}
  <span>{label}</span>
</button>