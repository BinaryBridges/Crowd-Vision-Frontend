<script lang="ts">
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import UploadTray from '$lib/components/upload/UploadTray.svelte';
</script>

<div class="flex h-dvh overflow-hidden bg-[var(--color-grey-25)]">
	<Sidebar />
	<div class="shrink-0" style="width: var(--sidebar-w);"></div>
	<main class="min-w-0 flex-1 overflow-hidden bg-[var(--color-grey-25)]">
		<div class="px-[30px] pt-[24px]">
			<slot name="header" />
		</div>
		<div class="h-full overflow-y-auto">
			<div class="px-[30px] pb-[32px]">
				<slot />
			</div>
		</div>
		<UploadTray />
	</main>
</div>

<style>
	:global(html, body) {
		height: 100%;
	}
</style>
