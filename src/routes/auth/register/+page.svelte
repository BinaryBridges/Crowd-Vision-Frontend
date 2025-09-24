<script lang="ts">
	import AuthLayout from '$lib/components/auth/AuthLayout.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import GoogleIcon from '$lib/icons/GoogleIcon.svelte';

	let email = '';
	let password = '';
	let confirm = '';
	const submit = () => {};
</script>

<AuthLayout title="Welcome to Crowd Vision" description="Register now and start your adventure.">
	<form class="space-y-4" on:submit|preventDefault={submit}>
		<label class="block">
			<span class="mb-2 block text-sm font-medium text-zinc-700">Email</span>
			<input
				class="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				required
			/>
		</label>

		<label class="block">
			<span class="mb-2 block text-sm font-medium text-zinc-700">Password</span>
			<input
				class="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
				type="password"
				bind:value={password}
				placeholder="Type password…"
				required
				minlength="8"
			/>
		</label>

		<label class="block">
			<span class="mb-2 block text-sm font-medium text-zinc-700">Confirm password</span>
			<input
				class="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
				type="password"
				bind:value={confirm}
				placeholder="Re-type password…"
				required
				minlength="8"
			/>
		</label>

		<Button variant="primary" full type="submit" ariaLabel="Register">Register</Button>

		<Button variant="outline" full type="button" ariaLabel="Register with Google">
			<span slot="icon"><GoogleIcon className="size-5" /></span>
			Register with Google
		</Button>
	</form>
</AuthLayout>
