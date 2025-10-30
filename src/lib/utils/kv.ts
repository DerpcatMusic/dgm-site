import type { Artist } from '../types/index.js';
import type { KVNamespace } from '@cloudflare/workers-types';

export async function createArtist(kv: KVNamespace, artist: Artist): Promise<void> {
	await kv.put(artist.id, JSON.stringify(artist));
}

export async function getArtist(kv: KVNamespace, id: string): Promise<Artist | null> {
	const data = await kv.get(id);
	return data ? JSON.parse(data) : null;
}

export async function updateArtist(kv: KVNamespace, artist: Artist): Promise<void> {
	await kv.put(artist.id, JSON.stringify(artist));
}

export async function deleteArtist(kv: KVNamespace, id: string): Promise<void> {
	await kv.delete(id);
}
