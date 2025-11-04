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
		placeholder = 'Select'
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
	let menuPos = $state<{ top: number; left: number; width: number } | null>(null);

	function computeMenuPosition() {
		if (!buttonRef) return;
		const rect = buttonRef.getBoundingClientRect();
		menuPos = {
			top: rect.top + rect.height + 4, // 4px gap
			left: rect.left,
			width: rect.width
		};
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const withinButton = buttonRef && buttonRef.contains(target);
		const withinMenu = target.closest?.('[data-dd-menu="true"]');
		if (!withinButton && !withinMenu) {
			isOpen = false;
		}
	}

	let selectedLabel = $derived(options.find((opt: Option) => opt.value === value)?.label ?? '');
	let isEmpty = $derived(!selectedLabel || selectedLabel.length === 0);

	const errorBase = 'mt-[4px] text-[12px] font-normal text-[var(--color-red-500)]';
</script>

<svelte:window
	onclick={handleClickOutside}
	on:resize={() => isOpen && computeMenuPosition()}
	on:scroll={() => isOpen && computeMenuPosition()}
/>

<div
	class="{stacked ? 'flex flex-col' : 'flex shrink-0 items-center gap-2 whitespace-nowrap'} {full
		? 'w-full'
		: ''}"
>
	{#if label}
		<label
			for={id}
			class={stacked
				? 'mb-[6px] text-[14px] leading-none font-medium text-[var(--color-black-400)]'
				: 'flex h-[34px] items-center text-[14px] leading-none font-medium text-[var(--color-black-400)]'}
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
				: 'min-w-[64px]'} h-[34px] cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 text-[14px] transition-colors focus:ring-2 focus:ring-[var(--color-black-100)] focus:ring-offset-1 focus:outline-none {error
				? 'border-[var(--color-red-500)] bg-[var(--color-red-50)] text-[var(--color-black-600)]'
				: 'border-[var(--color-black-50)] bg-[var(--color-white)] text-[var(--color-black-600)] hover:border-[var(--color-black-100)]'}"
			aria-describedby={error ? `${id}-error` : undefined}
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			onclick={(e) => {
				e.stopPropagation();
				if (!isOpen) {
					computeMenuPosition();
					isOpen = true;
				} else {
					isOpen = false;
				}
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

		{#if isOpen && menuPos}
			<div
				data-dd-menu="true"
				role="listbox"
				aria-labelledby={label ? id : undefined}
				class="fixed z-[99999] flex flex-col overflow-hidden rounded-lg border border-[var(--color-black-50)] bg-[var(--color-white)] shadow-[0_4px_20px_0_rgba(77,84,100,0.15)]"
				style={`top:${menuPos.top}px;left:${menuPos.left}px;width:${menuPos.width}px;`}
			>
				{#each options as option (option.value)}
					<button
						type="button"
						class="block w-full cursor-pointer px-3 py-2 text-left text-[14px] font-medium text-[var(--color-black-600)] transition-colors hover:bg-[var(--color-grey-25)] {option.value ===
						value
							? 'bg-[var(--color-grey-25)]'
							: ''}"
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

		{#if stacked}
			<div class="min-h-[18px]">
				{#if error}
					<p id={`${id}-error`} class={errorBase}>{error}</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
