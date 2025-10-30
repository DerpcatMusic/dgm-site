import { authGuard } from '$lib/auth.js';

export const handle = authGuard;
