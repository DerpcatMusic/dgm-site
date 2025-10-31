<script lang="ts">
	import { onMount } from 'svelte';
	import {
		artists,
		loadArtists,
		createArtist,
		updateArtist,
		deleteArtist,
		artistsLoading
	} from '../stores/artists.js';
	import { currentUser, isAuthenticated } from '../stores/auth.js';
	import type { Artist, SocialLink } from '../types/index.js';
	import { fly, fade } from 'svelte/transition';
	import type { KVNamespace } from '@cloudflare/workers-types';
	import Button from './Button.svelte';
	import Card from './Card.svelte';
	import Input from './Input.svelte';
	import Modal from './Modal.svelte';

	let kv: KVNamespace | undefined = $state();
	let showForm = $state(false);
	let editingArtist: Artist | null = $state(null);
	let formData: Artist = $state({
		id: '',
		name: '',
		bio: '',
		imageUrl: '',
		genre: [],
		socialLinks: []
	});
	let genreInput = $state('');
	let socialPlatform = $state('');
	let socialUrl = $state('');
	let imageFile: File | null = $state(null);
	let dragOver = $state(false);
	let modalElement: HTMLElement | undefined = $state();
	let firstFocusableElement: HTMLElement | undefined = $state();
	let lastFocusableElement: HTMLElement | undefined = $state();

	onMount(async () => {
		// Check authentication
		if (!$isAuthenticated || ($currentUser?.role && $currentUser.role !== 'admin')) {
			// Redirect or show error - for now, assume admin access
			console.log('Admin access required');
		}
		if (kv) {
			await loadArtists(kv);
		} else {
			await loadArtists();
		}
	});

	function resetForm() {
		formData = {
			id: '',
			name: '',
			bio: '',
			imageUrl: '',
			genre: [],
			socialLinks: []
		};
		genreInput = '';
		socialPlatform = '';
		socialUrl = '';
		imageFile = null;
		editingArtist = null;
	}

	function openAddForm() {
		resetForm();
		formData.id = Date.now().toString();
		showForm = true;
	}

	function openEditForm(artist: Artist) {
		editingArtist = artist;
		formData = { ...artist };
		genreInput = '';
		socialPlatform = '';
		socialUrl = '';
		imageFile = null;
		showForm = true;
	}

	function closeForm() {
		showForm = false;
		resetForm();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeForm();
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

	function addGenre() {
		if (genreInput.trim() && !formData.genre?.includes(genreInput.trim())) {
			formData.genre = [...(formData.genre || []), genreInput.trim()];
			genreInput = '';
		}
	}

	function removeGenre(genre: string) {
		formData.genre = formData.genre?.filter((g) => g !== genre);
	}

	function addSocialLink() {
		if (socialPlatform.trim() && socialUrl.trim()) {
			const newLink: SocialLink = {
				platform: socialPlatform.trim(),
				url: socialUrl.trim()
			};
			formData.socialLinks = [...(formData.socialLinks || []), newLink];
			socialPlatform = '';
			socialUrl = '';
		}
	}

	function removeSocialLink(index: number) {
		formData.socialLinks = formData.socialLinks?.filter((_, i) => i !== index);
	}

	async function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			imageFile = target.files[0];
			// In a real app, you'd upload to a service like Cloudinary
			// For now, create a data URL
			const reader = new FileReader();
			reader.onload = (e) => {
				formData.imageUrl = e.target?.result as string;
			};
			reader.readAsDataURL(imageFile);
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		try {
			if (editingArtist) {
				if (kv) await updateArtist(kv, formData);
			} else {
				if (kv) await createArtist(kv, formData);
			}
			closeForm();
		} catch (error) {
			console.error('Failed to save artist:', error);
		}
	}

	async function handleDelete(artist: Artist) {
		if (confirm(`Are you sure you want to delete ${artist.name}?`)) {
			try {
				if (kv) await deleteArtist(kv, artist.id);
			} catch (error) {
				console.error('Failed to delete artist:', error);
			}
		}
	}

	function handleDragStart(event: DragEvent, index: number) {
		event.dataTransfer!.setData('text/plain', index.toString());
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		const fromIndex = parseInt(event.dataTransfer!.getData('text/plain'));
		const target = event.currentTarget as HTMLElement;
		const toIndex = Array.from(target.parentElement!.children).indexOf(target);

		if (fromIndex !== toIndex) {
			artists.update((list) => {
				const newList = [...list];
				const [moved] = newList.splice(fromIndex, 1);
				newList.splice(toIndex, 0, moved);
				return newList;
			});
		}
	}
</script>

{#if !$isAuthenticated || ($currentUser?.role && $currentUser.role !== 'admin')}
	<div class="min-h-screen bg-neo-white flex items-center justify-center p-8">
		<Card variant="elevated" padding="lg">
			<h2 class="text-3xl font-black text-black mb-6 uppercase tracking-wider">Access Denied</h2>
			<p class="text-neo-gray font-bold text-lg">You need admin privileges to access this page.</p>
		</Card>
	</div>
{:else}
	<div class="min-h-screen bg-neo-white p-8">
		<div class="max-w-7xl mx-auto">
			<div class="flex justify-between items-center mb-12">
				<h1 class="text-5xl font-black text-black uppercase tracking-wider">Artist Management</h1>
				<Button
					variant="primary"
					size="lg"
					onclick={openAddForm}
					aria-describedby="add-artist-help"
				>
					Add New Artist
				</Button>
				<div id="add-artist-help" class="sr-only">
					Opens a form to add a new artist to the management system
				</div>
			</div>

			{#if $artistsLoading}
				<div class="text-center py-12" role="status" aria-live="polite">
					<p class="text-gray-600">Loading artists...</p>
				</div>
			{:else if $artists.length === 0}
				<div class="text-center py-12" role="status">
					<p class="text-gray-600">No artists found. Add your first artist!</p>
				</div>
			{:else}
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					role="grid"
					aria-label="Artist management grid"
				>
					{#each $artists as artist, index}
						<div
							transition:fly={{ y: 20, delay: index * 100, duration: 500 }}
							draggable="true"
							ondragstart={(e: DragEvent) => handleDragStart(e, index)}
							ondragover={handleDragOver}
							ondragleave={handleDragLeave}
							ondrop={handleDrop}
							role="gridcell"
							aria-label="Artist: {artist.name}"
							tabindex="0"
						>
							<Card variant="default" padding="none">
								<div class="relative">
									<div class="aspect-square relative">
										{#if artist.imageUrl}
											<img
												src={artist.imageUrl}
												alt={artist.name}
												class="w-full h-full object-cover"
											/>
										{:else}
											<div class="w-full h-full bg-neo-blue flex items-center justify-center">
												<span class="text-white text-6xl font-black uppercase"
													>{artist.name.charAt(0)}</span
												>
											</div>
										{/if}
										<div class="absolute top-4 right-4 flex gap-3">
											<Button
												variant="secondary"
												size="sm"
												onclick={() => openEditForm(artist)}
												aria-label="Edit artist {artist.name}"
											>
												<svg
													class="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="3"
														d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
													></path>
												</svg>
											</Button>
											<Button
												variant="danger"
												size="sm"
												onclick={() => handleDelete(artist)}
												aria-label="Delete artist {artist.name}"
											>
												<svg
													class="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													aria-hidden="true"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="3"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													></path>
												</svg>
											</Button>
										</div>
									</div>
									<div class="p-6">
										<h3 class="text-2xl font-black text-black mb-3 uppercase tracking-wider">
											{artist.name}
										</h3>
										{#if artist.bio}
											<p class="text-neo-gray font-semibold text-base mb-4 line-clamp-2">
												{artist.bio}
											</p>
										{/if}
										{#if artist.genre && artist.genre.length > 0}
											<div class="flex flex-wrap gap-2 mb-4">
												{#each artist.genre as genre}
													<span
														class="px-4 py-2 bg-neo-blue text-white text-sm font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
													>
														{genre}
													</span>
												{/each}
											</div>
										{/if}
										{#if artist.socialLinks && artist.socialLinks.length > 0}
											<div class="flex gap-3">
												{#each artist.socialLinks as link}
													<a
														href={link.url}
														target="_blank"
														rel="noopener noreferrer"
														class="text-neo-blue hover:text-neo-blue-light font-bold text-lg uppercase tracking-wider transition-all duration-100 hover:scale-110"
													>
														{link.platform}
													</a>
												{/each}
											</div>
										{/if}
									</div>
								</div>
							</Card>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- Add/Edit Form Modal -->
{#if showForm}
	<Modal
		isOpen={showForm}
		title={editingArtist ? 'Edit Artist' : 'Add New Artist'}
		size="lg"
		on:close={closeForm}
	>
		<form onsubmit={handleSubmit} class="space-y-8">
			<!-- Name -->
			<Input label="Name" bind:value={formData.name} required={true} />

			<!-- Bio -->
			<div>
				<label for="bio" class="block text-xl font-black uppercase tracking-wider text-black mb-4"
					>Bio</label
				>
				<textarea
					id="bio"
					bind:value={formData.bio}
					rows="4"
					class="input-neo w-full border-4 border-black bg-white px-4 py-3 text-lg font-semibold shadow-[4px_4px_0px_0px_#000000] transition-all duration-100 focus:shadow-[2px_2px_0px_0px_#000000] focus:translate-x-1 focus:translate-y-1 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-50"
				></textarea>
			</div>

			<!-- Image Upload -->
			<div>
				<label
					for="image-upload"
					class="block text-xl font-black uppercase tracking-wider text-black mb-4">Image</label
				>
				<div
					class="border-4 border-dashed border-black bg-neo-gray p-8 text-center"
					role="region"
					aria-label="Image upload area"
				>
					{#if formData.imageUrl}
						<img
							src={formData.imageUrl}
							alt=""
							class="max-w-full h-40 object-cover mx-auto mb-6 border-4 border-black shadow-[8px_8px_0px_0px_#000000]"
						/>
					{/if}
					<input
						type="file"
						accept="image/*"
						onchange={handleImageUpload}
						class="hidden"
						id="image-upload"
						aria-describedby="image-help"
					/>
					<Button
						variant="primary"
						size="md"
						onclick={() => document.getElementById('image-upload')?.click()}
					>
						Click to upload image
					</Button>
					<div id="image-help" class="sr-only">
						Upload an image file for the artist. Supported formats: JPG, PNG, GIF
					</div>
				</div>
			</div>

			<!-- Genres -->
			<div>
				<label
					for="genres-input"
					class="block text-xl font-black uppercase tracking-wider text-black mb-4"
					id="genres-heading">Genres</label
				>
				<div class="flex gap-4 mb-4" role="group" aria-labelledby="genres-heading">
					<div id="genres-heading" class="sr-only">Add artist genres</div>
					<input
						type="text"
						id="genres-input"
						bind:value={genreInput}
						placeholder="Add genre"
						class="input-neo flex-1"
						onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
						aria-describedby="genre-help"
					/>
					<div id="genre-help" class="sr-only">Type a genre name and press Enter or click Add</div>
					<Button variant="primary" size="md" onclick={addGenre} aria-label="Add genre">Add</Button>
				</div>
				<div class="flex flex-wrap gap-3" role="list" aria-label="Selected genres">
					{#each formData.genre || [] as genre}
						<span
							class="inline-flex items-center px-4 py-2 bg-neo-blue text-white text-lg font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#000000]"
							role="listitem"
						>
							{genre}
							<button
								type="button"
								onclick={() => removeGenre(genre)}
								class="ml-3 text-white hover:text-neo-red font-black text-xl transition-colors duration-100"
								aria-label="Remove genre {genre}"
							>
								×
							</button>
						</span>
					{/each}
				</div>
			</div>

			<!-- Social Links -->
			<div>
				<label
					for="social-platform"
					class="block text-xl font-black uppercase tracking-wider text-black mb-4"
					id="social-heading">Social Links</label
				>
				<div class="grid grid-cols-2 gap-4 mb-4" role="group" aria-labelledby="social-heading">
					<div id="social-heading" class="sr-only">Add social media links</div>
					<input
						type="text"
						id="social-platform"
						bind:value={socialPlatform}
						placeholder="Platform (e.g., instagram)"
						class="input-neo"
						aria-describedby="platform-help"
					/>
					<div id="platform-help" class="sr-only">Enter social media platform name</div>
					<input
						type="url"
						bind:value={socialUrl}
						placeholder="URL"
						class="input-neo"
						aria-describedby="url-help"
					/>
					<div id="url-help" class="sr-only">Enter the full URL to the social media profile</div>
				</div>
				<Button
					variant="success"
					size="lg"
					onclick={addSocialLink}
					aria-label="Add social media link"
				>
					Add Social Link
				</Button>
				<div class="space-y-3 mt-6" role="list" aria-label="Added social links">
					{#each formData.socialLinks || [] as link, index}
						<div
							class="flex items-center justify-between p-4 bg-neo-gray border-2 border-black shadow-[4px_4px_0px_0px_#000000]"
							role="listitem"
						>
							<span class="text-lg font-bold text-black">
								<strong class="uppercase">{link.platform}:</strong>
								{link.url}
							</span>
							<Button
								variant="danger"
								size="sm"
								onclick={() => removeSocialLink(index)}
								aria-label="Remove {link.platform} link"
							>
								Remove
							</Button>
						</div>
					{/each}
				</div>
			</div>

			<!-- Form Actions -->
			<div class="flex justify-end gap-6 mt-8" role="group" aria-label="Form actions">
				<Button
					variant="secondary"
					size="lg"
					onclick={closeForm}
					aria-label="Cancel and close form"
				>
					Cancel
				</Button>
				<Button variant="primary" size="lg" type="submit" aria-describedby="submit-help">
					{editingArtist ? 'Update Artist' : 'Create Artist'}
				</Button>
				<div id="submit-help" class="sr-only">
					Submit the form to {editingArtist ? 'update' : 'create'} the artist
				</div>
			</div>
		</form>
	</Modal>
{/if}

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
