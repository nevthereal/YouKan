import { integer, json, pgTable, uuid } from 'drizzle-orm/pg-core';
import { project } from './project.sql';

export const note = pgTable('notes', {
	id: uuid().primaryKey(),
	content: json(),
	project: integer().references(() => project.id, { onDelete: 'cascade' })
});
