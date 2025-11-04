<script lang="ts">
	import Checkbox from '$lib/components/general/Checkbox.svelte';
	import TableTabs from './TableTabs.svelte';
	import TableRow from './TableRow.svelte';
	import Pagination from './Pagination.svelte';
	import ChevronUp from '$lib/icons/ChevronUp.svelte';
	import ChevronDown from '$lib/icons/ChevronDown.svelte';
	import type { TableColumn, TableTab } from '$lib/types/ui';
	import Dropdown from '../general/Dropdown.svelte';

	type T = $$Generic<Record<string, unknown>>;

	interface SortableItem {
		id: string;
		[key: string]: unknown;
	}

	export let data: (T & SortableItem)[] = [];
	export let columns: TableColumn<T>[];
	export let tabs: TableTab[] = [];
	export let activeTab: string = 'all';
	export let showCheckboxes = true;
	export let showPagination = true;
	let itemsPerPage = 5;
	export let currentPage = 1;
	let selectedItems: string[] = [];
	let sortColumn: string | null = null;
	let sortDirection: 'asc' | 'desc' = 'asc';

	// Callback for delete events
	export let onDelete: ((item: T & SortableItem) => void) | undefined = undefined;

	// Callback for favorite toggle events
	export let onToggleFavorite: ((item: T & SortableItem) => void) | undefined = undefined;

	$: allSelected = data.length > 0 && selectedItems.length === data.length;
	$: sortedData = sortData(data, sortColumn, sortDirection);
	$: totalPages = Math.ceil(sortedData.length / itemsPerPage);
	$: paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	function getItemId(item: T & SortableItem): string {
		return item.id || '';
	}

	function sortData(
		data: (T & SortableItem)[],
		column: string | null,
		direction: 'asc' | 'desc'
	): (T & SortableItem)[] {
		if (!column) return data;

		return [...data].sort((a, b) => {
			const aVal = a[column];
			const bVal = b[column];
			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return 1;
			if (bVal == null) return -1;
			let comparison = 0;
			if (typeof aVal === 'number' && typeof bVal === 'number') {
				comparison = aVal - bVal;
			} else {
				const aStr = String(aVal).toLowerCase();
				const bStr = String(bVal).toLowerCase();
				comparison = aStr.localeCompare(bStr);
			}

			return direction === 'asc' ? comparison : -comparison;
		});
	}

	function toggleAll() {
		if (allSelected) {
			selectedItems = [];
		} else {
			selectedItems = data.map((item) => getItemId(item)).filter(Boolean);
		}
	}

	function toggleRow(id: string) {
		selectedItems = selectedItems.includes(id)
			? selectedItems.filter((item) => item !== id)
			: [...selectedItems, id];
	}

	function handleSort(columnKey: string) {
		if (sortColumn === columnKey) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = columnKey;
			sortDirection = 'asc';
		}
		currentPage = 1;
	}

	function handleTabChange(tabValue: string) {
		activeTab = tabValue;
		currentPage = 1;
	}
	const itemsPerPageOptions = [
		{ label: '5', value: 5 },
		{ label: '10', value: 10 },
		{ label: '25', value: 25 },
		{ label: '50', value: 50 }
	];

	function handleItemsPerPageChange(n: number) {
		itemsPerPage = n;
		currentPage = 1;
	}
</script>

<div class="flex w-full flex-col items-start gap-4">
	<div class="flex w-full items-center justify-between">
		{#if tabs.length > 0}
			<TableTabs {tabs} {activeTab} onChange={handleTabChange} />
		{/if}

		<Dropdown
			bind:value={itemsPerPage}
			options={itemsPerPageOptions}
			label="Show"
			id="items-per-page"
			stacked={false}
			onChange={(v) => handleItemsPerPageChange(typeof v === 'string' ? Number(v) : v)}
		/>
	</div>

	<div class="w-full overflow-x-auto">
		<table class="w-full border-collapse" style="table-layout: auto;">
			<colgroup>
				{#if showCheckboxes}
					<col style="width: 48px;" />
				{/if}
				{#each columns as column (column.key)}
					<col style="width: {column.width || 'auto'};" />
				{/each}
				<col style="width: 80px;" />
			</colgroup>
			<thead>
				<tr class="border-b border-[var(--color-black-50)]">
					{#if showCheckboxes}
						<th class="px-4 py-3 text-left">
							<Checkbox
								id="select-all"
								checked={allSelected}
								on:change={toggleAll}
								className="pointer-events-auto"
							/>
						</th>
					{/if}

					{#each columns as column (column.key)}
						<th class="px-4 py-3 text-left">
							<button
								class="flex items-center gap-2 text-[12px] font-medium tracking-wide whitespace-nowrap text-[var(--color-black-200)] uppercase
									{column.sortable ? 'cursor-pointer hover:text-[var(--color-black-300)]' : 'cursor-default'}"
								on:click={() => column.sortable && handleSort(column.key)}
								disabled={!column.sortable}
							>
								{column.label}
								{#if column.sortable}
									<span class="flex items-center">
										{#if sortColumn === column.key}
											{#if sortDirection === 'asc'}
												<ChevronUp className="w-5 h-5" />
											{:else}
												<ChevronDown className="w-5 h-5" />
											{/if}
										{:else}
											<ChevronDown className="w-5 h-5 opacity-40" />
										{/if}
									</span>
								{/if}
							</button>
						</th>
					{/each}

					<th class="px-4 py-3 text-left">
						<span class="sr-only">Delete</span>
					</th>
				</tr>
			</thead>

			<tbody>
				{#each paginatedData as item (getItemId(item))}
					<TableRow
						{item}
						{columns}
						{showCheckboxes}
						selected={selectedItems.includes(getItemId(item))}
						onToggle={toggleRow}
						{onToggleFavorite}
						onDelete={(item) => {
							console.log('TABLE: Delete triggered for item:', item);
							// Call the parent's delete callback if provided
							if (onDelete) {
								onDelete(item);
							}

							// Also remove from local state for immediate UI feedback
							const id = getItemId(item);
							selectedItems = selectedItems.filter((selectedId) => selectedId !== id);
							data = data.filter((dataItem) => getItemId(dataItem) !== id);
						}}
					/>
				{/each}

				{#if paginatedData.length === 0}
					<tr>
						<td colspan={columns.length + (showCheckboxes ? 2 : 1)} class="px-4 py-12 text-center">
							<p class="text-[14px] text-[var(--color-black-200)]">No items found</p>
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	{#if showPagination && totalPages > 1}
		<Pagination
			{currentPage}
			{totalPages}
			totalItems={sortedData.length}
			{itemsPerPage}
			onPageChange={(page) => (currentPage = page)}
		/>
	{/if}
</div>
