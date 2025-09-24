<script lang="ts">
	export let className: string = 'size-5';
	/* stays purple by default */
	export let colorClass: string = 'text-[var(--color-purple-500)]';
</script>

<svg
	class={`${className} ${colorClass}`}
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
>
	<rect
		x="1.5"
		y="1.5"
		width="21"
		height="21"
		rx="6"
		fill="currentColor"
		stroke="currentColor"
		stroke-width="1.5"
	/>
	<path
		d="M7.5 12.5l2.8 2.8L16.5 9"
		fill="none"
		stroke="var(--color-white)"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
