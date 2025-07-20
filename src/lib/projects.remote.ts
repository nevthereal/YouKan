import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { project, projectStatusEnum } from '$lib/server/db/schema';
import { getUser } from '$lib/server/server-utils';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { zEditProject, zNewProject } from './zod';

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

export const getProject = query(z.number(), async (id: number) => {
	const user = getUser();
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

export const statusVals = query(async () => {
	return projectStatusEnum.enumValues;
});

export const newProject = form(async (formData) => {
	const user = getUser();
	const values = {
		title: formData.get('title')
	};
	const result = zNewProject.safeParse(values);

	if (!result.success) return { errors: result.error.flatten().fieldErrors };

	const { title } = result.data;

	await db.insert(project).values({
		title: title,
		ownerId: user.id
	});

	return { success: true };
});

export const editProject = form(async (formData) => {
	const user = getUser();

	// check values
	const values = {
		projectId: Number(formData.get('id')),
		title: formData.get('title')
	};
	const result = zEditProject.safeParse(values);

	if (!result.success) return { errors: result.error.flatten().fieldErrors };

	const { title, projectId } = result.data;

	// query db to check if record exists
	const record = await db.query.project.findFirst({
		where: {
			ownerId: user.id,
			id: projectId
		}
	});

	if (!record) return { success: false, error: 'Project not found or permission denied' };

	await db
		.update(project)
		.set({
			title
		})
		.where(eq(project.id, projectId));
	return { success: true };
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
	const user = getUser();

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
		const user = getUser();

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
