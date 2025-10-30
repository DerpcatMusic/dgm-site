<script lang="ts">
	import type { Artist } from '../types/index.js';
	import { createEventDispatcher } from 'svelte';
	import { fly, fade, slide } from 'svelte/transition';
	import Modal from './Modal.svelte';

	interface Props {
		artist: Artist;
		isOpen: boolean;
	}

	let { artist, isOpen }: Props = $props();
	let modalElement: HTMLElement | undefined = $state();
	let firstFocusableElement: HTMLElement | undefined = $state();
	let lastFocusableElement: HTMLElement | undefined = $state();

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	function trapFocus(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			if (event.shiftKey) {
				if (document.activeElement === firstFocusableElement) {
					event.preventDefault();
					lastFocusableElement?.focus();
				}
			} else {
				if (document.activeElement === lastFocusableElement) {
					event.preventDefault();
					firstFocusableElement?.focus();
				}
			}
		}
	}
</script>

<Modal {isOpen} title={artist.name} size="xl" on:close={handleClose}>
	<div class="flex flex-col md:flex-row">
		<!-- Artist Image -->
		<div
			class="w-full md:w-1/2 aspect-square md:aspect-auto"
			transition:slide={{ delay: 200, duration: 400 }}
		>
			{#if artist.imageUrl}
				<img
					src={artist.imageUrl}
					alt={artist.name}
					class="w-full h-full object-cover border-4 border-black shadow-[8px_8px_0px_0px_#000000]"
					transition:fade={{ delay: 300, duration: 600 }}
				/>
			{:else}
				<div
					class="w-full h-full bg-neo-blue flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_#000000]"
					transition:fade={{ delay: 300, duration: 800 }}
				>
					<span
						class="text-white text-8xl font-black uppercase"
						transition:fly={{ delay: 400, duration: 500 }}
					>
						{artist.name.charAt(0)}
					</span>
				</div>
			{/if}
		</div>

		<!-- Artist Details -->
		<div class="w-full md:w-1/2 p-8 flex flex-col" transition:slide={{ delay: 300, duration: 500 }}>
			{#if artist.bio}
				<p
					class="text-neo-gray font-bold text-xl mb-8 flex-grow"
					transition:fade={{ delay: 500, duration: 400 }}
				>
					{artist.bio}
				</p>
			{/if}

			{#if artist.genre && artist.genre.length > 0}
				<div class="mb-8" transition:fade={{ delay: 600, duration: 400 }}>
					<h3 class="text-2xl font-black uppercase tracking-wider text-black mb-4">Genres</h3>
					<div class="flex flex-wrap gap-3" role="list" aria-label="Artist genres">
						{#each artist.genre as genre, index}
							<span
								class="px-6 py-3 bg-neo-green text-black text-lg font-black uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all duration-100"
								role="listitem"
								transition:fly={{ delay: 700 + index * 100, duration: 300 }}
							>
								{genre}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			{#if artist.socialLinks && artist.socialLinks.length > 0}
				<div transition:fade={{ delay: 800, duration: 400 }}>
					<h3 class="text-2xl font-black uppercase tracking-wider text-black mb-4">Connect</h3>
					<div class="flex gap-6" role="list" aria-label="Social media links">
						{#each artist.socialLinks as link, index}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-neo-blue hover:text-neo-blue-light font-black text-xl uppercase tracking-wider hover:scale-110 transition-all duration-100 hover:underline"
								aria-label="Visit {link.platform} profile (opens in new tab)"
								transition:slide={{ delay: 900 + index * 100, duration: 300 }}
							>
								{link.platform}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</Modal>
