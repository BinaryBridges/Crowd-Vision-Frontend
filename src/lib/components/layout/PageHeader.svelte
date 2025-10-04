<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import type { Crumb } from '$lib/types/ui';

	export let segments: Crumb[] = [];
</script>

<header
	class="w-full border-b px-[30px] py-[14px]"
	style="border-bottom-color: var(--color-black-50);"
>
	<Breadcrumb {segments} />
</header>
