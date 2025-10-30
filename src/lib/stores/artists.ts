import { writable } from 'svelte/store';
import type { Artist } from '../types/index.js';
import {
	createArtist as kvCreateArtist,
	getArtist as kvGetArtist,
	updateArtist as kvUpdateArtist,
	deleteArtist as kvDeleteArtist
} from '../utils/kv.js';
import type { KVNamespace } from '@cloudflare/workers-types';

// Store for list of artists
export const artists = writable<Artist[]>([]);

// Store for current selected artist
export const currentArtist = writable<Artist | null>(null);

// Store for loading state
export const artistsLoading = writable<boolean>(false);

// Function to load all artists (assuming we have a way to list keys, but KV doesn't support listing easily)
// For now, this is a placeholder; in practice, you might need to maintain an index or use a different storage
export async function loadArtists(kv?: KVNamespace): Promise<void> {
	artistsLoading.set(true);
	try {
		// Placeholder: Since KV doesn't support listing, this might need adjustment
		// Perhaps load from a known list or use a different approach
		// For demonstration, load sample artists
		const artistList: Artist[] = [
			{
				id: '1',
				name: 'Artist One',
				bio: 'A talented musician from the Dolmen Gate Media roster.',
				imageUrl: 'https://via.placeholder.com/400x400?text=Artist+One',
				genre: ['Rock', 'Indie'],
				socialLinks: [
					{ platform: 'instagram', url: 'https://instagram.com/artistone' },
					{ platform: 'website', url: 'https://artistone.com' }
				]
			},
			{
				id: '2',
				name: 'Artist Two',
				bio: 'Innovative artist pushing boundaries in electronic music.',
				imageUrl: 'https://via.placeholder.com/400x400?text=Artist+Two',
				genre: ['Electronic', 'Experimental'],
				socialLinks: [{ platform: 'twitter', url: 'https://twitter.com/artisttwo' }]
			},
			{
				id: '3',
				name: 'Artist Three',
				bio: 'Soulful singer-songwriter with a unique voice.',
				imageUrl: 'https://via.placeholder.com/400x400?text=Artist+Three',
				genre: ['Folk', 'Acoustic'],
				socialLinks: [{ platform: 'youtube', url: 'https://youtube.com/artistthree' }]
			}
		];
		artists.set(artistList);
	} catch (error) {
		console.error('Failed to load artists:', error);
	} finally {
		artistsLoading.set(false);
	}
}

// Function to load a specific artist
export async function loadArtist(kv: KVNamespace, id: string): Promise<void> {
	artistsLoading.set(true);
	try {
		const artist = await kvGetArtist(kv, id);
		currentArtist.set(artist);
	} catch (error) {
		console.error('Failed to load artist:', error);
	} finally {
		artistsLoading.set(false);
	}
}

// Function to create a new artist
export async function createArtist(kv: KVNamespace, artist: Artist): Promise<void> {
	try {
		await kvCreateArtist(kv, artist);
		// Update the artists list if needed
		artists.update((list) => [...list, artist]);
	} catch (error) {
		console.error('Failed to create artist:', error);
		throw error;
	}
}

// Function to update an artist
export async function updateArtist(kv: KVNamespace, artist: Artist): Promise<void> {
	try {
		await kvUpdateArtist(kv, artist);
		// Update in the list
		artists.update((list) => list.map((a) => (a.id === artist.id ? artist : a)));
		currentArtist.update((curr) => (curr?.id === artist.id ? artist : curr));
	} catch (error) {
		console.error('Failed to update artist:', error);
		throw error;
	}
}

// Function to delete an artist
export async function deleteArtist(kv: KVNamespace, id: string): Promise<void> {
	try {
		await kvDeleteArtist(kv, id);
		// Remove from the list
		artists.update((list) => list.filter((a) => a.id !== id));
		currentArtist.update((curr) => (curr?.id === id ? null : curr));
	} catch (error) {
		console.error('Failed to delete artist:', error);
		throw error;
	}
}
