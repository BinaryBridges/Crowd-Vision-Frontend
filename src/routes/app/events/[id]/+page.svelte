<script lang="ts">
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DashboardIcon from '$lib/icons/DashboardIcon.svelte';
	import FavoriteCell from '$lib/components/table/FavoriteCell.svelte';
	import EventStatusCell from '$lib/components/table/EventStatusCell.svelte';
	import BarChart from '$lib/components/general/BarChart.svelte';
	import type { Crumb } from '$lib/types/ui';

	const event = {
		_id: 'j57dv95br7185tr0c8d8rv6fb17ryx3a',
		name: 'test_event1',
		image: 'https://template.canva.com/EAE1YAgPM_U/1/0/400w-R-Meu_EcnME.jpg',
		status: 'completed',
		client: 'jd7377nh0w8m6my0h5vjyvkpms7ryt3a',
		completion_time: '10/6/2025, 4:25:38 PM',
		data_quality: 0.99,
		favourite: false,
		price: 0,
		age: { average: 36, max: 56, median: 35, min: 28 },
		age_distribution: {
			a0_10: 0,
			a11_20: 0,
			a21_30: 3,
			a31_40: 63,
			a41_50: 14,
			a51_60: 2,
			a61_70: 0,
			a71_80: 0,
			a81_90: 0,
			a91_100: 0
		},
		gender: { female: 36, male: 46, unknown: 1 }
	} as const;

	const client = {
		_id: 'jd7377nh0w8m6my0h5vjyvkpms7ryt3a',
		company: 'test_name',
		logo: 'https://cdn.dribbble.com/userupload/18022595/file/original-c50e1fd192b6fcd1f4e40e84bef5d57b.png?resize=400x0',
		name: 'test_client',
		representative: 'test_representative',
		_creationTime: '10/6/2025, 4:10:27 PM'
	} as const;

	const STATUS_MAP: Record<string, 'Finished' | 'In Progress' | 'Draft' | 'Overdue'> = {
		completed: 'Finished',
		'in-progress': 'In Progress',
		draft: 'Draft',
		overdue: 'Overdue'
	};
	const statusLabel: 'Finished' | 'In Progress' | 'Draft' | 'Overdue' =
		STATUS_MAP[event.status] ?? 'Finished';

	const segments: Crumb[] = [
		{ label: 'Dashboard', href: '/app/overview', Icon: DashboardIcon },
		{ label: 'Events', href: '/app/events' },
		{ label: event.name }
	];

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
	const ageValues = [
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
	];

	const totalPeople = event.gender.female + event.gender.male + event.gender.unknown;
	const genderPct = {
		female: Math.round((event.gender.female / Math.max(1, totalPeople)) * 100),
		male: Math.round((event.gender.male / Math.max(1, totalPeople)) * 100),
		unknown: Math.round((event.gender.unknown / Math.max(1, totalPeople)) * 100)
	};

	const favItem = { isFavorite: event.favourite };
</script>

<PageShell>
	<svelte:fragment slot="header">
		<PageHeader {segments} />
	</svelte:fragment>

	<!-- Full-width gradient header -->
	<section
		class="relative min-h-[220px] w-full overflow-hidden rounded-[var(--radius-20)] px-4 pt-6 pb-4 sm:min-h-[260px] md:min-h-[280px] md:px-6 md:pt-8 md:pb-6"
		style="background: linear-gradient(135deg, #E2CFF9 0%, #FCF3DB 100%);"
	>
		<div class="flex flex-col gap-2">
			<div
				class="flex h-18 w-18 items-center justify-center rounded-[12px] bg-[var(--color-white)] shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
			>
				<img src={event.image} alt="" class="h-15 w-15 shrink-0 object-contain" />
			</div>
			<h1 class="text-[24px] font-semibold text-[var(--color-black-600)]">{event.name}</h1>
			<div class="flex flex-wrap items-center gap-3">
				<EventStatusCell item={{ status: statusLabel }} />
				<span class="text-[14px] text-[var(--color-black-400)]">{event.completion_time}</span>
				<div class="flex items-center gap-2">
					<span class="text-[14px] text-[var(--color-black-600)]">{client.representative}</span>
				</div>
				<div class="flex items-center gap-2">
					<img src={client.logo} alt="" class="h-4 w-4 rounded-[4px] object-contain" /><span
						class="text-[14px] text-[var(--color-black-300)]">{client.name}</span
					>
				</div>
			</div>
		</div>
		<div class="absolute top-4 right-4">
			<FavoriteCell item={favItem} />
		</div>
	</section>

	<!-- Content card overlapping the bottom of the gradient -->
	<div class="relative -mt-14 w-full sm:-mt-16 md:-mt-20 lg:-mt-24">
		<div
			class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)] md:p-6"
		>
			<!-- Quick stats -->
			<section class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
				<div
					class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
				>
					<div class="text-[12px] text-[var(--color-black-300)]">Age Avg</div>
					<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
						{event.age.average}
					</div>
				</div>
				<div
					class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
				>
					<div class="text-[12px] text-[var(--color-black-300)]">Age Median</div>
					<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
						{event.age.median}
					</div>
				</div>
				<div
					class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
				>
					<div class="text-[12px] text-[var(--color-black-300)]">Age Min / Max</div>
					<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
						{event.age.min} – {event.age.max}
					</div>
				</div>
				<div
					class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
				>
					<div class="text-[12px] text-[var(--color-black-300)]">Data Quality</div>
					<div class="text-[24px] font-semibold text-[var(--color-black-600)]">
						{Math.round(event.data_quality * 100)}%
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
					<h3 class="text-[16px] font-semibold text-[var(--color-black-600)]">Gender Breakdown</h3>
					<div
						class="w-full rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-4 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
					>
						<div class="flex flex-col gap-4">
							<div
								class="flex items-center justify-between text-[14px] text-[var(--color-black-400)]"
							>
								<span>Female</span>
								<span>{event.gender.female} ({genderPct.female}%)</span>
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
								<span>{event.gender.male} ({genderPct.male}%)</span>
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
								<span>{event.gender.unknown} ({genderPct.unknown}%)</span>
							</div>
							<div class="h-2 w-full overflow-hidden rounded-full bg-[var(--color-grey-50)]">
								<div
									class="h-full rounded-full bg-[var(--color-black-100)]"
									style={`width:${genderPct.unknown}%`}
								></div>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-end pr-2 text-[12px] text-[var(--color-black-300)]">
						Total: {totalPeople}
					</div>
				</div>
			</section>
		</div>
	</div>
</PageShell>
