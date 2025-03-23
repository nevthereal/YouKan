import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.projectId);

	if (Number.isNaN(params.projectId)) return error(400);

	const project = await db.query.project.findFirst({
		where: (fields, operators) => {
			return operators.eq(fields.id, id);
		}
	});

	if (!project) return error(404);

	return { project };
};
