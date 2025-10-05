<script lang="ts">
	type T = $$Generic;

	interface FavoriteItem {
		isFavorite: boolean;
	}

	export let item: T & FavoriteItem;
	import StarFullIcon from '$lib/icons/StarFullIcon.svelte';
	import StarEmptyIcon from '$lib/icons/StarEmptyIcon.svelte';
	import { writable } from 'svelte/store';
	const favoriteState = writable(item.isFavorite);

	function toggleFavorite() {
		$favoriteState = !$favoriteState;
		item.isFavorite = $favoriteState;
	}
</script>

<button
	class="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-purple-50)]"
	on:click={toggleFavorite}
	aria-label={$favoriteState ? 'Remove from favorites' : 'Add to favorites'}
>
	{#if $favoriteState}
		<StarFullIcon className="w-5 h-5" colorClass="text-[var(--color-purple-500)]" />
	{:else}
		<StarEmptyIcon className="w-5 h-5" colorClass="text-[var(--color-black-400)]" />
	{/if}
</button>
