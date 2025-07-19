import { getRequestEvent } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import type { User } from './auth';
import { checkId } from '$lib/utils';
import { db } from './db';

export function getUser(): User {
	const { locals } = getRequestEvent();

	if (!locals.user) redirect(302, '/home');

	return locals.user;
}

export async function getProject(id: string | number, userId: string) {
	const projectId = checkId(id);

	const qProject = await db.query.project.findFirst({
		where: {
			ownerId: userId,
			id: projectId
		},
		with: {
			note: true
		}
	});

	if (!qProject) return error(404, 'Project not found');

	return qProject;
}
