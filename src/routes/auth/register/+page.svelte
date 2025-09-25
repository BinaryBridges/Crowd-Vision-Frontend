<script lang="ts">
	import AuthLayout from '$lib/components/auth/AuthLayout.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import GoogleIcon from '$lib/icons/GoogleIcon.svelte';
	import TextInput from '$lib/components/general/TextInput.svelte';
	import PasswordInput from '$lib/components/general/PasswordInput.svelte';
	import Divider from '$lib/components/general/Divider.svelte';
	import Checkbox from '$lib/components/general/Checkbox.svelte';
	import { EMAIL_REGEX, PASSWORD_REGEX, VALIDATION_MESSAGES } from '$lib/constants';

	let fullName = '';
	let email = '';
	let password = '';
	let confirm = '';
	let agreed = false;

	let nameError: string | undefined;
	let emailError: string | undefined;
	let passwordError: string | undefined;
	let confirmError: string | undefined;

	$: canSubmit =
		fullName.trim().length > 0 &&
		email.trim().length > 0 &&
		password.trim().length > 0 &&
		confirm.trim().length > 0 &&
		agreed;

	function validateAndSubmit() {
		nameError = emailError = passwordError = confirmError = undefined;

		if (!fullName.trim()) nameError = VALIDATION_MESSAGES.REQUIRED_FULL_NAME;
		if (!EMAIL_REGEX.test(email.trim())) emailError = VALIDATION_MESSAGES.INVALID_EMAIL;
		if (!PASSWORD_REGEX.test(password)) passwordError = VALIDATION_MESSAGES.INVALID_PASSWORD;
		if (confirm !== password) confirmError = VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH;

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

<AuthLayout
	title="Welcome to Crowd Vision"
	description="Register now and start your adventure."
	footerText="Already have an account?"
	footerLinkText="Sign In"
	footerHref="login"
>
	<form
		class="flex flex-col gap-3"
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
		<PasswordInput
			id="password"
			label="Password"
			placeholder="Type password…"
			bind:value={password}
			error={passwordError}
			on:input={onPasswordInput}
		/>
		<PasswordInput
			id="confirm"
			label="Confirm password"
			placeholder="Re-type password…"
			bind:value={confirm}
			error={confirmError}
			on:input={onConfirmInput}
		/>
		<Checkbox id="tos" bind:checked={agreed} className="py-2">
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
