<script lang="ts">
	export let value: number | string;

	const toNumber = (v: number | string) => (typeof v === 'string' ? parseFloat(v) : v);

	function formatEpochMs(ms: number | string) {
		const n = toNumber(ms);
		const d = new Date(n);
		return d.toLocaleString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true,
			timeZone: 'America/Edmonton'
		});
	}

	$: display = formatEpochMs(value);
</script>

<span>{display}</span>
