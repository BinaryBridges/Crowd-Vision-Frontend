<script lang="ts">
  export let title = '';
  export let description = '';
</script>

<section class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
  {#if title}
    <h1 class="text-center text-xl font-semibold">{title}</h1>
  {/if}
  {#if description}
    <p class="mt-2 text-center text-sm text-zinc-600">{description}</p>
  {/if}

  <div class="mt-6">
    <slot />
  </div>
</section>
