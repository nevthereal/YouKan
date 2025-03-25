import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUser } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params }) => {
	const user = getUser();

	const id = Number(params.projectId);

	if (Number.isNaN(params.projectId)) return error(400);

	const project = await db.query.project.findFirst({
		where: (fields, operators) => {
			return operators.and(operators.eq(fields.id, id), operators.eq(fields.ownerId, user.id));
		}
	});

	if (!project) return error(404);

	return { project };
};
