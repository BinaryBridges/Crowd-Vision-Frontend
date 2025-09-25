<script lang="ts">
	import TextInput from '$lib/components/general/TextInput.svelte';
	import EyeIcon from '$lib/icons/EyeIcon.svelte';
	import EyeOffIcon from '$lib/icons/EyeOffIcon.svelte';

	export let id = '';
	export let label = 'Password';
	export let placeholder = 'Type password…';
	export let value = '';
	export let error: string | undefined = undefined;
	export let labelLinkText: string | undefined = undefined;
	export let labelLinkHref: string = '#';

	let showPassword = false;

	const toggleShowPassword = () => (showPassword = !showPassword);
</script>

<TextInput
	{id}
	{label}
	{placeholder}
	bind:value
	{error}
	{labelLinkText}
	{labelLinkHref}
	type={showPassword ? 'text' : 'password'}
	trailing
	full
	on:input
>
	<button
		slot="trailing"
		type="button"
		class="focus-ring grid size-5 place-items-center rounded-[8px] text-[var(--color-black-300)]"
		aria-label={showPassword ? 'Hide password' : 'Show password'}
		on:click={toggleShowPassword}
	>
		{#if showPassword}
			<EyeOffIcon className="size-5" />
		{:else}
			<EyeIcon className="size-5" />
		{/if}
	</button>
</TextInput>
