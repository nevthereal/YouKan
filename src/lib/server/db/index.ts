import { defineRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/index';
import { DATABASE_URL } from '$env/static/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const relations = defineRelations(schema, (r) => ({
	project: {
		note: r.one.note({
			from: r.project.id,
			to: r.note.project
		})
	}
}));

export const db = drizzle(DATABASE_URL, { relations });
