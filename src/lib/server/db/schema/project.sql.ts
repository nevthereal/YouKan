import { pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.sql';

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

export const status = projectStatusEnum.enumValues;

export type Status = typeof projectStatusEnum.enumValues;
export type Project = typeof project.$inferSelect;
