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

	let openDashboard = true;

	const starred: string[] = ['Project 101', 'UX Audit', 'Mylo AI Initiative'];

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
	class="flex min-h-screen border-r"
	style="
    width: 324px;
    background: var(--color-grey-25);
    border-right: 1px solid var(--color-black-50);
  "
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
	<div class="flex min-h-screen flex-1 flex-col">
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
						selected={page.url.pathname.includes('/events')}
						href="/app/events"
					/>
				</div>
			{/if}
			<NavItem label="Upload" Icon={UploadIcon} href="/app/upload" />
			<NavItem label="Clients" Icon={ClientsIcon} href="/app/clients" />

			<div class="pt-2">
				<div class="mb-2" style="color: var(--color-black-300); font-size: 14px; font-weight: 500;">
					Starred Events
				</div>
				<div class="space-y-1">
					{#each starred as name (name)}
						<NavItem label={name} />
					{/each}
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
	@media (max-width: 1280px) {
		aside {
			width: 300px;
		}
	}
	@media (max-width: 1024px) {
		aside {
			width: 280px;
		}
	}
</style>
