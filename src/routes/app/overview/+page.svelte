<script lang="ts">
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DashboardIcon from '$lib/icons/DashboardIcon.svelte';
	import type { Crumb } from '$lib/types/ui';

	const segments: Crumb[] = [
		{ label: 'Dashboard', href: '/app/overview', Icon: DashboardIcon },
		{ label: 'Overview' }
	];
</script>

<PageShell>
	<svelte:fragment slot="header">
		<PageHeader {segments} />
	</svelte:fragment>

	<h1 class="text-[24px] font-semibold text-[var(--color-black-600)]">Overview</h1>
</PageShell>
