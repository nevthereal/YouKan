import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { project, projectStatusEnum } from '$lib/server/db/schema';
import { getUser } from '$lib/server/server-utils';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const getProjects = query(async () => {
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

	return projects;
});

export const statusVals = query(async () => {
	return projectStatusEnum.enumValues;
});

export const newProject = form(async (data: FormData) => {
	const fd = Object.fromEntries(data.entries());

	const parsed = z.object({ title: z.string().min(3) }).safeParse(fd);

	if (parsed.error) return { error: parsed.error };

	const user = getUser();

	await db.insert(project).values({
		title: parsed.data.title,
		ownerId: user.id
	});
});

export const drop = command(
	z.object({ id: z.number(), target: z.enum(projectStatusEnum.enumValues) }),
	async ({ id, target }) => {
		const user = getUser();

		if (!id) return error(404, 'Does not exist');

		const qProject = await db.query.project.findFirst({
			where: {
				ownerId: user.id,
				id
			}
		});

		if (!qProject) return error(404, 'Project not found');
		await db
			.update(project)
			.set({
				status: target
			})
			.where(eq(project.id, id));
	}
);

export const deleteProject = command(z.number(), async (id) => {
	const user = getUser();

	const qProject = await db.query.project.findFirst({
		where: {
			ownerId: user.id,
			id
		}
	});

	if (!qProject) return error(404, 'Project not found');

	await db.delete(project).where(eq(project.id, qProject.id));
});
