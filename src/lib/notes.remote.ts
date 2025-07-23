import { command } from '$app/server';
import z from 'zod';
import { db } from './server/db';
import { note } from './server/db/schema';
import { eq } from 'drizzle-orm';
import { Editor } from '@tiptap/core';
import { getProject, getUser } from './projects.remote';
import { error } from '@sveltejs/kit';

export const saveNote = command(
	z.object({ projectId: z.number(), editorState: z.instanceof(Editor) }),
	async ({ projectId, editorState }) => {
		await getUser();
		const qProject = await getProject(projectId);

		if (!qProject) return error(404, 'Project not found or permission denied');

		if (!qProject.note) {
			await db.insert(note).values({
				content: editorState.getJSON(),
				project: qProject.id
			});
		} else {
			await db
				.update(note)
				.set({
					content: editorState.getJSON()
				})
				.where(eq(note.project, qProject.id));
		}

		return { success: true };
	}
);
