import { createAuthClient } from 'better-auth/svelte';
import type { Auth } from './server/auth';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = (url: string) => {
	return createAuthClient({
		baseURL: url,
		plugins: [inferAdditionalFields<Auth>()]
	});
};
