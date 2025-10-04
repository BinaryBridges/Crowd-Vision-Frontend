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
			d="M7.50163 5.83341C7.51171 4.02089 7.59209 3.0393 8.23241 2.39898C8.96464 1.66675 10.1432 1.66675 12.5002 1.66675H13.3335C15.6905 1.66675 16.869 1.66675 17.6013 2.39898C18.3335 3.13121 18.3335 4.30973 18.3335 6.66675V13.3334C18.3335 15.6904 18.3335 16.8689 17.6013 17.6012C16.869 18.3334 15.6905 18.3334 13.3335 18.3334H12.5002C10.1432 18.3334 8.96464 18.3334 8.23241 17.6012C7.59209 16.9609 7.51171 15.9793 7.50163 14.1667"
		/>
		<path d="M12.5 10H1.66667M1.66667 10L4.58333 7.5M1.66667 10L4.58333 12.5" />
	</g>
	<defs>
		<clipPath id="clip0">
			<rect width="20" height="20" rx="5" />
		</clipPath>
	</defs>
</svg>
