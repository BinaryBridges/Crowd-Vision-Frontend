<script lang="ts">
  import AuthShell from '$lib/components/AuthShell.svelte';
  import Button from '$lib/components/ui/Button.svelte';
</script>

<AuthShell title="" subtitle="">
  <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
    <div class="mx-auto mb-4 grid size-10 place-items-center rounded-full bg-emerald-100">
      <svg viewBox="0 0 24 24" class="size-6 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <h2 class="text-lg font-semibold">Password Reset Successful</h2>
    <p class="mt-1 text-sm text-zinc-600">
      Your password has been successfully reset. You can now log in with your new password
    </p>

    <div class="mt-4">
      <Button as="a" variant="secondary" href="/auth/login" className="w-auto px-5">Sign In Now</Button>
    </div>
  </div>
</AuthShell>