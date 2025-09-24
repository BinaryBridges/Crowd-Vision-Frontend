<script lang="ts">
	import CheckboxOff from '$lib/icons/CheckboxOff.svelte';
	import CheckboxOn from '$lib/icons/CheckboxOn.svelte';

	export let id: string = 'checkbox';
	export let checked = false;
	export let label: string | undefined = undefined;
	export let className = '';

	const labelId = `${id}-label`;
</script>

<div class={`flex items-center gap-2 self-stretch ${className}`}>
	<div class="relative size-5">
		<input
			{id}
			class="peer absolute inset-0 cursor-pointer opacity-0 focus-visible:outline-none"
			type="checkbox"
			bind:checked
			aria-labelledby={labelId}
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					(e.currentTarget as HTMLInputElement).click();
				}
			}}
		/>

		<span
			class="grid size-5 place-items-center rounded-[6px] bg-[var(--color-white)]
            peer-focus-visible:ring-2
            peer-focus-visible:ring-[var(--color-black-100)]
            peer-focus-visible:ring-offset-1
            peer-focus-visible:ring-offset-[var(--color-white)]"
			aria-hidden="true"
		>
			{#if checked}
				<CheckboxOn className="size-5" />
			{:else}
				<CheckboxOff className="size-5" />
			{/if}
		</span>
	</div>

	{#if label || $$slots.default}
		<span id={labelId} class="text-[14px] leading-5 font-medium text-[var(--color-black-300)]">
			<slot>{label}</slot>
		</span>
	{/if}
</div>
