<script lang="ts">
	import Checkbox from '$lib/components/general/Checkbox.svelte';
	import DeleteIcon from '$lib/icons/DeleteIcon.svelte';
	import DeleteConfirmationModal from '$lib/components/general/DeleteConfirmationModal.svelte';
	import FavoriteCell from './FavoriteCell.svelte';
	import type { TableColumn } from '$lib/types/ui';

	type T = $$Generic<Record<string, unknown>>;

	interface IdentifiableItem {
		id: string;
		[key: string]: unknown;
	}

	export let item: T & IdentifiableItem;
	export let columns: TableColumn<T>[];
	export let showCheckboxes = true;
	export let selected = false;
	export let onToggle: (id: string) => void;
	export let onDelete: (item: T & IdentifiableItem) => void;
	export let onToggleFavorite: ((item: T & IdentifiableItem) => void) | undefined = undefined;

	let showDeleteModal = false;

	function handleDeleteClick() {
		showDeleteModal = true;
	}

	function handleDeleteConfirm() {
		onDelete(item);
		showDeleteModal = false;
	}

	function handleDeleteCancel() {
		showDeleteModal = false;
	}
</script>

<tr
	class="group border-b border-[var(--color-black-50)] transition-colors hover:bg-[var(--color-black-25)]"
>
	{#if showCheckboxes}
		<td class="px-4 py-4">
			<Checkbox id={`row-${item.id}`} checked={selected} on:change={() => onToggle(item.id)} />
		</td>
	{/if}

	{#each columns as column (column.key)}
		<td class="px-4 py-4">
			{#if column.component}
				{@const componentProps =
					column.component === FavoriteCell ? { item, onToggleFavorite } : { item }}
				<svelte:component this={column.component} {...componentProps} />
			{:else}
				<span class="text-[14px] text-[var(--color-black-400)]">
					{item[column.key] ?? '-'}
				</span>
			{/if}
		</td>
	{/each}

	<td class="px-4 py-4">
		<button
			class="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-red-50)]"
			on:click={handleDeleteClick}
			aria-label="Delete row"
		>
			<DeleteIcon
				className="w-5 h-5"
				colorClass="text-[var(--color-red-500)] hover:text-[var(--color-red-500)]"
			/>
		</button>
	</td>
</tr>

<DeleteConfirmationModal
	bind:isOpen={showDeleteModal}
	title="Delete Event?"
	description="Do you want to delete this event? This action can't be undone"
	onConfirm={handleDeleteConfirm}
	onCancel={handleDeleteCancel}
/>
