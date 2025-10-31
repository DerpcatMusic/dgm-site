// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession(): Promise<Session | null>;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				ARTISTS_KV: KVNamespace;
			};
		}
	}
}

interface Session {
	user: {
		id: string;
		email: string;
		name?: string;
		image?: string;
		role?: 'admin' | 'user';
	};
	accessToken: string;
}

export {};
