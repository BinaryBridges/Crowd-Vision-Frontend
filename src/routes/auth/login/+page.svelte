<script lang="ts">
	import AuthLayout from '$lib/components/auth/AuthLayout.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import GoogleIcon from '$lib/icons/GoogleIcon.svelte';
	import TextInput from '$lib/components/general/TextInput.svelte';
	import PasswordInput from '$lib/components/general/PasswordInput.svelte';
	import Divider from '$lib/components/general/Divider.svelte';
	import { EMAIL_REGEX, VALIDATION_MESSAGES } from '$lib/constants';

	let email = '';
	let password = '';

	let emailError: string | undefined;
	let passwordError: string | undefined;

	$: canSubmit = email.trim().length > 0 && password.trim().length > 0;

	function validateAndSubmit() {
		emailError = passwordError = undefined;

		if (!EMAIL_REGEX.test(email.trim())) {
			emailError = VALIDATION_MESSAGES.INVALID_EMAIL;
		}
		if (!password.trim()) {
			passwordError = VALIDATION_MESSAGES.REQUIRED_PASSWORD;
		}

		const ok = !emailError && !passwordError;
		if (ok) {
			// TODO: submit to API
		}
	}

	const onEmailInput = () => {
		if (emailError) emailError = undefined;
	};
	const onPasswordInput = () => {
		if (passwordError) passwordError = undefined;
	};
</script>

<AuthLayout
	title="Welcome Back"
	description="Welcome back, please enter your details."
	footerText="Don't have an account?"
	footerLinkText="Register"
	footerHref="register"
>
	<form
		class="flex flex-col gap-3"
		novalidate
		on:invalid|preventDefault
		on:submit|preventDefault={validateAndSubmit}
	>
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
			labelLinkText="Forgot Password"
			labelLinkHref="forgot-password"
			placeholder="Type password…"
			bind:value={password}
			error={passwordError}
			on:input={onPasswordInput}
		/>

		<Button variant="primary" full type="submit" ariaLabel="Sign In" disabled={!canSubmit}>
			Sign In
		</Button>
		<Divider text="or" />
		<Button variant="outline" full type="button" ariaLabel="Sign in with Google">
			<span slot="icon"><GoogleIcon className="size-5" /></span>
			Sign in with Google
		</Button>
	</form>
</AuthLayout>
