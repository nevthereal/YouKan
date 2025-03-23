import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export function getUser() {
	const { locals } = getRequestEvent();

	if (!locals.user) redirect(302, '/login');

	return locals.user;
}
