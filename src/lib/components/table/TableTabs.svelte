<script lang="ts">
	import type { TableTab } from '$lib/types/ui';

	export let tabs: TableTab[] = [];
	export let activeTab: string = 'all';
	export let onChange: (value: string) => void;

	function handleTabClick(value: string) {
		onChange(value);
	}
</script>

<div
	class="inline-flex items-center gap-1 rounded-[var(--radius-10)] border border-[var(--color-black-50)] bg-[var(--color-grey-25)] p-1"
>
	{#each tabs as tab (tab.value)}
		<button
			class="flex items-center justify-center gap-2 rounded-[6px] px-[10px] py-[6px] text-[14px] leading-none font-medium transition-all
                {activeTab === tab.value
				? 'border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] font-semibold text-[var(--color-black-600)] shadow-[0_4px_30px_0_rgba(77,84,100,0.15)]'
				: 'border-transparent font-medium text-[var(--color-black-300)] hover:text-[var(--color-black-600)]'}"
			on:click={() => handleTabClick(tab.value)}
		>
			{tab.label}
		</button>
	{/each}
</div>
