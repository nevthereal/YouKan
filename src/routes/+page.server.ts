import { db } from '$lib/server/db';
import { project, projectStatusEnum } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zNewProject } from '$lib/zod';
import { eq } from 'drizzle-orm';
import { getUser } from '$lib/server/utils';

export const load: PageServerLoad = async () => {
	const user = getUser();
	const projects = await db.query.project.findMany({
		where: eq(project.ownerId, user.id),
		orderBy: (fields, operators) => {
			return operators.desc(fields.date);
		}
	});

	const newProjectForm = await superValidate(zod(zNewProject));
	const editProjectForm = await superValidate(zod(zNewProject));
	const statusValues = projectStatusEnum.enumValues;

	return { projects, newProjectForm, editProjectForm, statusValues };
};

export const actions: Actions = {
	new: async ({ request }) => {
		const user = getUser();

		const form = await superValidate(request, zod(zNewProject));

		if (!form.valid) return fail(400);

		await db.insert(project).values({
			title: form.data.title,
			ownerId: user.id
		});
	},
	edit: async ({ request }) => {
		const user = getUser();
		const form = await superValidate(request, zod(zNewProject));

		if (!form.valid) return fail(400);

		const match = form.id?.match(/^edit-(\d+)$/);
		const projectId = match ? Number(match[1]) : NaN;

		if (Number.isNaN(projectId)) return error(404);

		const record = await db.query.project.findFirst({
			where: (fields, operators) =>
				operators.and(operators.eq(fields.id, projectId), operators.eq(fields.ownerId, user.id))
		});
		if (!record) return error(404, 'Project not found or permission denied');

		await db
			.update(project)
			.set({
				title: form.data.title
			})
			.where(eq(project.id, projectId));
	}
};
