import { command } from '$app/server';
import z from 'zod';
import { getProject, getUser } from './server/server-utils';
import { db } from './server/db';
import { note } from './server/db/schema';
import { eq } from 'drizzle-orm';
import { Editor } from '@tiptap/core';

export const saveNote = command(
	z.object({ projectId: z.number(), editorState: z.instanceof(Editor) }),
	async ({ projectId, editorState }) => {
		const user = getUser();
		const qProject = await getProject(projectId, user.id);

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
