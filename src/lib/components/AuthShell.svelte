<script lang="ts">
  export let title = '';
  export let subtitle = '';
  export let cardClass = '';
</script>

<section class="min-h-dvh grid place-items-center px-4">
  <div class="w-full max-w-md">
    <div class="text-center space-y-1 mb-6">
      <h1 class="text-2xl font-semibold">{title}</h1>
      {#if subtitle}<p class="text-sm text-zinc-500">{subtitle}</p>{/if}
    </div>

    <div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm {cardClass}">
      <slot />
    </div>
  </div>
</section>