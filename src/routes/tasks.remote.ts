import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { project, projectStatusEnum } from '$lib/server/db/schema';
import { getUser } from '$lib/server/utils';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const getTasks = query(async () => {
	const user = getUser();
	const tasks = db.query.project.findMany({
		where: {
			ownerId: user.id
		},
		orderBy: {
			date: 'desc',
			title: 'asc'
		}
	});

	return tasks;
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
