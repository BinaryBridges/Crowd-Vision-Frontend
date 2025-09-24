<script lang="ts">
	import AuthFrame from "$lib/components/auth/AuthFrame.svelte";

  let email = '';
  let password = '';
  let confirm = '';
  const submit = () => {};
</script>

<AuthFrame
  title="Create your account"
  description="Join us in a minute. Just a few details to get started."
>
  <form class="space-y-4" on:submit|preventDefault={submit}>
    <label class="block">
      <span class="mb-2 block text-sm font-medium text-zinc-700">Email</span>
      <input
        class="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        type="email" bind:value={email} placeholder="you@example.com" required
      />
    </label>

    <label class="block">
      <span class="mb-2 block text-sm font-medium text-zinc-700">Password</span>
      <input
        class="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        type="password" bind:value={password} placeholder="Type password…" required minlength="8"
      />
    </label>

    <label class="block">
      <span class="mb-2 block text-sm font-medium text-zinc-700">Confirm password</span>
      <input
        class="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        type="password" bind:value={confirm} placeholder="Re-type password…" required minlength="8"
      />
    </label>

    <button
      type="submit"
      class="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30"
    >
      Create account
    </button>

    <p class="text-center text-xs text-zinc-600">
      Already have an account?
      <a href="/auth/login" class="font-medium text-brand hover:underline">Log in</a>
    </p>
  </form>
</AuthFrame>
