<script lang="ts">
	export let text: string = 'or';
</script>

<div
	class="my-2 flex items-center gap-[8px] self-stretch"
	role="separator"
	aria-orientation="horizontal"
>
	<div class="h-px flex-1 bg-[var(--color-black-50)]"></div>

	<span class="text-[14px] font-normal text-[var(--color-black-300)] select-none">
		<slot>{text}</slot>
	</span>

	<div class="h-px flex-1 bg-[var(--color-black-50)]"></div>
</div>
