import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import type { User } from './auth';

export function getUser(): User {
	const { locals } = getRequestEvent();

	if (!locals.user) redirect(302, '/home');

	return locals.user;
}
