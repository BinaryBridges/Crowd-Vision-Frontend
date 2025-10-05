<script lang="ts">
	import { formatTableDate } from '$lib/utils/formatDate';
	export let item: { analysisDate: number };
</script>

<span class="text-[14px] whitespace-nowrap text-[var(--color-black-400)]">
	{formatTableDate(item.analysisDate)}
</span>
