<script lang="ts">
  export let className = '';
</script>

<div class={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>
  <slot />
</div>