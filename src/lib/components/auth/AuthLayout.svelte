<script lang="ts">
	import TextLink from '$lib/components/general/TextLink.svelte';

	export let title = '';
	export let description = '';
	export let footerText: string | undefined = undefined;
	export let footerLinkText: string | undefined = undefined;
	export let footerHref: string | undefined = undefined;
</script>

<section
	class="flex w-full max-w-md flex-col items-center justify-center gap-8
         rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)]
         bg-[var(--color-white)] p-8"
>
	{#if title || description}
		<div>
			{#if title}
				<h1
					class="text-center"
					style="color: var(--color-black-600); font-size: 24px; font-style: normal; font-weight: 600;"
				>
					{title}
				</h1>
			{/if}

			{#if description}
				<p
					class="text-center"
					style="color: var(--color-black-300); font-size: 16px; font-style: normal; font-weight: 400;"
				>
					{description}
				</p>
			{/if}
		</div>
	{/if}

	<div class="w-full">
		<slot />
	</div>

	<div class="w-full">
		{#if $$slots.footer}
			<slot name="footer" />
		{:else if footerText && footerLinkText && footerHref}
			<TextLink text={footerText} linkText={footerLinkText} href={footerHref} align="center" />
		{/if}
	</div>
</section>
