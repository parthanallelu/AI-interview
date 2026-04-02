import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const dbUrl = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

if (!dbUrl) {
  console.warn("NEXT_PUBLIC_DRIZZLE_DB_URL is not defined. Database queries will fail.");
}

// Neon HTTP driver prefers the direct hostname over the pooling one.
// Stripping '-pooler' from the host to ensure compatibility with neon-http.
const cleanDbUrl = dbUrl?.replace('-pooler', '');

const sql = neon(cleanDbUrl);
export const db = drizzle(sql, { schema });


