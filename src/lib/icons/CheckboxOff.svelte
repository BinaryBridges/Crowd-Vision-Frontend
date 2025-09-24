<script lang="ts">
	export let className: string = 'size-5';
	export let colorClass: string = 'text-[var(--color-grey-200)]';
</script>

<svg
	class={`${className} ${colorClass}`}
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
	fill="none"
>
	<rect x="1.5" y="1.5" width="21" height="21" rx="6" stroke="currentColor" stroke-width="1.5" />
</svg>
