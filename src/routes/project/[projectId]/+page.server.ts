import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUser } from '$lib/server/utils';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zSetDate } from '$lib/zod';

export const load: PageServerLoad = async ({ params }) => {
	const user = getUser();

	const id = Number(params.projectId);

	if (Number.isNaN(params.projectId)) return error(400);

	const project = await db.query.project.findFirst({
		where: (fields, operators) => {
			return operators.and(operators.eq(fields.id, id), operators.eq(fields.ownerId, user.id));
		}
	});

	const dateForm = await superValidate(zod(zSetDate));

	if (!project) return error(404);

	return { project, dateForm };
};

export const actions = {
	setDate: ({ request }) => {
		const user = getUser();
	}
} satisfies Actions;
