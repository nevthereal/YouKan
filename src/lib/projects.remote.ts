import { command, form, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/db';
import { validator } from 'svelte-checkmate';
import { project, projectStatusEnum } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { zEditProject, zNewProject } from './zod';
// import { STATUS_VALUES } from './utils';

export const getUser = query(async () => {
	const { locals } = getRequestEvent();

	if (!locals.user) redirect(302, '/home');

	return locals.user;
});

export const getProjects = query(async () => {
	const user = await getUser();
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

export const getProject = query(z.number(), async (id: number) => {
	const user = await getUser();
	const project = await db.query.project.findFirst({
		where: {
			ownerId: user.id,
			id
		},
		with: {
			note: true
		}
	});
	return project;
});

export const newProject = form(async (formData) => {
	const user = await getUser();

	const result = await validator({ schema: zNewProject, formData });

	if (!result.success) return error(400, result.errors.title);

	await db.insert(project).values({
		title: result.data.title,
		ownerId: user.id
	});

	return { success: true, title: result.data.title };
});

export const editProject = form(async (formData) => {
	const user = await getUser();

	const result = await validator({ schema: zEditProject, formData });

	if (!result.success) return error(400, result.errors.newTitle);

	const { newTitle, projectId } = result.data;

	// query db to check if record exists
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
			title: newTitle
		})
		.where(eq(project.id, projectId));
	return { success: true, title: newTitle };
});

export const updateDate = command(
	z.object({ projectId: z.number(), newDate: z.date() }),
	async ({ newDate, projectId }) => {
		await db
			.update(project)
			.set({
				date: newDate
			})
			.where(eq(project.id, projectId));

		return { success: true };
	}
);

export const clearDate = command(z.number(), async (projectId) => {
	const user = await getUser();

	await db
		.update(project)
		.set({
			date: null
		})
		.where(and(eq(project.id, projectId), eq(project.ownerId, user.id)));
});

export const drop = command(
	z.object({ id: z.number(), target: z.enum(projectStatusEnum.enumValues) }),
	async ({ id, target }) => {
		const user = await getUser();

		const qProject = await db.query.project.findFirst({
			where: {
				ownerId: user.id,
				id
			}
		});

		if (!qProject) return error(404, 'Project not found or permission denied');
		await db
			.update(project)
			.set({
				status: target
			})
			.where(eq(project.id, id));
	}
);

export const deleteProject = command(z.number(), async (id) => {
	const user = await getUser();

	const qProject = await db.query.project.findFirst({
		where: {
			ownerId: user.id,
			id
		}
	});

	if (!qProject) return error(404, 'Project not found or permission denied');

	await db.delete(project).where(eq(project.id, qProject.id));
});
