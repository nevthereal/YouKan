import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) throw new Error('DB URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema/*.sql.ts',
	out: './drizzle',

	dbCredentials: {
		url: process.env.DATABASE_URL
	},

	verbose: true,
	strict: true,
	dialect: 'postgresql'
});
