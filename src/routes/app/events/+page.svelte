<script lang="ts">
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DashboardIcon from '$lib/icons/DashboardIcon.svelte';
	import type { Crumb } from '$lib/types/ui';
	import Button from '$lib/components/general/Button.svelte';

	const segments: Crumb[] = [
		{ label: 'Dashboard', href: '/app/overview', Icon: DashboardIcon },
		{ label: 'Events' }
	];
</script>

<PageShell>
	<svelte:fragment slot="header">
		<PageHeader {segments} />
	</svelte:fragment>

	<div class="flex w-full items-center justify-between">
		<h1 class="text-[24px] font-semibold text-[var(--color-black-600)]">Events</h1>
		<Button variant="primary" ariaLabel="Add Event">Add Event</Button>
	</div>
	<div
		class="w-full rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)]
           bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
	>
		<p class="text-[14px] text-[var(--color-black-300)]">(Events table will go here)</p>
	</div>
</PageShell>
