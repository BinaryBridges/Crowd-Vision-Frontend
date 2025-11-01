<script lang="ts">
	export let labels: string[] = [];
	export let values: number[] = [];
	export let title: string = '';
	export let colorClass: string = 'bg-[var(--color-purple-500)]';
	export let maxValue: number | undefined = undefined;

	$: computedMax = typeof maxValue === 'number' && maxValue > 0 ? maxValue : Math.max(1, ...values);

	// Height in pixels for the tallest bar
	const BAR_MAX_HEIGHT = 160;

	// Number of Y axis ticks (including 0 and max)
	export let tickCount: number = 5;

	// Compute a "nice" rounded max and ticks so labels look clean
	function niceCeil(value: number, ticks: number) {
		if (value <= 0) return 1;
		const roughStep = value / (ticks - 1);
		// find a magnitude (1, 2, 5) * 10^n that's >= roughStep
		const pow = Math.pow(10, Math.floor(Math.log10(roughStep)));
		const candidates = [1, 2, 5, 10];
		for (const c of candidates) {
			const step = c * pow;
			if (step >= roughStep) return step * (ticks - 1);
		}
		// fallback
		return Math.ceil(value);
	}

	$: displayMax = niceCeil(computedMax, Math.max(2, tickCount));
	$: tickStep = Math.max(1, Math.round(displayMax / Math.max(1, tickCount - 1)));
	$: ticks = Array.from({ length: tickCount }, (_, i) => i * tickStep);
</script>

<div class="flex w-full flex-col gap-3">
	{#if title}
		<h3 class="text-[16px] font-semibold text-[var(--color-black-600)]">{title}</h3>
	{/if}
	<div
		class="w-full rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
	>
		<div class="flex gap-3 px-2 pb-2">
			<!-- Y axis (left) with labels positioned to match gridlines -->
			<div
				class="relative w-14 text-[12px] text-[var(--color-black-300)]"
				style={`height:${BAR_MAX_HEIGHT + 30}px`}
			>
				{#each ticks as tick (tick)}
					{@const top = Math.round((1 - tick / displayMax) * BAR_MAX_HEIGHT)}
					<div
						class="absolute text-right"
						style={`top:${top}px; right:6px; transform:translateY(-50%);`}
					>
						{tick}
					</div>
				{/each}
			</div>

			<!-- Bars area -->
			<div class="flex-1 overflow-x-auto">
				<div class="relative" style={`height:${BAR_MAX_HEIGHT + 30}px`}>
					<!-- gridlines aligned to ticks -->
					{#each ticks as tick (tick)}
						{@const top = Math.round((1 - tick / displayMax) * BAR_MAX_HEIGHT)}
						<div
							class="absolute right-0 left-0"
							style={`top:${top}px; border-top:1px solid rgba(0,0,0,0.08);`}
						></div>
					{/each}

					<!-- Bars row -->
					<div class="flex items-end gap-3" style={`height:${BAR_MAX_HEIGHT + 30}px`}>
						{#each values as value, i (labels[i] ?? i)}
							{@const h = Math.round((value / displayMax) * BAR_MAX_HEIGHT)}
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
			</div>
		</div>
	</div>
	<slot />
</div>

<style>
	/* Keep component self-contained; visual style relies on design tokens */
</style>
