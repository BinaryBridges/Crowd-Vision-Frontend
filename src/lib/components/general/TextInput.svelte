<script lang="ts">
	type InputType = 'text' | 'email' | 'password' | 'number' | 'search';

	export let id = '';
	export let type: InputType = 'text';
	export let label: string | undefined = undefined;
	export let placeholder = '';
	export let value: string = '';
	export let name: string | undefined = undefined;
	export let required = false;
	export let disabled = false;
	export let full = false;
	export let ariaLabel: string | undefined = undefined;
	export let error: string | undefined = undefined;
	export let leading = false;
	export let trailing = false;
	export let labelLinkText: string | undefined = undefined;
	export let labelLinkHref: string = '#';

	const fieldStack = 'flex flex-col';
	const labelBase = 'text-[14px] font-medium text-[var(--color-black-400)] mb-[6px]';
	const labelContainer = 'flex items-baseline justify-between';

	const shellBase =
		'flex items-center justify-between gap-[4px] self-stretch ' +
		'rounded-[var(--radius-10)] py-3 pr-[14px] pl-[14px] ' +
		'bg-[var(--color-white)] border border-[var(--color-black-50)]';

	const focusClass = 'focus-within-ring';

	$: shellVariant = error
		? 'bg-[var(--color-red-50)] border-[var(--color-red-500)]'
		: disabled
			? 'bg-[var(--color-grey-50)] border-[var(--color-grey-50)]'
			: '';

	const inputBase =
		'flex-1 min-w-0 bg-transparent outline-none border-0 ' +
		'text-[14px] leading-[20px] font-normal placeholder-[var(--color-black-300)] ' +
		'disabled:cursor-not-allowed';

	$: textState =
		value && value.trim().length > 0
			? 'text-[var(--color-black-600)] font-medium'
			: 'text-[var(--color-black-400)]';

	const iconBox = 'shrink-0 flex items-center justify-center size-5';
	const errorBase = 'mt-[4px] text-[12px] font-normal text-[var(--color-red-500)]';

	const labelLinkBase =
		'font-bold underline decoration-solid text-[14px] leading-5 text-[var(--color-purple-500)] hover:text-[var(--color-purple-700)] focus-ring rounded-[4px] decoration-auto decoration-skip-ink-auto';
</script>

<div class={`${fieldStack} ${full ? 'w-full' : ''}`}>
	{#if label}
		<div class={labelContainer}>
			<label for={id} class={labelBase}>{label}</label>
			{#if labelLinkText}
				<a href={labelLinkHref} class={labelLinkBase}>
					{labelLinkText}
				</a>
			{/if}
		</div>
	{/if}

	<div
		class={`${shellBase} ${!disabled && !error ? focusClass : ''} ${shellVariant}`}
		aria-label={ariaLabel}
	>
		{#if leading}
			<div class={iconBox}><slot name="leading" /></div>
		{/if}

		<input
			{id}
			{name}
			bind:value
			{type}
			{placeholder}
			{required}
			{disabled}
			aria-invalid={!!error}
			aria-describedby={error ? `${id}-error` : undefined}
			class={`${inputBase} ${textState}`}
		/>

		{#if trailing}
			<div class={iconBox}><slot name="trailing" /></div>
		{/if}
	</div>

	{#if error}
		<p id={`${id}-error`} class={errorBase}>{error}</p>
	{/if}
</div>
