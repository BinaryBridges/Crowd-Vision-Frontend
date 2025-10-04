<script lang="ts">
	export let className: string = 'w-5 h-5';
	export let mainColorClass: string = 'text-[var(--color-black-400)]';
	export let accentColorClass: string = 'text-[var(--color-black-500)]';
</script>

<svg
	class={`${className} pointer-events-none`}
	viewBox="0 0 20 20"
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	stroke-width="1.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<g class={mainColorClass} stroke="currentColor">
		<circle cx="10" cy="4.99996" r="3.33333" />
		<path
			d="M15 7.50004C16.3807 7.50004 17.5 6.5673 17.5 5.41671C17.5 4.26611 16.3807 3.33337 15 3.33337"
		/>
		<path
			d="M5 7.50004C3.61929 7.50004 2.5 6.5673 2.5 5.41671C2.5 4.26611 3.61929 3.33337 5 3.33337"
		/>
	</g>

	<g class={accentColorClass} stroke="currentColor">
		<ellipse cx="10" cy="14.1667" rx="5" ry="3.33333" />
		<path
			d="M16.6667 15.8333C18.1285 15.5127 19.1667 14.7008 19.1667 13.75C19.1667 12.7991 18.1285 11.9872 16.6667 11.6666"
		/>
		<path
			d="M3.33334 15.8333C1.87146 15.5127 0.833336 14.7008 0.833336 13.75C0.833336 12.7991 1.87146 11.9872 3.33334 11.6666"
		/>
	</g>
</svg>
