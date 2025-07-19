import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUser } from '$lib/server/server-utils';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zSetDate } from '$lib/zod';
import { checkId } from '$lib/utils';
import { project } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const user = getUser();

	const id = checkId(params.projectId);

	const project = await db.query.project.findFirst({
		where: {
			ownerId: user.id,
			id
		},
		with: {
			note: true
		}
	});

	if (!project) return error(404);

	const dateForm = await superValidate(zod(zSetDate), {
		defaults: {
			date: project.date ?? new Date()
		}
	});

	return { project, dateForm };
};

export const actions = {
	setDate: async ({ request, params }) => {
		const user = getUser();

		const id = checkId(params.projectId);

		const qProject = await db.query.project.findFirst({
			where: {
				ownerId: user.id,
				id
			}
		});

		if (!qProject) return error(401);

		const form = await superValidate(request, zod(zSetDate));

		if (!form.valid) return fail(400);

		await db
			.update(project)
			.set({
				date: form.data.date
			})
			.where(eq(project.id, id));

		return { form };
	}
} satisfies Actions;
