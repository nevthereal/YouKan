import { generateCode } from '@nevthereal/random-utils';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { user } from './auth.sql';

export const folder = pgTable('folder', {
	id: text()
		.primaryKey()
		.$defaultFn(() => generateCode(6)),
	ownerId: text().references(() => user.id, { onDelete: 'cascade' }),
	name: text().notNull()
});
