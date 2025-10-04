<script lang="ts">
	export let className: string = 'size-5';
	export let colorClass: string = 'text-[var(--color-black-500)]';
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
	<path
		d="M1.66666 10.1699C1.66666 8.26287 1.66666 7.30936 2.09933 6.51891C2.532 5.72847 3.32245 5.23789 4.90336 4.25673L6.57002 3.22235C8.24115 2.1852 9.07672 1.66663 10 1.66663C10.9233 1.66663 11.7588 2.1852 13.43 3.22235L15.0966 4.25673C16.6775 5.23789 17.468 5.72847 17.9007 6.51891C18.3333 7.30936 18.3333 8.26287 18.3333 10.1699V11.4374C18.3333 14.6882 18.3333 16.3135 17.357 17.3234C16.3807 18.3333 14.8094 18.3333 11.6667 18.3333H8.33333C5.19063 18.3333 3.61929 18.3333 2.64297 17.3234C1.66666 16.3135 1.66666 14.6882 1.66666 11.4374V10.1699Z"
	/>
</svg>
