import { db } from '$lib/server/db';
import { project, projectStatusEnum } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth/utils';

export const POST: RequestHandler = async ({ url }) => {
	const user = getUser();
	const projectId = Number(url.searchParams.get('id'));

	if (Number.isNaN(projectId)) return error(400, 'Number not provided');
	const qProject = await db.query.project.findFirst({
		where: and(eq(project.id, projectId), eq(project.ownerId, user.id))
	});

	if (!qProject) return error(404, 'Project not found');

	const target = url.searchParams.get('target') as (typeof projectStatusEnum)[number];

	await db
		.update(project)
		.set({
			status: target
		})
		.where(eq(project.id, projectId));

	return new Response();
};
