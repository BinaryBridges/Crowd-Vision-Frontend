<script lang="ts">
	export let currentPage = 1;
	export let totalPages = 1;
	export let totalItems = 0;
	export let itemsPerPage = 10;
	export let onPageChange: (page: number) => void;

	$: startItem = (currentPage - 1) * itemsPerPage + 1;
	$: endItem = Math.min(currentPage * itemsPerPage, totalItems);
	$: pages = generatePages(currentPage, totalPages);

	function generatePages(current: number, total: number): (number | string)[] {
		const pages: (number | string)[] = [];

		if (total <= 7) {
			for (let i = 1; i <= total; i++) {
				pages.push(i);
			}
			return pages;
		}

		pages.push(1);

		if (current > 3) {
			pages.push('...');
		}

		for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
			pages.push(i);
		}

		if (current < total - 2) {
			pages.push('...');
		}

		pages.push(total);

		return pages;
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	}
</script>

<div class="flex items-center justify-between">
	<p class="text-[14px] text-[var(--color-black-300)]">
		Showing {startItem}–{endItem} from {totalItems}
	</p>

	<div class="flex items-center gap-2">
		<button
			class="flex size-8 items-center justify-center rounded-lg border border-[var(--color-black-50)] bg-[var(--color-white)] transition-colors hover:bg-[var(--color-black-25)] disabled:cursor-not-allowed disabled:opacity-40"
			on:click={() => goToPage(currentPage - 1)}
			disabled={currentPage === 1}
			aria-label="Previous page"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M10 12L6 8L10 4"
					stroke="var(--color-black-400)"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>

		{#each pages as page, index (index)}
			{#if page === '...'}
				<span class="px-2 text-[14px] text-[var(--color-black-200)]">...</span>
			{:else}
				<button
					class="flex size-8 items-center justify-center rounded-lg text-[14px] font-medium transition-colors
						{currentPage === page
						? 'bg-[var(--color-black-600)] text-[var(--color-white)]'
						: 'border border-[var(--color-black-50)] bg-[var(--color-white)] text-[var(--color-black-400)] hover:bg-[var(--color-black-25)]'}"
					on:click={() => goToPage(page as number)}
				>
					{page}
				</button>
			{/if}
		{/each}

		<button
			class="flex size-8 items-center justify-center rounded-lg border border-[var(--color-black-50)] bg-[var(--color-white)] transition-colors hover:bg-[var(--color-black-25)] disabled:cursor-not-allowed disabled:opacity-40"
			on:click={() => goToPage(currentPage + 1)}
			disabled={currentPage === totalPages}
			aria-label="Next page"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M6 4L10 8L6 12"
					stroke="var(--color-black-400)"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>
</div>
