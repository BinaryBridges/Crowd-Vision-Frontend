<script lang="ts">
	type EventLike = {
		color: string;
		logo: string;
		name: string;
		company: string;
	};

	type T = $$Generic<EventLike>;
	export let item: T;

	// Check if logo is a URL
	$: isImageUrl = item.logo && (item.logo.startsWith('http') || item.logo.startsWith('data:'));

	// State to handle image loading errors
	let imageError = false;
</script>

<div class="flex items-center gap-3">
	<div
		class="flex size-10 items-center justify-center overflow-hidden rounded-lg"
		style="background-color: {item.color}"
	>
		{#if isImageUrl && !imageError}
			<img
				src={item.logo}
				alt="{item.name} logo"
				class="h-full w-full rounded-lg object-cover"
				on:error={() => {
					imageError = true;
				}}
			/>
		{/if}
	</div>
	<div class="flex flex-col">
		<span class="text-[14px] font-medium text-[var(--color-black-600)]">{item.name}</span>
		<span class="text-[12px] text-[var(--color-black-200)]">{item.company}</span>
	</div>
</div>
