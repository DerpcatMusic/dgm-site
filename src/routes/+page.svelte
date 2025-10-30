<script lang="ts">
	import { artists, loadArtists, artistsLoading } from '../lib/stores/artists.js';
	import Carousel from '../lib/components/Carousel.svelte';
	import ArtistCard from '../lib/components/ArtistCard.svelte';
	import ArtistModal from '../lib/components/ArtistModal.svelte';
	import Button from '../lib/components/Button.svelte';
	import type { Artist } from '../lib/types/index.js';
	import { fly, fade } from 'svelte/transition';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
	let selectedArtist: Artist | null = $state(null);
	let showModal = $state(false);

	$effect(() => {
		if (data.kv) {
			loadArtists(data.kv);
		} else {
			loadArtists();
		}
	});

	function handleArtistClick(artist: Artist) {
		selectedArtist = artist;
		showModal = true;
	}

	function handleCloseModal() {
		showModal = false;
		selectedArtist = null;
	}
</script>

<main class="min-h-screen">
	<!-- Hero Section - Full Black Screen with Sticky Effect -->
	<section
		class="relative min-h-screen flex items-center justify-center bg-neo-black text-white sticky top-0 z-10"
		transition:fly={{ y: -50, duration: 800 }}
	>
		<div class="max-w-4xl mx-auto text-center px-8">
			<h1
				class="text-8xl font-black mb-8 text-white uppercase tracking-wider"
				transition:fly={{ delay: 200, duration: 600 }}
			>
				Dolmen Gate Media
			</h1>
			<p
				class="text-2xl mb-12 text-neo-white font-bold uppercase tracking-wider"
				transition:fade={{ delay: 400, duration: 600 }}
			>
				Discover extraordinary artists and their unique sounds. Where music meets innovation.
			</p>
			<div class="flex justify-center space-x-8" transition:fade={{ delay: 600, duration: 600 }}>
				<Button
					variant="primary"
					size="lg"
					onclick={() =>
						document.querySelector('#artists-section')?.scrollIntoView({ behavior: 'smooth' })}
				>
					<span class="text-white font-black text-2xl uppercase tracking-wider"
						>Explore Artists</span
					>
				</Button>
				<Button variant="secondary" size="lg">
					<span class="text-white font-black text-2xl uppercase tracking-wider">Learn More</span>
				</Button>
			</div>
		</div>
	</section>

	<!-- Artists Carousel Section - Full White Screen with Sticky Effect -->
	<section
		id="artists-section"
		class="min-h-screen flex items-center justify-center bg-neo-white text-black py-24 sticky top-0 z-20"
		transition:fade={{ duration: 800 }}
	>
		<div class="max-w-6xl mx-auto text-center px-8">
			<h2
				class="text-6xl font-black mb-16 uppercase tracking-wider"
				transition:fade={{ delay: 200, duration: 600 }}
			>
				Featured Artists
			</h2>

			{#if $artistsLoading}
				<div transition:fade={{ duration: 300 }}>
					<p class="text-2xl font-black uppercase tracking-wider">Loading artists...</p>
				</div>
			{:else if $artists.length > 0}
				<div transition:fly={{ y: 50, delay: 300, duration: 800 }}>
					<Carousel
						items={$artists}
						autoPlay={true}
						autoPlayInterval={4000}
						showArrows={true}
						showDots={true}
						infinite={true}
					>
						{#snippet children(artist: Artist, index: number)}
							<div class="px-6">
								<ArtistCard {artist} onClick={handleArtistClick} />
							</div>
						{/snippet}
					</Carousel>
				</div>
			{:else}
				<div transition:fade={{ duration: 500 }}>
					<p class="text-2xl font-black uppercase tracking-wider">
						No artists available at the moment.
					</p>
				</div>
			{/if}
		</div>
	</section>
</main>

<!-- Artist Modal -->
{#if showModal && selectedArtist}
	<ArtistModal artist={selectedArtist} isOpen={showModal} on:close={handleCloseModal} />
{/if}

<style>
	/* Additional custom styles if needed */
</style>
