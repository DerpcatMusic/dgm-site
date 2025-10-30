import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }: { locals: any }) => {
	// Check if user is authenticated
	const session = await locals.getSession();

	if (!session) {
		throw redirect(303, '/login');
	}

	// You can add additional role-based checks here
	// For example, check if the user has admin role

	return {
		session
	};
};
