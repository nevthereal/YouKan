import { getUser } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const user = getUser();

	return { user };
};
