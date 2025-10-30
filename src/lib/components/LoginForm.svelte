<script lang="ts">
	import {
		login,
		loginWithPasskey,
		registerUserPasskey,
		authLoading,
		passkeyAvailable
	} from '$lib/stores/auth.js';
	import { onMount } from 'svelte';
	import { fly, fade, slide } from 'svelte/transition';
	import Button from './Button.svelte';
	import Card from './Card.svelte';
	import Input from './Input.svelte';

	let selectedProvider: 'google' | null = $state(null);
	let userId = $state('');
	let userName = $state('');
	let userDisplayName = $state('');
	let showPasskeyForm = $state(false);
	let isRegistering = $state(false);
	let userIdInput: HTMLInputElement | undefined = $state();
	let firstFocusableElement: HTMLButtonElement | undefined = $state();

	// Component is already exported as default by Svelte

	onMount(() => {
		// Check if passkeys are available for the current user
		// In a real app, you'd get this from the session
		// Focus management: focus on first button when component mounts
		if (firstFocusableElement) {
			firstFocusableElement.focus();
		}
	});

	async function handleOAuthLogin(provider: 'google') {
		try {
			await login(provider);
		} catch (error) {
			console.error('OAuth login failed:', error);
			// Handle error (show toast, etc.)
		}
	}

	async function handlePasskeyLogin() {
		if (!userId) return;

		const success = await loginWithPasskey(userId);
		if (!success) {
			console.error('Passkey authentication failed');
			// Handle error
		}
	}

	async function handlePasskeyRegistration() {
		if (!userId || !userName || !userDisplayName) return;

		isRegistering = true;
		try {
			const success = await registerUserPasskey(userId, userName, userDisplayName);
			if (success) {
				showPasskeyForm = false;
				// Show success message
			} else {
				console.error('Passkey registration failed');
				// Handle error
			}
		} catch (error) {
			console.error('Passkey registration error:', error);
		} finally {
			isRegistering = false;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.target === userIdInput) {
			handlePasskeyLogin();
		}
	}
</script>

<Card variant="elevated" padding="lg">
	<h2
		id="login-heading"
		class="text-3xl font-black mb-8 text-center text-black uppercase tracking-wider"
		transition:fade={{ delay: 200, duration: 400 }}
	>
		Sign In
	</h2>

	<!-- OAuth Providers -->
	<div
		class="space-y-4 mb-8"
		transition:slide={{ delay: 300, duration: 400 }}
		role="group"
		aria-labelledby="oauth-heading"
	>
		<div id="oauth-heading" class="sr-only">Sign in with social providers</div>
		<Button
			variant="primary"
			size="lg"
			disabled={$authLoading}
			onclick={() => handleOAuthLogin('google')}
			aria-label="Continue with Google account"
			aria-describedby="google-status"
		>
			<svg class="w-6 h-6 mr-3" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="#4285F4"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="#34A853"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				/>
				<path
					fill="#FBBC05"
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				/>
				<path
					fill="#EA4335"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				/>
			</svg>
			<span class="text-white font-black text-xl uppercase tracking-wider"
				>Continue with Google</span
			>
			{#if $authLoading}
				<span id="google-status" class="sr-only">Loading...</span>
			{/if}
		</Button>
	</div>

	<div class="relative mb-8">
		<div class="absolute inset-0 flex items-center">
			<div class="w-full border-t-4 border-black"></div>
		</div>
		<div class="relative flex justify-center text-lg font-bold">
			<span class="px-4 bg-white text-black uppercase tracking-wider">Or</span>
		</div>
	</div>

	<!-- Passkey Section -->
	<div
		class="space-y-6"
		transition:slide={{ delay: 400, duration: 400 }}
		role="region"
		aria-labelledby="passkey-heading"
	>
		<div id="passkey-heading" class="sr-only">Passkey authentication</div>
		{#if $passkeyAvailable}
			<div
				transition:slide={{ delay: 500, duration: 300 }}
				role="group"
				aria-labelledby="passkey-login-heading"
			>
				<h3 id="passkey-login-heading" class="sr-only">Sign in with existing passkey</h3>
				<Input
					label="User ID"
					bind:value={userId}
					placeholder="Enter your user ID"
					required={true}
				/>
				<div class="mt-4">
					<Button
						variant="secondary"
						size="lg"
						disabled={$authLoading || !userId}
						onclick={handlePasskeyLogin}
						aria-describedby="passkey-login-status"
					>
						<span class="text-black font-black text-xl uppercase tracking-wider"
							>{$authLoading ? 'Signing in...' : 'Sign in with Passkey'}</span
						>
					</Button>
					{#if $authLoading}
						<div id="passkey-login-status" class="sr-only">
							Signing in with passkey, please wait
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<Button
				variant="success"
				size="lg"
				onclick={() => (showPasskeyForm = !showPasskeyForm)}
				aria-expanded={showPasskeyForm}
			>
				<span class="text-black font-black text-xl uppercase tracking-wider"
					>{showPasskeyForm ? 'Cancel' : 'Set up Passkey'}</span
				>
			</Button>

			{#if showPasskeyForm}
				<Card variant="bordered" padding="md">
					<h3
						id="passkey-setup-heading"
						class="text-xl font-black uppercase tracking-wider mb-6 text-black"
					>
						Set up new passkey
					</h3>
					<div class="space-y-4">
						<Input
							label="User ID"
							bind:value={userId}
							placeholder="Enter your user ID"
							required={true}
						/>
						<Input
							label="Username"
							bind:value={userName}
							placeholder="Enter your username"
							required={true}
						/>
						<Input
							label="Display Name"
							bind:value={userDisplayName}
							placeholder="Enter your display name"
							required={true}
						/>
						<Button
							variant="success"
							size="lg"
							disabled={isRegistering || !userId || !userName || !userDisplayName}
							onclick={handlePasskeyRegistration}
							aria-describedby="passkey-setup-status"
						>
							<span class="text-black font-black text-xl uppercase tracking-wider"
								>{isRegistering ? 'Setting up...' : 'Set up Passkey'}</span
							>
						</Button>
						{#if isRegistering}
							<div id="passkey-setup-status" class="sr-only">Setting up passkey, please wait</div>
						{/if}
					</div>
				</Card>
			{/if}
		{/if}
	</div>
</Card>

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
