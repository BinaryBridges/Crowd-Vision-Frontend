<script lang="ts">
	type EventLike = {
		color: string;
		logo: string;
		name: string;
		company: string;
	};

	type T = $$Generic<EventLike>;
	export let item: T;
</script>

<div class="flex items-center gap-3">
	<div
		class="flex size-10 items-center justify-center rounded-lg"
		style="background-color: {item.color}"
	>
		<span class="text-xl">{item.logo}</span>
	</div>
	<div class="flex flex-col">
		<span class="text-[14px] font-medium text-[var(--color-black-600)]">{item.name}</span>
		<span class="text-[12px] text-[var(--color-black-200)]">{item.company}</span>
	</div>
</div>
