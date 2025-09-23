<script lang="ts">
  import AuthShell from '$lib/components/AuthShell.svelte';
  import OAuthButton from '$lib/components/OAuthButton.svelte';
  import Divider from '$lib/components/ui/Divider.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import Checkbox from '$lib/components/ui/Checkbox.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let name = '';
  let username = '';
  let email = '';
  let password = '';
  let agree = false;
</script>

<AuthShell title="Welcome to Nexlab" subtitle="Register now and start your adventure.">
  <div class="space-y-4">
    <OAuthButton provider="google" label="Register with Google" />
    <OAuthButton provider="facebook" label="Register with Facebook" />
    <Divider />

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextInput id="name" label="Name" placeholder="Type name…" bind:value={name} />
      <TextInput id="username" label="Username" placeholder="Type username…" bind:value={username} />
    </div>

    <TextInput id="reg-email" label="Email" type="email" placeholder="Type email…" bind:value={email} />
    <TextInput id="reg-password" label="Password" type="password" placeholder="Type password…" bind:value={password} />

    <Checkbox id="agree" bind:checked={agree} label={'I agree to all the <a class="text-indigo-600 underline">Term &amp; Privacy Policy</a>'} />

    <Button variant="primary">Register</Button>

    <p class="text-center text-sm text-zinc-500">
      Already have an account?
      <a class="text-indigo-600 hover:underline" href="/auth/login">Sign In</a>
    </p>
  </div>
</AuthShell>