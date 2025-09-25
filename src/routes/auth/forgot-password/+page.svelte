<script lang="ts">
	import AuthLayout from '$lib/components/auth/AuthLayout.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import TextInput from '$lib/components/general/TextInput.svelte';
	import { EMAIL_REGEX, VALIDATION_MESSAGES } from '$lib/constants';

	let email = '';
	let emailError: string | undefined;

	$: canSubmit = email.trim().length > 0;

	function validateAndSubmit() {
		emailError = undefined;

		if (!EMAIL_REGEX.test(email.trim())) {
			emailError = VALIDATION_MESSAGES.INVALID_EMAIL;
		}

		const ok = !emailError;
		if (ok) {
			// TODO: submit to API
		}
	}

	const onEmailInput = () => {
		if (emailError) emailError = undefined;
	};
</script>

<AuthLayout
	title="Forgot Password"
	description="Enter the email address you used when joined and we'll send reset instructions to reset your password."
	footerText="Back to sign in page?"
	footerLinkText="Back to Sign in"
	footerHref="login"
>
	<form
		class="flex flex-col gap-6"
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

		<Button
			variant="primary"
			full
			type="submit"
			ariaLabel="Send Reset Instructions"
			disabled={!canSubmit}
		>
			Send Reset Instructions
		</Button>
	</form>
</AuthLayout>
