import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './utils/schema.js',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL
    }
});