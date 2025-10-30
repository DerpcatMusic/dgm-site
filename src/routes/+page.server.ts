import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({
	locals,
	platform
}: {
	locals: any;
	platform: any;
}) => {
	const session = await locals.getSession();

	return {
		session,
		kv: platform?.env?.ARTISTS_KV
	};
};
