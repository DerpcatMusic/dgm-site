<script lang="ts">
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/stores/auth.js';

	onMount(() => {
		// Redirect if already authenticated
		const unsubscribe = isAuthenticated.subscribe((authenticated: boolean) => {
			if (authenticated) {
				goto('/admin');
			}
		});

		return unsubscribe;
	});
</script>

<svelte:head>
	<title>Login - DGM Site</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-neo-white py-12 px-8">
	<LoginForm />
</div>
