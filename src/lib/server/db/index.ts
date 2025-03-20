import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema/index';
import { createClient } from '@libsql/client';
import { DATABASE_TOKEN, DATABASE_URL } from '$env/static/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: DATABASE_URL, authToken: DATABASE_TOKEN });

export const db = drizzle(client, { schema });
