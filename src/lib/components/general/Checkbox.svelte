<script lang="ts">
  export let id = '';
  export let label = '';
  export let checked = false;
</script>

<label class="flex items-start gap-3">
  <input id={id} bind:checked type="checkbox" class="mt-1 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
  <span class="text-sm text-zinc-700">{@html label}</span>
</label>