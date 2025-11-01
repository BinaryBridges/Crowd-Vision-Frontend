<script lang="ts">
	import ChevronDown from '$lib/icons/ChevronDown.svelte';
	type Option = { label: string; value: string | number };
	let {
		value = $bindable<string | number>(),
		options,
		label = '',
		id = 'dropdown',
		onChange,
		error,
		full = false,
		stacked = false,
		placeholder = 'Select name…'
	} = $props<{
		value?: string | number;
		options: Option[];
		label?: string;
		id?: string;
		onChange?: (v: string | number) => void;
		error?: string;
		full?: boolean;
		stacked?: boolean;
		placeholder?: string;
	}>();

	let isOpen = $state(false);
	let buttonRef: HTMLButtonElement;

	function handleClickOutside(e: MouseEvent) {
		if (buttonRef && !buttonRef.contains(e.target as Node)) isOpen = false;
	}

	let selectedLabel = $derived(options.find((opt: Option) => opt.value === value)?.label ?? '');
	let isEmpty = $derived(!selectedLabel || selectedLabel.length === 0);

	const errorBase = 'mt-[4px] text-[12px] font-normal text-[var(--color-red-500)]';
</script>

<svelte:window onclick={handleClickOutside} />

<div class="{stacked ? 'flex flex-col' : 'flex items-center gap-2'} {full ? 'w-full' : ''}">
	{#if label}
		<label
			for={id}
			class={stacked
				? 'mb-[6px] text-[14px] font-medium text-[var(--color-black-400)]'
				: 'text-[14px] font-normal text-[var(--color-black-400)]'}
		>
			{label}
		</label>
	{/if}

	<div class="relative {full ? 'w-full' : ''}">
		<button
			bind:this={buttonRef}
			{id}
			type="button"
			class="flex {full
				? 'w-full'
				: ''} cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-[10px] text-[14px] transition-colors focus:ring-2 focus:ring-[var(--color-black-100)] focus:ring-offset-1 focus:outline-none
            {error
				? 'border-[var(--color-red-500)] bg-[var(--color-red-50)] text-[var(--color-black-600)]'
				: 'border-[var(--color-black-50)] bg-[var(--color-white)] text-[var(--color-black-600)] hover:border-[var(--color-black-100)]'}"
			aria-describedby={error ? `${id}-error` : undefined}
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			onclick={(e) => {
				e.stopPropagation();
				isOpen = !isOpen;
			}}
		>
			<span
				class={isEmpty
					? 'font-normal text-[var(--color-black-300)]'
					: 'font-medium text-[var(--color-black-600)]'}
			>
				{isEmpty ? placeholder : selectedLabel}
			</span>
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
		<div class="min-h-[18px]">
			{#if error}
				<p id={`${id}-error`} class={errorBase}>{error}</p>
			{/if}
		</div>
	</div>
</div>
