<script lang="ts">
	export let className: string = 'w-5 h-5';
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
	<g clip-path="url(#clip0)">
		<path
			d="M14.1667 7.50159C15.9792 7.51168 16.9608 7.59205 17.6011 8.23237C18.3333 8.96461 18.3333 10.1431 18.3333 12.5001V13.3335C18.3333 15.6905 18.3333 16.869 17.6011 17.6012C16.8689 18.3335 15.6904 18.3335 13.3333 18.3335H6.66666C4.30964 18.3335 3.13113 18.3335 2.3989 17.6012C1.66666 16.869 1.66666 15.6905 1.66666 13.3335L1.66666 12.5001C1.66666 10.1431 1.66666 8.9646 2.3989 8.23237C3.03922 7.59205 4.02081 7.51168 5.83333 7.50159"
		/>
		<path d="M10 12.5V1.66667M10 1.66667L12.5 4.58333M10 1.66667L7.5 4.58333" />
	</g>
	<defs>
		<clipPath id="clip0">
			<rect width="20" height="20" rx="5" />
		</clipPath>
	</defs>
</svg>
