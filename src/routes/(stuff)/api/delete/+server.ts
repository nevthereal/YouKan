import { db } from '$lib/server/db';
import { getUser } from '$lib/server/auth/utils';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { project } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ url }) => {
	const user = getUser();

	const projectId = Number(url.searchParams.get('id'));
	if (Number.isNaN(projectId)) return error(400, 'Number not provided');

	const qProject = await db.query.project.findFirst({
		where: and(eq(project.id, projectId), eq(project.ownerId, user.id))
	});

	if (!qProject) return error(404, 'Project not found');

	await db.delete(project).where(eq(project.id, qProject.id));

	return new Response(`Successfully deleted ${qProject.title}`);
};
