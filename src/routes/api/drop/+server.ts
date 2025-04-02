import { db } from '$lib/server/db';
import { project, projectStatusEnum } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getUser } from '$lib/server/utils';
import { checkId } from '$lib/utils';

export const POST: RequestHandler = async ({ url }) => {
	const user = getUser();

	const projectId = checkId(url.searchParams.get('id') || '');

	const qProject = await db.query.project.findFirst({
		where: and(eq(project.id, projectId), eq(project.ownerId, user.id))
	});

	if (!qProject) return error(404, 'Project not found');

	const target = url.searchParams.get('target') as (typeof projectStatusEnum.enumValues)[number];

	const [updatedProject] = await db
		.update(project)
		.set({
			status: target
		})
		.where(eq(project.id, projectId))
		.returning();

	return new Response(JSON.stringify(updatedProject), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
