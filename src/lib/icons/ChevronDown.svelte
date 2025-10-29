<script lang="ts">
	export let className: string = 'size-5';
	export let colorClass: string = 'text-[var(--color-black-400)]';
</script>

<svg
	class={`${className} ${colorClass} pointer-events-none`}
	viewBox="0 0 20 20"
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d="M15.8333 7.5L10 12.5L4.16667 7.5" />
</svg>
