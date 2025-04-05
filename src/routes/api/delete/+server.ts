import { db } from '$lib/server/db';
import { getUser } from '$lib/server/utils';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { project } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { checkId } from '$lib/utils';

export const POST: RequestHandler = async ({ url }) => {
	const user = getUser();

	const projectId = checkId(url.searchParams.get('id') || '');

	const qProject = await db.query.project.findFirst({
		where: {
			ownerId: user.id,
			id: projectId
		}
	});

	if (!qProject) return error(404, 'Project not found');

	await db.delete(project).where(eq(project.id, qProject.id));

	return new Response(`Successfully deleted ${qProject.title}`);
};
