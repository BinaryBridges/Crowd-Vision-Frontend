<script lang="ts">
  import AuthShell from '$lib/components/AuthShell.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let email = '';
</script>

<AuthShell title="Forgot Password" subtitle="Enter the email address you used when joined and we’ll send reset instructions.">
  <div class="space-y-4">
    <TextInput id="fp-email" label="Email" type="email" placeholder="Type email…" bind:value={email} />
    <Button variant="primary" as="a" href="/auth/reset-success">Send Reset Instructions</Button>

    <p class="text-center text-sm text-zinc-500">
      Back to sign in page? <a class="text-indigo-600 hover:underline" href="/auth/login">Back to Sign In</a>
    </p>
  </div>
</AuthShell>