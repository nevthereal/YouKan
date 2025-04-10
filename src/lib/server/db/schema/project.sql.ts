import { pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.sql';
import { generateCode } from '@nevthereal/random-utils';
import { folder } from './folder.sql';

export const projectStatusEnum = pgEnum('status', [
	'To Do',
	'Re Record',
	'In Progress',
	'Done',
	'Scrap'
]);

export const project = pgTable('project', {
	id: serial().primaryKey(),
	title: text().notNull(),
	date: timestamp({ mode: 'date' }),
	status: projectStatusEnum().default('To Do').notNull(),
	ownerId: text().references(() => user.id, { onDelete: 'cascade' })
});

export const statusName = pgTable('status_name', {
	id: text()
		.primaryKey()
		.$defaultFn(() => generateCode(6)),
	status: projectStatusEnum()
		.notNull()
		.references(() => project.status),
	name: text().notNull(),
	folderId: text()
		.notNull()
		.references(() => folder.id)
});

export const status = projectStatusEnum.enumValues;

export type Status = typeof projectStatusEnum.enumValues;
export type Project = typeof project.$inferSelect;
