<script lang="ts">
	import DashboardIcon from '$lib/icons/DashboardIcon.svelte';
	import ChevronUp from '$lib/icons/ChevronUp.svelte';
	import ChevronDown from '$lib/icons/ChevronDown.svelte';

	export let title = 'Dashboard';
	export let open = true;
	export let onToggle: () => void = () => {};
</script>

<div>
	<button
		type="button"
		on:click={onToggle}
		class="focus-ring flex w-full cursor-pointer items-center
           justify-between rounded-[var(--radius-10)] border border-transparent px-2.5 py-2.5 transition
           enabled:hover:border-[var(--border-gradient-gray-vertical)] enabled:hover:bg-[var(--color-grey-50)]"
	>
		<span class="flex items-center gap-2">
			<DashboardIcon className="w-5 h-5" colorClass="text-[var(--color-black-300)]"></DashboardIcon>
			<span class="text-[14px] font-medium text-[var(--color-black-400)]">
				{title}
			</span>
		</span>

		{#if open}
			<ChevronUp className="w-5 h-5"></ChevronUp>
		{:else}
			<ChevronDown className="w-5 h-5"></ChevronDown>
		{/if}
	</button>

	{#if open}
		<div class="pl-7">
			<slot />
		</div>
	{/if}
</div>
