import { db } from '$lib/server/db';
import { note } from '$lib/server/db/schema';
import { getProject, getUser } from '$lib/server/utils';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
	const user = getUser();
	const data = await request.json();
	const qProject = await getProject(url.searchParams.get('id') || '', user.id);

	if (!qProject.note) {
		await db.insert(note).values({
			content: data,
			project: qProject.id
		});
	} else {
		await db
			.update(note)
			.set({
				content: data
			})
			.where(eq(note.project, qProject.id));
	}

	return new Response(JSON.stringify({ success: true }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
