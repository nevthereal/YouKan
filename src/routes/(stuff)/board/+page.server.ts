import { db } from '$lib/db';
import { project } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zNewProject } from '$lib/zod';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	const projects = await db.query.project.findMany({
		where: eq(project.ownerId, user.id)
	});

	const newProjectForm = await superValidate(zod(zNewProject));
	const editProjectForm = await superValidate(zod(zNewProject));

	return { projects, newProjectForm, editProjectForm };
};

export const actions: Actions = {
	new: async ({ request }) => {
		const form = await superValidate(request, zod(zNewProject));

		if (!form.valid) return fail(400);

		await db.insert(project).values({
			title: form.data.title
		});
	},
	edit: async ({ request }) => {
		const form = await superValidate(request, zod(zNewProject));

		if (!form.valid) return fail(400);

		const projectId = Number(form.id.split('-')[1]);

		if (Number.isNaN(projectId)) return error(404);

		await db
			.update(project)
			.set({
				title: form.data.title
			})
			.where(eq(project.id, projectId));
	}
};
