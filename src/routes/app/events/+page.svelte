<script lang="ts">
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DashboardIcon from '$lib/icons/DashboardIcon.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import Table from '$lib/components/table/Table.svelte';
	import EventNameCell from '$lib/components/table/EventNameCell.svelte';
	import EventStatusCell from '$lib/components/table/EventStatusCell.svelte';
	import EventDateCell from '$lib/components/table/EventDateCell.svelte';
	import AnalysisDateCell from '$lib/components/table/AnalysisDateCell.svelte';
	import FavoriteCell from '$lib/components/table/FavoriteCell.svelte';
	import type { Crumb, TableColumn, TableTab } from '$lib/types/ui';

	const segments: Crumb[] = [
		{ label: 'Dashboard', href: '/app/overview', Icon: DashboardIcon },
		{ label: 'Events' }
	];

	interface Event {
		id: string;
		name: string;
		company: string;
		logo: string;
		color: string;
		representative: string;
		eventDate: number;
		analysisDate: number;
		status: 'In Progress' | 'Finished' | 'Draft' | 'Overdue';
		isFavorite: boolean;
		[key: string]: string | number | boolean;
	}

	let events: Event[] = [
		{
			id: '1',
			name: 'Promotion Partner',
			company: 'Oca Auto',
			logo: '🏎️',
			color: '#FFF4ED',
			representative: 'Amelia Brooks',
			eventDate: 1765497600000,
			analysisDate: 1765497600000,
			status: 'In Progress',
			isFavorite: false
		},
		{
			id: '2',
			name: 'Educations Platform',
			company: 'Okay co',
			logo: '📚',
			color: '#E3F2FD',
			representative: 'Nathan Cole',
			eventDate: 1765324800000,
			analysisDate: 1765497600000,
			status: 'In Progress',
			isFavorite: false
		},
		{
			id: '3',
			name: 'Website Redesign',
			company: '4square',
			logo: '⚙️',
			color: '#FFF3E0',
			representative: 'Priya Kapoor',
			eventDate: 1764892800000,
			analysisDate: 1765497600000,
			status: 'Draft',
			isFavorite: true
		},
		{
			id: '4',
			name: 'Rebranding',
			company: 'Loopline',
			logo: '🔄',
			color: '#F3E5F5',
			representative: 'Elijah Torres',
			eventDate: 1761696000000,
			analysisDate: 1765497600000,
			status: 'Draft',
			isFavorite: false
		},
		{
			id: '5',
			name: 'Internal CMS Tools',
			company: 'Zola',
			logo: '⚡',
			color: '#E8EAF6',
			representative: 'Sofia Mendes',
			eventDate: 1760486400000,
			analysisDate: 1765497600000,
			status: 'Finished',
			isFavorite: false
		},
		{
			id: '6',
			name: 'App Redesign',
			company: 'Slashri',
			logo: '🔺',
			color: '#FFEBEE',
			representative: 'Lucas Grant',
			eventDate: 1759190400000,
			analysisDate: 1765497600000,
			status: 'Overdue',
			isFavorite: false
		},
		{
			id: '7',
			name: 'Media Campaign',
			company: 'ShieldFy',
			logo: '🛡️',
			color: '#E1F5FE',
			representative: 'Aisha Rahman',
			eventDate: 1756684800000,
			analysisDate: 1765497600000,
			status: 'Draft',
			isFavorite: false
		},
		{
			id: '8',
			name: 'Project Alpha',
			company: 'Lightbulb',
			logo: '💡',
			color: '#FFF9C4',
			representative: "Daniel O'Connor",
			eventDate: 1755993600000,
			analysisDate: 1765497600000,
			status: 'Finished',
			isFavorite: false
		},
		{
			id: '9',
			name: 'Template Design',
			company: 'Target',
			logo: '🎯',
			color: '#FCE4EC',
			representative: 'Mei Ling Chen',
			eventDate: 1754092800000,
			analysisDate: 1765497600000,
			status: 'Finished',
			isFavorite: false
		},
		{
			id: '10',
			name: 'Marketing Project',
			company: 'Dossbe',
			logo: '📊',
			color: '#E0F2F1',
			representative: 'Victor Alvarez',
			eventDate: 1750291200000,
			analysisDate: 1765497600000,
			status: 'Finished',
			isFavorite: false
		}
	];

	const tabs: TableTab[] = [
		{ label: 'All', value: 'all' },
		{ label: 'Finished', value: 'finished' },
		{ label: 'In Progress', value: 'in-progress' },
		{ label: 'Overdue', value: 'overdue' }
	];

	let activeTab = 'all';

	const columns: TableColumn<Event>[] = [
		{
			key: 'name',
			label: 'Event Name',
			sortable: true,
			component: EventNameCell,
			width: 'minmax(250px, 1fr)'
		},
		{
			key: 'representative',
			label: 'Representative',
			sortable: true,
			render: (item) =>
				`<span class="text-[14px] text-[var(--color-black-400)]">${item.representative}</span>`,
			width: 'minmax(150px, auto)'
		},
		{
			key: 'eventDate',
			label: 'Event Date',
			sortable: true,
			component: EventDateCell,
			width: 'minmax(130px, auto)'
		},
		{
			key: 'analysisDate',
			label: 'Analysis completion date',
			sortable: true,
			component: AnalysisDateCell,
			width: 'minmax(180px, auto)'
		},
		{
			key: 'status',
			label: 'Status',
			sortable: true,
			component: EventStatusCell,
			width: 'minmax(120px, auto)'
		},
		{
			key: 'favorite',
			label: 'Favourite',
			sortable: false,
			component: FavoriteCell,
			width: '100px'
		}
	];

	$: filteredEvents = filterEventsByTab(events, activeTab);

	function filterEventsByTab(events: Event[], tab: string): Event[] {
		switch (tab) {
			case 'finished':
				return events.filter((e) => e.status === 'Finished');
			case 'in-progress':
				return events.filter((e) => e.status === 'In Progress');
			case 'overdue':
				return events.filter((e) => e.status === 'Overdue');
			default:
				return events;
		}
	}

	function handleRowDelete(event: CustomEvent<Event>) {
		console.log('Delete clicked for:', event.detail);
		// Handle delete logic here
	}
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
		<Table
			data={filteredEvents}
			{columns}
			{tabs}
			bind:activeTab
			showCheckboxes={false}
			showPagination={true}
			on:action={handleRowDelete}
		/>
	</div>
</PageShell>
