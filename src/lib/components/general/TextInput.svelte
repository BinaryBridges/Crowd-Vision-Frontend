<script lang="ts">
  export let id = '';
  export let type: string = 'text';
  export let label = '';
  export let placeholder = '';
  export let required = false;
  export let value: string = '';
  export let name: string | undefined = undefined;
</script>

<label class="block">
  {#if label}
    <span class="mb-2 block text-sm font-medium text-zinc-700">{label}</span>
  {/if}
  <input
    id={id}
    {name}
    bind:value
    type={type}
    required={required}
    placeholder={placeholder}
    class="block w-full rounded-xl border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
</label>
