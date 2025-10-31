<script lang="ts">
	import type { Component } from 'svelte';
	export let label: string;
	export let selected = false;
	export let Icon: Component | null = null;
	export let onClick: () => void = () => {};
	export let href: string | undefined = undefined;
	export let avatarSrc: string | null = null;
	export let avatarAlt: string = '';
</script>

{#if href}
	<a
		{href}
		data-sveltekit-preload-data
		class="group focus-ring flex w-full cursor-pointer items-center
           gap-2 rounded-[var(--radius-10)] border px-2.5 py-2.5 text-left no-underline transition"
		class:border-transparent={!selected}
		class:border-[var(--border-gradient-gray-vertical)]={selected}
		class:bg-[var(--color-white)]={selected}
		class:shadow-[0_15px_30px_0_rgba(77,84,100,0.05)]={selected}
		class:hover:bg-[var(--color-grey-50)]={!selected}
		class:hover:border-[var(--border-gradient-gray-vertical)]={!selected}
	>
		{#if avatarSrc}
			<img src={avatarSrc} alt={avatarAlt} class="h-7 w-7 rounded-full object-cover" />
		{:else if Icon}
			<svelte:component
				this={Icon}
				className="w-5 h-5"
				colorClass={selected ? 'text-[var(--color-black-600)]' : 'text-[var(--color-black-300)]'}
			/>
		{/if}
		<span
			class="truncate text-[14px]"
			class:text-[var(--color-black-600)]={selected}
			class:font-semibold={selected}
			class:text-[var(--color-black-400)]={!selected}
			class:font-medium={!selected}
		>
			{label}
		</span>
	</a>
{:else}
	<button
		type="button"
		on:click={onClick}
		class="group focus-ring flex w-full cursor-pointer items-center
           gap-2 rounded-[var(--radius-10)] border px-2.5 py-2.5 text-left transition"
		class:border-transparent={!selected}
		class:border-[var(--border-gradient-gray-vertical)]={selected}
		class:bg-[var(--color-white)]={selected}
		class:shadow-[0_15px_30px_0_rgba(77,84,100,0.05)]={selected}
		class:enabled:hover:bg-[var(--color-grey-50)]={!selected}
		class:enabled:hover:border-[var(--border-gradient-gray-vertical)]={!selected}
	>
		{#if avatarSrc}
			<img src={avatarSrc} alt={avatarAlt} class="h-7 w-7 rounded-full object-cover" />
		{:else if Icon}
			<svelte:component
				this={Icon}
				className="w-5 h-5"
				colorClass={selected ? 'text-[var(--color-black-600)]' : 'text-[var(--color-black-300)]'}
			/>
		{/if}
		<span
			class="truncate text-[14px]"
			class:text-[var(--color-black-600)]={selected}
			class:font-semibold={selected}
			class:text-[var(--color-black-400)]={!selected}
			class:font-medium={!selected}
		>
			{label}
		</span>
	</button>
{/if}
