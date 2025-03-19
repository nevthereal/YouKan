import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getUser() {
	const { locals } = getRequestEvent();

	if (!locals.user) redirect(302, '/login');

	return locals.user;
}
