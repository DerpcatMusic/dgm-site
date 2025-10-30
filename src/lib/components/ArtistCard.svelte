<script lang="ts">
	import type { Artist } from '../types/index.js';
	import Card from './Card.svelte';

	interface Props {
		artist: Artist;
		onClick?: (artist: Artist) => void;
	}

	let { artist, onClick }: Props = $props();
	let cardElement: HTMLElement;

	function handleClick() {
		onClick?.(artist);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}
</script>

<Card variant="elevated" padding="none">
	<button
		class="relative overflow-hidden cursor-pointer group w-full h-full border-0 bg-transparent p-0 hover:scale-105 transition-all duration-300 active:scale-95"
		onclick={handleClick}
		onkeydown={handleKeyDown}
		type="button"
		bind:this={cardElement}
		tabindex="0"
		aria-label="View details for artist {artist.name}"
		aria-describedby="artist-description-{artist.id}"
	>
		<!-- Artist Image -->
		<div class="relative aspect-square group-hover:scale-105 transition-transform duration-300">
			{#if artist.imageUrl}
				<img
					src={artist.imageUrl}
					alt={artist.name}
					class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
				/>
			{:else}
				<div
					class="w-full h-full bg-neo-blue flex items-center justify-center group-hover:bg-neo-blue-light transition-all duration-300"
				>
					<span
						class="text-white text-6xl font-black group-hover:scale-125 group-hover:rotate-3 transition-transform duration-300 uppercase tracking-wider"
					>
						{artist.name.charAt(0)}
					</span>
				</div>
			{/if}

			<!-- Name Overlay -->
			<div
				class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
			>
				<h3
					class="text-white text-2xl font-black drop-shadow-lg transform translate-y-5 group-hover:translate-y-0 transition-transform duration-300 delay-100 uppercase tracking-wider"
					id="artist-description-{artist.id}"
				>
					{artist.name}
				</h3>
			</div>
		</div>
	</button>
</Card>
