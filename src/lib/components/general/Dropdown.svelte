<script lang="ts">
	import ChevronDown from '$lib/icons/ChevronDown.svelte';
	type Option = { label: string; value: string | number };
	let {
		value = $bindable<string | number>(),
		options,
		label = '',
		id = 'dropdown',
		onChange
	} = $props<{
		value?: string | number;
		options: Option[];
		label?: string;
		id?: string;
		onChange?: (v: string | number) => void;
	}>();

	let isOpen = $state(false);
	let buttonRef: HTMLButtonElement;

	function handleClickOutside(e: MouseEvent) {
		if (buttonRef && !buttonRef.contains(e.target as Node)) isOpen = false;
	}

	let selectedLabel = $derived(options.find((opt: Option) => opt.value === value)?.label ?? '');
</script>

<svelte:window onclick={handleClickOutside} />

<div class="flex items-center gap-2">
	{#if label}
		<label for={id} class="text-[14px] font-normal text-[var(--color-black-400)]">
			{label}
		</label>
	{/if}

	<div class="relative">
		<button
			bind:this={buttonRef}
			{id}
			type="button"
			class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-[var(--color-black-50)] bg-[var(--color-white)] px-3 py-[10px] text-[14px] font-medium text-[var(--color-black-600)] transition-colors hover:border-[var(--color-black-100)] focus:ring-2 focus:ring-[var(--color-black-100)] focus:ring-offset-1 focus:outline-none"
			onclick={(e) => {
				e.stopPropagation();
				isOpen = !isOpen;
			}}
		>
			<span>{selectedLabel}</span>
			<ChevronDown className="w-4 h-4 transition-transform {isOpen ? 'rotate-180' : ''}" />
		</button>

		{#if isOpen}
			<div
				class="absolute top-full left-0 z-50 mt-1 w-full min-w-[80px] overflow-hidden rounded-lg border border-[var(--color-black-50)] bg-[var(--color-white)] shadow-[0_4px_20px_0_rgba(77,84,100,0.15)]"
			>
				{#each options as option (option.value)}
					<button
						type="button"
						class="w-full px-3 py-2 text-left text-[14px] font-medium text-[var(--color-black-600)] transition-colors hover:bg-[var(--color-grey-25)]
							{option.value === value ? 'bg-[var(--color-grey-25)]' : ''}"
						onclick={(e) => {
							e.stopPropagation();
							value = option.value;
							isOpen = false;
							onChange?.(option.value);
						}}
					>
						{option.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
