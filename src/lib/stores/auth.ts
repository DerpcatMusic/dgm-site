import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { registerPasskey, authenticatePasskey, hasPasskeys } from '$lib/passkeys.js';
import type { User } from '$lib/types/index.js';

// Derived stores from page data session - only on client
export const currentUser = derived<typeof page, User | null>(page, ($page) =>
	browser ? ($page.data.session?.user as User) || null : null
);
export const isAuthenticated = derived(page, ($page) => (browser ? !!$page.data.session : false));

// Store for loading state during auth operations
export const authLoading = writable<boolean>(false);

// Store for passkey availability
export const passkeyAvailable = writable<boolean>(false);

// Update passkey availability when user changes - only on client
if (browser) {
	currentUser.subscribe((user) => {
		if (user?.id) {
			passkeyAvailable.set(hasPasskeys(user.id));
		} else {
			passkeyAvailable.set(false);
		}
	});
}

// Function to login with OAuth
export async function login(provider: 'google'): Promise<void> {
	authLoading.set(true);
	try {
		await goto(`/auth/signin/${provider}`);
	} catch (error) {
		console.error('Login failed:', error);
		throw error;
	} finally {
		authLoading.set(false);
	}
}

// Function to login with passkey
export async function loginWithPasskey(userId: string): Promise<boolean> {
	authLoading.set(true);
	try {
		const success = await authenticatePasskey(userId);
		if (success) {
			// Note: User data will be set by the derived store from session
			return true;
		}
		return false;
	} catch (error) {
		console.error('Passkey login failed:', error);
		return false;
	} finally {
		authLoading.set(false);
	}
}

// Function to register passkey
export async function registerUserPasskey(
	userId: string,
	userName: string,
	userDisplayName: string
): Promise<boolean> {
	authLoading.set(true);
	try {
		const success = await registerPasskey(userId, userName, userDisplayName);
		if (success) {
			passkeyAvailable.set(true);
		}
		return success;
	} catch (error) {
		console.error('Passkey registration failed:', error);
		return false;
	} finally {
		authLoading.set(false);
	}
}

// Function to logout
export async function logout(): Promise<void> {
	authLoading.set(true);
	try {
		await goto('/auth/signout');
		passkeyAvailable.set(false);
	} catch (error) {
		console.error('Logout failed:', error);
		throw error;
	} finally {
		authLoading.set(false);
	}
}

// Function to check authentication status - now handled by derived stores
export async function checkAuth(): Promise<void> {
	// Auth status is now automatically derived from page data session
	// This function can be kept for compatibility but is no longer needed
}
