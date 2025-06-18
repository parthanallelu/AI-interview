import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const MockInterview = pgTable('mock_interview', {
    id: serial('id').primaryKey(),
    jsonmockresponse: text('jsonmockresponse').notNull(),
    jobPosition: varchar('jobposition', { length: 255 }).notNull(),
    jobDescription: text('jobdescription').notNull(),
    jobExperience: text('jobexperience').notNull(),
    createdby: varchar('createdby', { length: 255 }).notNull(),
    createdat: timestamp('createdat').notNull().defaultNow(),
    mockid: varchar('mockid', { length: 255 }).notNull(),
});
