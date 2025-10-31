// Reexport your entry components here
export { handle, signIn, signOut, authGuard } from './auth.js';
export { registerPasskey, authenticatePasskey, hasPasskeys } from './passkeys.js';

// Reexport stores
export {
	currentUser,
	isAuthenticated,
	authLoading,
	passkeyAvailable,
	login,
	loginWithPasskey,
	registerUserPasskey,
	logout,
	checkAuth
} from './stores/auth.js';

// Reexport types
export type { User } from './types/index.js';
