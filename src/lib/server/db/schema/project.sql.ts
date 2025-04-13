import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './auth.sql';
import { generateCode } from '@nevthereal/random-utils';

export const projectStatusEnum = pgEnum('project_status', [
	'Todo',
	'In Progress',
	'Done',
	'Archive'
]);

export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];

export const folder = pgTable('folder', {
	id: text()
		.primaryKey()
		.$defaultFn(() => generateCode(6)),
	ownerId: text().references(() => user.id, { onDelete: 'cascade' }),
	name: text().notNull()
});

export const statusName = pgTable('status_name', {
	id: text()
		.primaryKey()
		.$defaultFn(() => generateCode(6)),
	baseStatus: projectStatusEnum('base_status').notNull(),
	customName: text().notNull(),
	folderId: text()
		.notNull()
		.references(() => folder.id, { onDelete: 'cascade' })
});

export const project = pgTable('project', {
	id: serial().primaryKey(),
	title: text().notNull(),
	date: timestamp({ mode: 'date' }),
	status: projectStatusEnum('status').notNull().default('Todo'),
	statusNameId: text().references(() => statusName.id),
	ownerId: text().references(() => user.id, { onDelete: 'cascade' }),
	folderId: text().references(() => folder.id, { onDelete: 'cascade' })
});

export type Project = typeof project.$inferSelect;
export type Folder = typeof folder.$inferSelect;
