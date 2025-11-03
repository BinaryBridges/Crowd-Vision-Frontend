<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import NavItem from './NavItem.svelte';
	import CollapseGroup from './CollapseGroup.svelte';
	import UploadIcon from '$lib/icons/UploadIcon.svelte';
	import ClientsIcon from '$lib/icons/ClientsIcon.svelte';
	import SignOutIcon from '$lib/icons/SignOutIcon.svelte';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
	import { onMount } from 'svelte';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import type { Doc } from '$convex/_generated/dataModel';

	let openDashboard = true;

	// Convex client
	const convexClient = useConvexClient();

	// Starred events state
	let starredEvents: Doc<'events'>[] = [];
	let starredError: string | null = null;

	async function loadStarred() {
		starredError = null;
		try {
			if (convexClient) {
				const result = await convexClient.query(api.events.getFavourites, {});
				starredEvents = (result || []).filter(Boolean);
			} else {
				starredError = 'Convex client not available';
			}
		} catch (err) {
			console.error('Error loading starred events:', err);
			starredError = err instanceof Error ? err.message : 'Unknown error';
		}
	}

	onMount(() => {
		loadStarred();

		// Optional: refresh when favorites change elsewhere
		const handler = () => loadStarred();
		window.addEventListener('cv:favorites-changed', handler);
		return () => window.removeEventListener('cv:favorites-changed', handler);
	});

	function onDashboardToggle() {
		if (!openDashboard) {
			openDashboard = true;
			goto(resolve('/app/overview'));
		} else {
			openDashboard = false;
		}
	}
</script>

<aside
	class="sidebar fixed top-0 left-0 z-40 flex h-dvh border-r bg-[var(--color-grey-25)]"
	style="width: var(--sidebar-w); border-right: 1px solid var(--color-black-50);"
>
	<div
		class="flex h-full w-14 shrink-0 flex-col items-center justify-between border-r"
		style="border-right-color: var(--color-black-50);"
	>
		<div class="pt-3">
			<div
				class="h-9 w-9 rounded-full border bg-[var(--color-grey-50)]"
				style="border-color: var(--color-black-50);"
				aria-hidden="true"
			></div>
		</div>
		<div class="space-y-2 pb-3"></div>
	</div>
	<div class="flex h-full flex-1 flex-col overflow-y-auto">
		<div class="px-4 pt-4 pb-3">
			<div
				class="truncate"
				style="color: var(--color-black-600); font-size: 16px; font-weight: 600;"
			>
				Crowd Vision
			</div>
		</div>

		<div class="px-4 pb-2">
			<div
				class="tracking-normal uppercase"
				style="color: var(--color-black-300); font-size: 14px; font-weight: 500;"
			>
				Main Menu
			</div>
		</div>

		<div class="flex-1 overflow-y-auto px-4 pt-1">
			<CollapseGroup open={openDashboard} onToggle={onDashboardToggle} title="Dashboard" />
			{#if openDashboard}
				<div class="space-y-1 pl-7">
					<NavItem
						label="Overview"
						selected={page.url.pathname.includes('/overview')}
						href="/app/overview"
					/>
					<NavItem
						label="Events"
						selected={page.url.pathname.startsWith('/app/events') &&
							!page.url.pathname.includes('/app/events/add')}
						href="/app/events"
					/>
				</div>
			{/if}

			<NavItem
				label="Upload"
				Icon={UploadIcon}
				href="/app/events/add"
				selected={page.url.pathname.includes('/events/add')}
			/>
			<NavItem label="Clients" Icon={ClientsIcon} href="/app/clients" />

			<div class="pt-2">
				<div class="mb-2" style="color: var(--color-black-300); font-size: 14px; font-weight: 500;">
					Starred Events
				</div>
				<div class="space-y-1">
					{#if starredError}
						<div class="px-2 py-1 text-[12px] text-red-500">{starredError}</div>
					{:else if starredEvents.length === 0}
						<div class="px-2 py-1 text-[12px] text-[var(--color-black-300)]">No favorites yet</div>
					{:else}
						{#each starredEvents as ev (ev._id)}
							<NavItem
								label={ev.name}
								href={`/app/events/${ev._id}`}
								avatarSrc={ev.image}
								avatarAlt={ev.name}
							/>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<div class="border-t px-4 py-4" style="border-color: var(--color-black-50);">
			<div class="space-y-1">
				<NavItem label="Sign out" Icon={SignOutIcon} />
				<NavItem label="Settings" Icon={SettingsIcon} href="/app/settings" />
			</div>
		</div>
	</div>
</aside>

<style>
	:root {
		--sidebar-w: 324px;
	}
	@media (max-width: 1280px) {
		:root {
			--sidebar-w: 300px;
		}
	}
	@media (max-width: 1024px) {
		:root {
			--sidebar-w: 280px;
		}
	}
</style>
