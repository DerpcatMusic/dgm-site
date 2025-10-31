<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { currentUser, isAuthenticated } from '$lib/stores/auth.js';
	import { invalidateAll } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import Button from '$lib/components/Button.svelte';

	let { children } = $props();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>DGM Site</title>
	<meta name="description" content="Dolmen Gate Media Artist Showcase" />
</svelte:head>

<div class="min-h-screen bg-neo-white" transition:fly={{ y: 20, duration: 400 }}>
	<header
		class="bg-neo-red border-b-8 border-black shadow-[0px_8px_0px_0px_#000000] sticky top-0 z-50"
	>
		<div class="max-w-7xl mx-auto px-8 py-6">
			<div class="flex justify-between items-center">
				<a
					href="/"
					class="flex items-center bg-transparent border-0 cursor-pointer p-0"
					aria-label="Go to homepage"
				>
					<h1
						class="text-6xl font-black text-black uppercase tracking-wider hover:text-neo-blue transition-colors duration-100"
					>
						DGM
					</h1>
				</a>
				<nav class="flex items-center space-x-6">
					{#if $isAuthenticated}
						<a
							href="/admin"
							class="text-black hover:text-neo-blue font-black text-xl uppercase tracking-wider px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all duration-100"
							>Dash</a
						>
						{#if $currentUser?.role && $currentUser.role === 'admin'}
							<a
								href="/admin"
								class="text-black hover:text-neo-blue font-black text-xl uppercase tracking-wider px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all duration-100"
								>Admin</a
							>
						{/if}
						<form method="POST" action="/?/logout">
							<Button variant="danger" size="md" type="submit">Logout</Button>
						</form>
					{:else}
						<a
							href="/login"
							class="text-black hover:text-neo-blue font-black text-xl uppercase tracking-wider px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all duration-100"
							>Dash</a
						>
					{/if}
				</nav>
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="bg-neo-black text-white border-t-8 border-black shadow-[0px_-8px_0px_0px_#000000]">
		<div class="max-w-7xl mx-auto px-8 py-12">
			<div class="text-center">
				<p class="text-neo-white font-black text-2xl uppercase tracking-wider">
					&copy; 2024 Dolmen Gate Media. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
</div>
