<script lang="ts">
	import Button from '$lib/components/general/Button.svelte';
	import AlertIcon from '$lib/icons/AlertIcon.svelte';

	export let isOpen = false;
	export let title = 'Delete Project?';
	export let description = "Do you want to delete this project? This action can't be undone";
	export let onCancel: () => void;
	export let onConfirm: () => void;

	function handleCancel() {
		isOpen = false;
		onCancel();
	}

	function handleConfirm() {
		isOpen = false;
		onConfirm();
	}

	function handleBackdropClick(event: MouseEvent & { currentTarget: HTMLDivElement }) {
		if (event.target === event.currentTarget) {
			handleCancel();
		}
	}

	function handleBackdropKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleCancel();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleCancel();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
		on:click={handleBackdropClick}
		on:keydown={handleBackdropKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		aria-describedby="modal-description"
		tabindex="0"
	>
		<div
			class="relative flex w-full max-w-[520px] flex-col items-center gap-6 rounded-[var(--radius-20)] border border-[var(--color-black-50)] bg-white p-8 shadow-[0_8px_30px_0_rgba(77,84,100,0.2)]"
			style="background: linear-gradient(180deg, rgba(248, 248, 250, 0.00) 0%, #FFF 100%), linear-gradient(124deg, rgba(229, 43, 22, 0.25) 29.79%, rgba(252, 243, 219, 0.25) 89%);"
		>
			<div
				class="flex size-16 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_0_rgba(229,43,22,0.15)]"
				role="img"
				aria-label="Alert icon"
			>
				<AlertIcon className="w-8 h-8" colorClass="text-[var(--color-red-500)]" />
			</div>

			<h2
				id="modal-title"
				class="text-center text-[20px] font-semibold text-[var(--color-black-600)]"
			>
				{title}
			</h2>

			<p
				id="modal-description"
				class="text-center text-[16px] font-normal text-[var(--color-black-300)]"
			>
				{description}
			</p>

			<div class="flex w-full gap-3">
				<Button variant="outline" full ariaLabel="Cancel deletion" on:click={handleCancel}>
					Cancel
				</Button>

				<Button variant="danger" full ariaLabel="Confirm deletion" on:click={handleConfirm}>
					Yes, Delete
				</Button>
			</div>
		</div>
	</div>
{/if}
