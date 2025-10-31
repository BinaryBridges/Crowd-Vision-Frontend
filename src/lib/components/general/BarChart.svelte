<script lang="ts">
	export let labels: string[] = [];
	export let values: number[] = [];
	export let title: string = '';
	export let colorClass: string = 'bg-[var(--color-purple-500)]';
	export let maxValue: number | undefined = undefined;

	$: computedMax = typeof maxValue === 'number' && maxValue > 0 ? maxValue : Math.max(1, ...values);

	// Height in pixels for the tallest bar
	const BAR_MAX_HEIGHT = 160;
</script>

<div class="flex w-full flex-col gap-3">
	{#if title}
		<h3 class="text-[16px] font-semibold text-[var(--color-black-600)]">{title}</h3>
	{/if}
	<div
		class="w-full rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
	>
		<div
			class="flex items-end gap-3 overflow-x-auto px-2 pb-2"
			style={`height:${BAR_MAX_HEIGHT + 30}px`}
		>
			{#each values as value, i (labels[i] ?? i)}
				{@const h = Math.round((value / computedMax) * BAR_MAX_HEIGHT)}
				<div class="flex w-10 flex-col items-center gap-2">
					<div class="flex h-[160px] w-full items-end">
						<div
							class={`w-full rounded-t-[6px] ${colorClass}`}
							style={`height:${h}px`}
							role="img"
							aria-label={`${labels[i]}: ${value}`}
						></div>
					</div>
					<span
						class="truncate text-center text-[12px] text-[var(--color-black-300)]"
						title={labels[i]}
					>
						{labels[i]}
					</span>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex items-center justify-end pr-2">
		<span class="text-[12px] text-[var(--color-black-300)]">Max: {computedMax}</span>
	</div>
	<slot />
</div>

<style>
	/* Keep component self-contained; visual style relies on design tokens */
</style>
