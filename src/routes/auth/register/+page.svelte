<script lang="ts">
	import AuthLayout from '$lib/components/auth/AuthLayout.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import GoogleIcon from '$lib/icons/GoogleIcon.svelte';
	import TextInput from '$lib/components/general/TextInput.svelte';
	import EyeIcon from '$lib/icons/EyeIcon.svelte';
	import EyeOffIcon from '$lib/icons/EyeOffIcon.svelte';
	import Divider from '$lib/components/general/Divider.svelte';
	import Checkbox from '$lib/components/general/Checkbox.svelte';

	let fullName = '';
	let email = '';
	let password = '';
	let confirm = '';
	let agreed = false;

	let nameError: string | undefined;
	let emailError: string | undefined;
	let passwordError: string | undefined;
	let confirmError: string | undefined;

	let showPassword = false;
	let showConfirm = false;

	const toggleShowPassword = () => (showPassword = !showPassword);
	const toggleShowConfirm = () => (showConfirm = !showConfirm);

	$: canSubmit =
		fullName.trim().length > 0 &&
		email.trim().length > 0 &&
		password.trim().length > 0 &&
		confirm.trim().length > 0 &&
		agreed;

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

	function validateAndSubmit() {
		nameError = emailError = passwordError = confirmError = undefined;

		if (!fullName.trim()) nameError = 'Please enter your full name.';
		if (!emailRegex.test(email.trim())) emailError = 'Please enter a valid email address.';
		if (!passwordRegex.test(password)) {
			passwordError =
				'Min 8 chars, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.';
		}
		if (confirm !== password) confirmError = 'Passwords do not match.';

		const ok = !nameError && !emailError && !passwordError && !confirmError && agreed;
		if (ok) {
			// TODO: submit to API
		}
	}

	const onNameInput = () => {
		if (nameError) nameError = undefined;
	};
	const onEmailInput = () => {
		if (emailError) emailError = undefined;
	};
	const onPasswordInput = () => {
		if (passwordError) passwordError = undefined;
		if (confirmError && confirm === password) confirmError = undefined;
	};
	const onConfirmInput = () => {
		if (confirmError && confirm === password) confirmError = undefined;
	};
</script>

<AuthLayout title="Welcome to Crowd Vision" description="Register now and start your adventure.">
	<form
		class="flex flex-col gap-2"
		novalidate
		on:invalid|preventDefault
		on:submit|preventDefault={validateAndSubmit}
	>
		<TextInput
			id="full-name"
			label="Full name"
			placeholder="Type name…"
			bind:value={fullName}
			error={nameError}
			type="text"
			full
			on:input={onNameInput}
		/>

		<TextInput
			id="email"
			label="Email"
			placeholder="Type email…"
			bind:value={email}
			error={emailError}
			type="email"
			full
			on:input={onEmailInput}
		/>

		<TextInput
			id="password"
			label="Password"
			placeholder="Type password…"
			bind:value={password}
			error={passwordError}
			type={showPassword ? 'text' : 'password'}
			trailing
			full
			on:input={onPasswordInput}
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

		<TextInput
			id="confirm"
			label="Confirm password"
			placeholder="Re-type password…"
			bind:value={confirm}
			error={confirmError}
			type={showConfirm ? 'text' : 'password'}
			trailing
			full
			on:input={onConfirmInput}
		>
			<button
				slot="trailing"
				type="button"
				class="focus-ring grid size-5 place-items-center rounded-[8px] text-[var(--color-black-300)]"
				aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
				on:click={toggleShowConfirm}
			>
				{#if showConfirm}
					<EyeOffIcon className="size-5" />
				{:else}
					<EyeIcon className="size-5" />
				{/if}
			</button>
		</TextInput>

		<Checkbox id="tos" bind:checked={agreed}>
			I agree to all the
			<span class="font-semibold text-[var(--color-black-600)]"> Term </span>
			&amp;
			<span class="font-semibold text-[var(--color-black-600)]"> Privacy Policy</span>
		</Checkbox>

		<Button variant="primary" full type="submit" ariaLabel="Register" disabled={!canSubmit}>
			Register
		</Button>

		<Divider text="or" />

		<Button variant="outline" full type="button" ariaLabel="Register with Google">
			<span slot="icon"><GoogleIcon className="size-5" /></span>
			Register with Google
		</Button>
	</form>
</AuthLayout>
