import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const { handle, signIn, signOut } = SvelteKitAuth({
	secret: process.env.AUTH_SECRET!,
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		})
	],
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account && profile) {
				token.accessToken = account.access_token;
				token.id = profile.id;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id as string;
			(session as any).accessToken = token.accessToken as string;
			return session;
		}
	},
	pages: {
		signIn: '/login'
	}
});

export const authGuard: Handle = sequence(handle, async ({ event, resolve }) => {
	const session = await event.locals.getSession();

	if (event.url.pathname.startsWith('/admin') && !session) {
		throw redirect(303, '/login');
	}

	return resolve(event);
});
