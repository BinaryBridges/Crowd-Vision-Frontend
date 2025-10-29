<script lang="ts"></script>

<div class="min-w-0 flex-1 bg-[var(--color-grey-25)]">
	<slot name="header" />
	<div
		class="flex flex-col items-start gap-[24px] self-stretch
           px-[30px] py-[32px]"
	>
		<slot />
	</div>
</div>
