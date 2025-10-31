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
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import { onMount } from 'svelte';
	import { PUBLIC_USER_ID } from '$env/static/public';
	import type { Doc, Id } from '$convex/_generated/dataModel';

	const segments: Crumb[] = [
		{ label: 'Dashboard', href: '/app/overview', Icon: DashboardIcon },
		{ label: 'Events' }
	];

	// Type for what getByUserId returns (event with client info)
	type EventWithClient = Doc<'events'> & {
		clientInfo: Doc<'clients'> | null;
	};

	// Type for transformed UI data
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

	// Get USER_ID from public environment variable
	const USER_ID = PUBLIC_USER_ID;

	// Get Convex client
	const convexClient = useConvexClient();

	// State for events data
	let eventsData: EventWithClient[] = [];
	let isLoading = true;
	let error: string | null = null;

	// Function to load events data
	async function loadEvents() {
		isLoading = true;
		error = null;
		try {
			if (convexClient) {
				console.log('Loading events with client:', !!convexClient);
				const result = await convexClient.query(api.events.getByUserId, {
					userId: USER_ID as Id<'users'>
				});
				eventsData = result || [];
				console.log('Loaded events:', eventsData);
			} else {
				error = 'Convex client not available';
			}
		} catch (err) {
			console.error('Error loading events:', err);
			error = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			isLoading = false;
		}
	}

	// Load events on mount
	onMount(async () => {
		console.log('NEW CODE: onMount running, client available:', !!convexClient);
		await loadEvents();
	});

	// Function to map database status to UI status
	function mapStatus(dbStatus: string): 'In Progress' | 'Finished' | 'Draft' | 'Overdue' {
		switch (dbStatus.toLowerCase()) {
			case 'completed':
			case 'finished':
				return 'Finished';
			case 'in progress':
			case 'in_progress':
			case 'progress':
				return 'In Progress';
			case 'draft':
				return 'Draft';
			case 'overdue':
				return 'Overdue';
			default:
				return 'Draft'; // Default fallback
		}
	}

	// Function to handle logo - return the URL or a default emoji
	function getLogo(logoUrl: string | undefined): string {
		return logoUrl || '📊'; // Return the URL as-is, or default emoji if no logo
	}

	// Transform Convex data to match UI expectations
	$: events =
		isLoading || error || !eventsData
			? []
			: eventsData.map(
					(event: EventWithClient): Event => ({
						id: event._id,
						name: event.name,
						company: event.clientInfo?.company || 'Unknown Company',
						logo: getLogo(event.image), // Use event image instead of client logo
						color: '#E0F2F1', // Default color since it's missing from DB
						representative: event.clientInfo?.representative || 'Unknown Rep',
						eventDate: event.completion_time || Date.now(), // Using completion_time as eventDate
						analysisDate: event.completion_time || Date.now(),
						status: mapStatus(event.status),
						isFavorite: event.favourite || false
					})
				);

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

	async function handleRowDelete(eventToDelete: Event) {
		console.log('DELETE: Starting delete process for event:', eventToDelete);
		console.log('DELETE: Event ID:', eventToDelete.id);
		console.log('DELETE: User ID:', USER_ID);
		console.log('DELETE: Convex client available:', !!convexClient);

		try {
			if (convexClient) {
				console.log('DELETE: Calling deleteEvent mutation...');
				// Call the delete mutation
				const result = await convexClient.mutation(api.events.deleteEvent, {
					eventId: eventToDelete.id as Id<'events'>,
					userId: USER_ID as Id<'users'>
				});

				console.log('DELETE: Mutation result:', result);

				// Reload the events data
				console.log('DELETE: Reloading events...');
				await loadEvents();

				console.log('DELETE: Event deleted successfully');
			} else {
				console.error('DELETE: Convex client not available');
			}
		} catch (err) {
			console.error('DELETE: Error deleting event:', err);
			// You could add a toast notification here
		}
	}

	async function handleToggleFavorite(eventToToggle: Event) {
		console.log('FAVORITE: Starting toggle favorite for event:', eventToToggle);
		console.log('FAVORITE: Event ID:', eventToToggle.id);
		console.log('FAVORITE: Current favorite status:', eventToToggle.isFavorite);
		console.log('FAVORITE: Convex client available:', !!convexClient);

		try {
			if (convexClient) {
				console.log('FAVORITE: Calling toggleFavorite mutation...');
				// Call the toggle favorite mutation
				const newFavoriteStatus = await convexClient.mutation(api.events.toggleFavorite, {
					eventId: eventToToggle.id as Id<'events'>
				});

				console.log('FAVORITE: Mutation result - new favorite status:', newFavoriteStatus);

				// Update local state immediately for better UX
				eventToToggle.isFavorite = newFavoriteStatus;

				// Notify other UI (e.g., sidebar) to refresh favourites
				window.dispatchEvent(new CustomEvent('cv:favorites-changed'));

				console.log('FAVORITE: Favorite toggled successfully');
			} else {
				console.error('FAVORITE: Convex client not available');
			}
		} catch (err) {
			console.error('FAVORITE: Error toggling favorite:', err);
			// Revert the local state change on error
			eventToToggle.isFavorite = !eventToToggle.isFavorite;
		}
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
		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<p class="text-[var(--color-black-400)]">Loading events...</p>
			</div>
		{:else if error}
			<div class="flex items-center justify-center py-8">
				<p class="text-red-500">Error loading events: {error}</p>
			</div>
		{:else}
			<Table
				data={filteredEvents}
				{columns}
				{tabs}
				bind:activeTab
				showCheckboxes={false}
				showPagination={true}
				onDelete={handleRowDelete}
				onToggleFavorite={handleToggleFavorite}
			/>
		{/if}
	</div>
</PageShell>
