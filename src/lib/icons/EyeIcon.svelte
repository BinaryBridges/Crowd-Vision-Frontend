<script lang="ts">
	export let className: string = 'size-5';
	export let colorClass: string = 'text-[var(--color-black-300)]';
</script>

<svg
	class={`${className} ${colorClass} pointer-events-none`}
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
	<circle cx="12" cy="12" r="3.25" />
</svg>
