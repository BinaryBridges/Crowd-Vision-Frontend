<script lang="ts">
  import AuthShell from '$lib/components/AuthShell.svelte';
  import OAuthButton from '$lib/components/OAuthButton.svelte';
  import Divider from '$lib/components/ui/Divider.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let email = '';
  let password = '';
</script>

<AuthShell title="Welcome Back" subtitle="Welcome back, please enter your details.">
  <div class="space-y-4">
    <OAuthButton provider="google" label="Sign In with Google" />
    <OAuthButton provider="facebook" label="Sign In with Facebook" />
    <Divider />

    <div class="space-y-4">
      <TextInput id="email" name="email" label="Email" type="email" placeholder="Type email…" bind:value={email} />
      <div class="grid grid-cols-1 gap-2">
        <TextInput id="password" name="password" label="Password" type="password" placeholder="Type password…" bind:value={password} />
        <div class="text-right">
          <a class="text-sm text-indigo-600 hover:underline" href="/auth/forgot-password">Forgot Password</a>
        </div>
      </div>

      <Button variant="primary">Sign In</Button>

      <p class="text-center text-sm text-zinc-500">
        Don’t have an account?
        <a class="text-indigo-600 hover:underline" href="/auth/register">Register</a>
      </p>
    </div>
  </div>
</AuthShell>