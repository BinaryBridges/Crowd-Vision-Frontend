<script lang="ts">
  import AuthShell from '$lib/components/AuthShell.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let pass1 = '';
  let pass2 = '';
</script>

<AuthShell title="Reset Password" subtitle="Almost done! Enter your new password below and confirm it to secure your account." cardClass="max-w-md">
  <div class="space-y-4">
    <TextInput id="rp-pass1" label="Password" type="password" placeholder="Type password…" bind:value={pass1} />
    <TextInput id="rp-pass2" label="Password" type="password" placeholder="Type password…" bind:value={pass2} />
    <Button variant="primary" as="a" href="/auth/reset-success">Save Password</Button>

    <p class="text-center text-sm text-zinc-500">
      Don’t have an account? <a class="text-indigo-600 hover:underline" href="/auth/register">Register</a>
    </p>
  </div>
</AuthShell>