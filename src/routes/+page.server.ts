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
	const projects = db.query.project.findMany({
		where: {
			ownerId: user.id
		},
		orderBy: {
			date: 'desc',
			title: 'asc'
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

		const record = await db.query.project.findFirst({
			where: {
				ownerId: user.id,
				id: projectId
			}
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
