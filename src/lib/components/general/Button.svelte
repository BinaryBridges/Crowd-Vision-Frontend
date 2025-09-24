<script lang="ts">
	type Variant = 'primary' | 'outline';

	export let variant: Variant = 'primary';
	export let full = false;
	export let loading = false;
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let ariaLabel: string | undefined;

	$: isDisabled = disabled || loading;

	const base =
		'inline-flex items-center justify-center gap-[6px] rounded-[var(--radius-10)] ' +
		'border border-[var(--color-black-100)] ' +
		'py-3 pr-4 pl-[14px] font-semibold text-[14px] cursor-pointer self-stretch ' +
		'transition-[background-color,border-color,color] duration-150 ' +
		'focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ' +
		'disabled:opacity-[0.65] disabled:cursor-not-allowed';

	const variants: Record<Variant, string> = {
		primary:
			'bg-[var(--color-black-600)] text-[var(--color-white)] ' +
			'enabled:hover:bg-[var(--color-black-400)]',

		outline:
			'bg-[var(--color-white)] text-[var(--color-black-600)] ' +
			'enabled:hover:border-[var(--color-black-700)]'
	};
</script>

<button
	{type}
	class={`${base} ${variants[variant]} ${full ? 'w-full' : ''}`}
	aria-label={ariaLabel}
	aria-busy={loading}
	disabled={isDisabled}
>
	<slot name="icon" />
	<span class="whitespace-nowrap"
		>{#if loading}…{/if}<slot /></span
	>
</button>
