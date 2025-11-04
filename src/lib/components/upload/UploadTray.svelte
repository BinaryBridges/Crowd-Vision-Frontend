<script lang="ts">
	import { uploadStore, closeTray } from '$lib/upload/uploadStore';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	$: state = $uploadStore;
</script>

{#if state.visible && state.tasks.length > 0}
	<div
		class="fixed right-4 bottom-4 z-50 w-[360px] rounded-lg border border-[var(--color-black-50)] bg-[var(--color-white)] shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
	>
		<div class="flex items-center justify-between px-4 py-3">
			<div class="text-[14px] font-semibold text-[var(--color-black-600)]">
				Uploading {state.tasks.filter((t) => t.status !== 'done').length} item{state.tasks.filter(
					(t) => t.status !== 'done'
				).length === 1
					? ''
					: 's'}
			</div>
			<button
				aria-label="Close"
				title="Close"
				class="cursor-pointer rounded p-1 text-[var(--color-black-300)] hover:bg-[var(--color-black-25)] hover:text-[var(--color-black-400)]"
				on:click={closeTray}
			>
				<CloseIcon className="w-4 h-4" />
			</button>
		</div>
		<div class="max-h-[280px] overflow-y-auto px-4 pb-4">
			{#each state.tasks as t (t.id)}
				<div class="mb-3 last:mb-0">
					<div class="truncate text-[13px] text-[var(--color-black-600)]">{t.name}</div>
					<div class="mt-1 h-2 w-full overflow-hidden rounded bg-[var(--color-black-50)]">
						<div class="h-full bg-[var(--color-purple-500)]" style={`width: ${t.progress}%;`}></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
