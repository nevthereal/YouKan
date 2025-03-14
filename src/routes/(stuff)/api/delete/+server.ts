import { db } from '$lib/db';
import { getUser } from '$lib/utils';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { project } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, url }) => {
	const user = getUser(locals);

	const projectId = Number(url.searchParams.get('id'));
	if (Number.isNaN(projectId)) return error(400, 'Number not provided');

	const qProject = await db.query.project.findFirst({
		where: and(eq(project.id, projectId), eq(project.ownerId, user.id))
	});

	if (!qProject) return error(404, 'Project not found');

	await db.delete(project).where(eq(project.id, qProject.id));

	return new Response(`Successfully deleted ${qProject.title}`);
};
