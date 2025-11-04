<script lang="ts">
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DashboardIcon from '$lib/icons/DashboardIcon.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import BarChart from '$lib/components/general/BarChart.svelte';
	import type { Crumb } from '$lib/types/ui';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import { PUBLIC_USER_ID } from '$env/static/public';
	import type { Doc, Id } from '$convex/_generated/dataModel';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const segments: Crumb[] = [
		{ label: 'Dashboard', href: '/app/overview', Icon: DashboardIcon },
		{ label: 'Overview' }
	];

	const convexClient = useConvexClient();

	type UserWithEvents = Omit<Doc<'users'>, 'events'> & { events: Doc<'events'>[] };
	let user: UserWithEvents | null = null;
	let isLoading = true;
	let error: string | null = null;

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

	function mapStatus(
		dbStatus: string | undefined
	): 'In Progress' | 'Finished' | 'Uploading' | 'Failed' {
		switch ((dbStatus || '').toLowerCase()) {
			case 'completed':
			case 'finished':
				return 'Finished';
			case 'in progress':
			case 'in_progress':
			case 'progress':
				return 'In Progress';
			case 'uploading':
				return 'Uploading';
			case 'failed':
				return 'Failed';
			default:
				return 'Uploading';
		}
	}

	async function loadUser() {
		isLoading = true;
		error = null;
		try {
			if (!convexClient) throw new Error('Convex client not available');
			if (!PUBLIC_USER_ID) throw new Error('PUBLIC_USER_ID not set');
			const res = await convexClient.query(api.users.getById, {
				userId: PUBLIC_USER_ID as Id<'users'>
			});
			user = res;
		} catch (err) {
			console.error('Error loading user overview:', err);
			error = err instanceof Error ? err.message : String(err);
		} finally {
			isLoading = false;
		}
	}

	onMount(loadUser);

	$: totalPeople = user
		? (user.total_gender?.female || 0) +
			(user.total_gender?.male || 0) +
			(user.total_gender?.unknown || 0)
		: 0;

	$: genderPct = user
		? {
				female: Math.round(((user.total_gender?.female || 0) / Math.max(1, totalPeople)) * 100),
				male: Math.round(((user.total_gender?.male || 0) / Math.max(1, totalPeople)) * 100),
				unknown: Math.round(((user.total_gender?.unknown || 0) / Math.max(1, totalPeople)) * 100)
			}
		: { female: 0, male: 0, unknown: 0 };

	$: ageValues = user?.total_age_distribution
		? [
				user.total_age_distribution.a0_10,
				user.total_age_distribution.a11_20,
				user.total_age_distribution.a21_30,
				user.total_age_distribution.a31_40,
				user.total_age_distribution.a41_50,
				user.total_age_distribution.a51_60,
				user.total_age_distribution.a61_70,
				user.total_age_distribution.a71_80,
				user.total_age_distribution.a81_90,
				user.total_age_distribution.a91_100
			]
		: Array(10).fill(0);

	$: statusCounts = (() => {
		const init = { finished: 0, inProgress: 0, uploading: 0, failed: 0 };
		if (!user?.events?.length) return init;
		for (const e of user.events) {
			const status = mapStatus(e.status);
			if (status === 'Finished') init.finished++;
			else if (status === 'In Progress') init.inProgress++;
			else if (status === 'Failed') init.failed++;
			else init.uploading++;
		}
		return init;
	})();

	// Derive user-level age average/median from distribution (approximate).
	function computeAgeStats(u: UserWithEvents | null) {
		if (!u?.total_age_distribution) {
			return { avg: 0, median: 0 };
		}
		const d = u.total_age_distribution;
		const counts = [
			d.a0_10,
			d.a11_20,
			d.a21_30,
			d.a31_40,
			d.a41_50,
			d.a51_60,
			d.a61_70,
			d.a71_80,
			d.a81_90,
			d.a91_100,
			d.a101
		];
		const mids = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 101];
		const total = counts.reduce((a, b) => a + b, 0);
		if (total === 0) return { avg: 0, median: 0 };
		const weighted = counts.reduce((sum, c, i) => sum + c * mids[i], 0);
		const avg = weighted / total;
		// median (approximate): bucket midpoint where cumulative crosses half
		const half = total / 2;
		let cum = 0;
		let medianMid = mids[0];
		for (let i = 0; i < counts.length; i++) {
			cum += counts[i];
			if (cum >= half) {
				medianMid = mids[i];
				break;
			}
		}
		return { avg, median: medianMid };
	}

	$: ageStats = computeAgeStats(user);

	// Average data quality across user's events (0..1 -> percent)
	$: dataQualityPct = (() => {
		const list = user?.events ?? [];
		if (!list.length) return 0;
		const vals = list.map((e) => e.data_quality ?? 0);
		const sum = vals.reduce((a, b) => a + b, 0);
		return Math.round((sum / list.length) * 100);
	})();

	let nowText = new Date().toLocaleString();
</script>

<PageShell>
	<svelte:fragment slot="header">
		<PageHeader {segments} />
	</svelte:fragment>

	{#if isLoading}
		<div class="flex items-center justify-center py-12">
			<p class="text-[var(--color-black-400)]">Loading overview...</p>
		</div>
	{:else if error}
		<div class="flex items-center justify-center py-12">
			<p class="text-red-500">{error}</p>
		</div>
	{:else}
		<!-- Gradient header like event detail -->
		<section
			class="relative min-h-[100px] w-full overflow-hidden rounded-[var(--radius-20)] px-4 pt-4 pb-6 md:min-h-[130px] md:px-6 md:pt-5 md:pb-7"
			style="background: linear-gradient(135deg, #E2CFF9 0%, #FCF3DB 100%);"
		>
			<div class="flex flex-col gap-1">
				<h1 class="text-[22px] font-semibold text-[var(--color-black-600)]">
					Welcome Back {user?.name}
				</h1>
				<p class="text-[14px] text-[var(--color-black-400)]">
					Here's your latest update. Let's get things done.
				</p>
			</div>

			<div class="absolute top-4 right-4 flex items-center gap-3">
				<div
					class="rounded-[10px] border border-[var(--color-black-100)] bg-[var(--color-white)] px-3 py-2 text-[12px] text-[var(--color-black-400)] shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
				>
					{nowText}
				</div>
				<Button
					variant="primary"
					ariaLabel="Add Event"
					on:click={() => goto(resolve('/app/events/add'))}>Add Event</Button
				>
			</div>
		</section>

		<!-- Content card overlapping the bottom of the gradient -->
		<div class="relative -mt-10 w-full sm:-mt-12 md:-mt-14">
			<div
				class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)] md:p-6"
			>
				<!-- Quick status cards -->
				<section class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
					<div
						class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<div class="text-[12px] text-[var(--color-black-300)]">In Progress</div>
						<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
							{statusCounts.inProgress}
						</div>
					</div>
					<div
						class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<div class="text-[12px] text-[var(--color-black-300)]">Finished</div>
						<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
							{statusCounts.finished}
						</div>
					</div>
					<div
						class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<div class="text-[12px] text-[var(--color-black-300)]">Uploading</div>
						<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
							{statusCounts.uploading}
						</div>
					</div>
					<div
						class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<div class="text-[12px] text-[var(--color-black-300)]">Failed</div>
						<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
							{statusCounts.failed}
						</div>
					</div>
				</section>

				<!-- Age & quality cards (from event detail style) -->
				<section class="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
					<div
						class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<div class="text-[12px] text-[var(--color-black-300)]">Age Avg</div>
						<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
							{Math.round(ageStats.avg)}
						</div>
					</div>
					<div
						class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<div class="text-[12px] text-[var(--color-black-300)]">Age Median</div>
						<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
							{Math.round(ageStats.median)}
						</div>
					</div>
					<div
						class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<div class="text-[12px] text-[var(--color-black-300)]">Age Min / Max</div>
						<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
							{user?.total_age?.min ?? 0} - {user?.total_age?.max ?? 0}
						</div>
					</div>
					<div
						class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<div class="text-[12px] text-[var(--color-black-300)]">Data Quality</div>
						<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
							{dataQualityPct}%
						</div>
					</div>
				</section>

				<!-- Charts / breakdowns -->
				<section class="mt-6 grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
					<div class="flex flex-col">
						<BarChart
							title="Age Distribution"
							labels={ageLabels}
							values={ageValues}
							colorClass="bg-[var(--color-purple-500)]"
						/>
					</div>

					<div class="flex w-full flex-col gap-3">
						<h3 class="text-[16px] font-semibold text-[var(--color-black-600)]">
							Gender Breakdown
						</h3>
						<div
							class="flex h-full w-full flex-col rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
						>
							<div class="flex flex-1 flex-col justify-center gap-4">
								<div
									class="flex items-center justify-between text-[14px] text-[var(--color-black-400)]"
								>
									<span>Female</span>
									<span>{user?.total_gender?.female ?? 0} ({genderPct.female}%)</span>
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
									<span>{user?.total_gender?.male ?? 0} ({genderPct.male}%)</span>
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
									<span>{user?.total_gender?.unknown ?? 0} ({genderPct.unknown}%)</span>
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
			</div>
		</div>
	{/if}
</PageShell>
