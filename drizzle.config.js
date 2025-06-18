import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './utils/schema.js',
    dialect: 'postgresql',
    dbCredentials: {
        url:'postgresql://neondb_owner:npg_YwVbtXuA7G8d@ep-tiny-snowflake-a8zwamhm-pooler.eastus2.azure.neon.tech/ai_interview?sslmode=require'
    }
});