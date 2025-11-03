<script lang="ts">
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DashboardIcon from '$lib/icons/DashboardIcon.svelte';
	import FavoriteCell from '$lib/components/table/FavoriteCell.svelte';
	import EventStatusCell from '$lib/components/table/EventStatusCell.svelte';
	import BarChart from '$lib/components/general/BarChart.svelte';
	import type { Crumb } from '$lib/types/ui';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { PUBLIC_USER_ID } from '$env/static/public';
	import type { Id } from '$convex/_generated/dataModel';
	import type { Doc } from '$convex/_generated/dataModel';

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
				return 'Draft';
		}
	}

	const convexClient = useConvexClient();

	let event: Doc<'events'> | null = null;
	let client: Doc<'clients'> | null = null;
	let isLoading = true;
	let error: string | null = null;
	let lastLoadedId: string | null = null;

	const ageLabels = [
		'0-10',
		'11-20',
		'21-30',
		'31-40',
		'41-50',
		'51-60',
		'61-70',
		'71-80',
		'81-90',
		'91-100'
	];

	async function loadEventById(id: string) {
		isLoading = true;
		error = null;
		try {
			if (!convexClient) throw new Error('Convex client not available');
			const res = await convexClient.query(api.events.getById, { id: id as Id<'events'> });
			if (!res) {
				error = 'Event not found';
				return;
			}
			event = res;
			client = res.clientInfo || null;
			lastLoadedId = id;
			if (PUBLIC_USER_ID) {
				try {
					await convexClient.mutation(api.events.addToUser, {
						userId: PUBLIC_USER_ID as Id<'users'>,
						eventId: id as Id<'events'>
					});
				} catch (addErr) {
					console.warn('addToUser failed:', addErr);
				}
			}
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : String(err);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		const id = get(page).params.id as string;
		loadEventById(id);
		const unsubscribe = page.subscribe(($p) => {
			const nextId = $p.params.id as string;
			if (nextId && nextId !== lastLoadedId) {
				loadEventById(nextId);
			}
		});
		return unsubscribe;
	});

	// Top-level reactive declarations
	$: statusLabel = event ? mapStatus(String(event.status)) : 'Draft';

	$: ageValues = event?.age_distribution
		? [
				event.age_distribution.a0_10,
				event.age_distribution.a11_20,
				event.age_distribution.a21_30,
				event.age_distribution.a31_40,
				event.age_distribution.a41_50,
				event.age_distribution.a51_60,
				event.age_distribution.a61_70,
				event.age_distribution.a71_80,
				event.age_distribution.a81_90,
				event.age_distribution.a91_100
			]
		: Array(10).fill(0);

	$: totalPeople = event
		? (event.gender?.female || 0) + (event.gender?.male || 0) + (event.gender?.unknown || 0)
		: 0;

	$: genderPct = event
		? {
				female: Math.round(((event.gender?.female || 0) / Math.max(1, totalPeople)) * 100),
				male: Math.round(((event.gender?.male || 0) / Math.max(1, totalPeople)) * 100),
				unknown: Math.round(((event.gender?.unknown || 0) / Math.max(1, totalPeople)) * 100)
			}
		: { female: 0, male: 0, unknown: 0 };

	// Ensure FavoriteCell receives a definite boolean
	$: favItem = { isFavorite: !!event?.favourite };

	async function handleToggleFavoriteDetail() {
		try {
			if (!convexClient || !event) return;
			const newFavoriteStatus = await convexClient.mutation(api.events.toggleFavorite, {
				eventId: event._id as Id<'events'>
			});
			// Update local event state so UI reflects the change
			event = { ...(event as Doc<'events'>), favourite: newFavoriteStatus };
			// Inform other UI parts (sidebar) to refresh starred list
			window.dispatchEvent(new CustomEvent('cv:favorites-changed'));
		} catch (err) {
			console.error('FAVORITE (detail): Error toggling favorite:', err);
		}
	}

	$: segments = [
		{ label: 'Dashboard', href: '/app/overview', Icon: DashboardIcon },
		{ label: 'Events', href: '/app/events' },
		{ label: event?.name ?? 'Event' }
	] as Crumb[];
</script>

<PageShell>
	<svelte:fragment slot="header">
		<PageHeader {segments} />
	</svelte:fragment>
	{#if isLoading}
		<div class="flex items-center justify-center py-12">
			<p class="text-[var(--color-black-400)]">Loading event...</p>
		</div>
	{:else if error}
		<div class="flex items-center justify-center py-12">
			<p class="text-red-500">Error loading event: {error}</p>
		</div>
	{:else}
		<!-- Full-width gradient header -->
		<section
			class="relative min-h-[220px] w-full overflow-hidden rounded-[var(--radius-20)] px-4 pt-6 pb-4 sm:min-h-[260px] md:min-h-[280px] md:px-6 md:pt-8 md:pb-6"
			style="background: linear-gradient(135deg, #E2CFF9 0%, #FCF3DB 100%);"
		>
			<div class="flex flex-col gap-2">
				<div
					class="flex h-18 w-18 items-center justify-center rounded-[12px] bg-[var(--color-white)] shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
				>
					<img src={event?.image} alt="" class="h-15 w-15 shrink-0 object-contain" />
				</div>
				<h1 class="text-[24px] font-semibold text-[var(--color-black-600)]">{event?.name}</h1>
				<div class="flex flex-wrap items-center gap-3">
					<EventStatusCell item={{ status: statusLabel }} />
					<span class="text-[14px] text-[var(--color-black-400)]">
						{#if event?.completion_time}
							{new Date(event.completion_time).toLocaleString()}
						{/if}
					</span>
					<div class="flex items-center gap-2">
						<span class="text-[14px] text-[var(--color-black-600)]">{client?.representative}</span>
					</div>
					<div class="flex items-center gap-2">
						<img src={client?.logo} alt="" class="h-4 w-4 rounded-[4px] object-contain" />
						<span class="text-[14px] text-[var(--color-black-300)]">{client?.name}</span>
					</div>
				</div>
			</div>
			<div class="absolute top-4 right-4">
				<FavoriteCell item={favItem} onToggleFavorite={handleToggleFavoriteDetail} />
			</div>
		</section>

		<!-- Content card overlapping the bottom of the gradient -->
		<div class="relative -mt-14 w-full sm:-mt-16 md:-mt-20 lg:-mt-24">
			<div
				class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)] md:p-6"
			>
				<!-- Project Details (always visible) -->
				<section class="mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
					<div
						class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<h3 class="mb-2 text-[14px] font-semibold text-[var(--color-black-600)]">Details</h3>
						<div class="space-y-2 text-[14px]">
							<div>
								<span class="text-[var(--color-black-300)]">Start</span>
								<div class="text-[var(--color-black-600)]">
									{event?.start_date ? new Date(event.start_date).toLocaleString() : '—'}
								</div>
							</div>
							<div>
								<span class="text-[var(--color-black-300)]">End</span>
								<div class="text-[var(--color-black-600)]">
									{event?.end_date ? new Date(event.end_date).toLocaleString() : '—'}
								</div>
							</div>
						</div>
					</div>
					{#if event?.description}
						<div
							class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
						>
							<h3 class="mb-2 text-[14px] font-semibold text-[var(--color-black-600)]">
								About Project
							</h3>
							<p class="text-[14px] text-[var(--color-black-500)]">{event.description}</p>
						</div>
					{/if}
				</section>

				{#if (event?.data_quality ?? 0) > 0}
					<!-- Quick stats (analytics only when data exists) -->
					<section class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						<div
							class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
						>
							<div class="text-[12px] text-[var(--color-black-300)]">Age Avg</div>
							<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
								{event?.age?.average ?? 0}
							</div>
						</div>
						<div
							class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
						>
							<div class="text-[12px] text-[var(--color-black-300)]">Age Median</div>
							<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
								{event?.age?.median ?? 0}
							</div>
						</div>
						<div
							class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
						>
							<div class="text-[12px] text-[var(--color-black-300)]">Age Min / Max</div>
							<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
								{event?.age?.min ?? 0} – {event?.age?.max ?? 0}
							</div>
						</div>
						<div
							class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
						>
							<div class="text-[12px] text-[var(--color-black-300)]">Data Quality</div>
							<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
								{Math.round((event?.data_quality ?? 0) * 100)}%
							</div>
						</div>
					</section>

					<!-- Distributions -->
					<section class="mt-6 grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
						<BarChart
							title="Age Distribution"
							labels={ageLabels}
							values={ageValues}
							colorClass="bg-[var(--color-purple-500)]"
						/>

						<div class="flex w-full flex-col gap-3">
							<h3 class="text-[16px] font-semibold text-[var(--color-black-600)]">
								Gender Breakdown
							</h3>
							<div
								class="w-full rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
							>
								<div class="flex flex-col gap-4">
									<div
										class="flex items-center justify-between text-[14px] text-[var(--color-black-400)]"
									>
										<span>Female</span>
										<span>{event?.gender?.female ?? 0} ({genderPct.female}%)</span>
									</div>
									<div class="h-2 w-full overflow-hidden rounded-full bg-[var(--color-grey-50)]">
										<div
											class="h-full rounded-full bg-[var(--color-purple-500)]"
											style={`width:${genderPct.female}%`}
										></div>
									</div>

									<div
										class="flex items-center justify-between pt-2 text-[14px] text-[var(--color-black-400)]"
									>
										<span>Male</span>
										<span>{event?.gender?.male ?? 0} ({genderPct.male}%)</span>
									</div>
									<div class="h-2 w-full overflow-hidden rounded-full bg-[var(--color-grey-50)]">
										<div
											class="h-full rounded-full bg-[var(--color-orange-500)]"
											style={`width:${genderPct.male}%`}
										></div>
									</div>

									<div
										class="flex items-center justify-between pt-2 text-[14px] text-[var(--color-black-400)]"
									>
										<span>Unknown</span>
										<span>{event?.gender?.unknown ?? 0} ({genderPct.unknown}%)</span>
									</div>
									<div class="h-2 w-full overflow-hidden rounded-full bg-[var(--color-grey-50)]">
										<div
											class="h-full rounded-full bg-[var(--color-black-100)]"
											style={`width:${genderPct.unknown}%`}
										></div>
									</div>
								</div>
								<div
									class="mt-3 flex items-center justify-end pr-1 text-[12px] text-[var(--color-black-300)]"
								>
									Total: {totalPeople}
								</div>
							</div>
						</div>
					</section>
				{/if}
			</div>
		</div>
	{/if}
</PageShell>
