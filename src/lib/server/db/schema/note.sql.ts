import { integer, json, pgTable, text } from 'drizzle-orm/pg-core';
import { project } from './project.sql';
import { generateCode } from '@nevthereal/random-utils';

export const note = pgTable('notes', {
	id: text()
		.primaryKey()
		.$defaultFn(() => generateCode(10)),
	content: json(),
	project: integer()
		.references(() => project.id, { onDelete: 'cascade' })
		.notNull()
});
