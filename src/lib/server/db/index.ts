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
		}),
		folder: r.one.folder({
			from: r.project.folderId,
			to: r.folder.id
		}),
		customStatus: r.one.statusName({
			from: r.project.statusNameId,
			to: r.statusName.id
		})
	},
	folder: {
		project: r.many.project({
			from: r.folder.id,
			to: r.project.folderId
		}),
		statusNames: r.many.statusName({
			from: r.folder.id,
			to: r.statusName.folderId
		})
	},
	statusName: {
		folder: r.one.folder({
			from: r.statusName.folderId,
			to: r.folder.id
		}),
		projects: r.many.project({
			from: r.statusName.id,
			to: r.project.statusNameId
		})
	}
}));

export const db = drizzle(DATABASE_URL, { relations });
