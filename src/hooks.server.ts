// Temporarily disable auth to fix production error
export const handle = async ({ event, resolve }) => {
	return resolve(event);
};
