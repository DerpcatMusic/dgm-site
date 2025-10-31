import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	// Auth temporarily disabled
	return {
		session: null
	};
};
