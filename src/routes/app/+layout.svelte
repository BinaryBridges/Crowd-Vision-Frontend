<script lang="ts">
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
</script>

<div class="flex min-h-screen bg-[var(--color-white)]">
	<Sidebar />
	<slot />
</div>
