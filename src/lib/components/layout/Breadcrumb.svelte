<script lang="ts">
	import type { Crumb } from '$lib/types/ui';
	import { resolve } from '$app/paths';
	export let segments: Crumb[] = [];
</script>

<nav aria-label="Breadcrumb" class="flex min-w-0 items-center gap-[16px]">
	{#each segments as seg, i (seg.label)}
		{#if i > 0}
			<span
				class="text-[14px] font-medium text-[var(--color-black-300)] select-none"
				aria-hidden="true">/</span
			>
		{/if}
		{#if seg.href && i < segments.length - 1}
			<a
				href={resolve(seg.href)}
				class="flex items-center gap-2 truncate text-[14px] font-medium text-[var(--color-black-300)] transition-colors hover:text-[var(--color-black-600)]"
				title={seg.label}
			>
				{#if seg.Icon}
					<svelte:component
						this={seg.Icon}
						className="w-5 h-5"
						colorClass="text-[var(--color-black-300)]"
					/>
				{/if} <span class="truncate">{seg.label}</span>
			</a>
		{:else}
			<span
				class="flex items-center gap-2 truncate text-[14px] font-medium text-[var(--color-black-600)]"
				title={seg.label}
			>
				{#if seg.Icon}
					<svelte:component
						this={seg.Icon}
						className="w-5 h-5"
						colorClass="text-[var(--color-black-600)]"
					/>
				{/if} <span class="truncate">{seg.label}</span>
			</span>
		{/if}
	{/each}
</nav>
