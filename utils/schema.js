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
    resumeText: text('resumeText'),
    jobDescText: text('jobDescText'),
});

export const UserAnswer = pgTable('user_answer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockid_ref', { length: 255 }).notNull(),
    question: text('question').notNull(),
    correctAns: text('correct_ans'),
    userAns: text('user_ans'),
    feedback: text('feedback'),
    rating: varchar('rating', { length: 10 }),
    difficulty: varchar('difficulty', { length: 20 }),
    category: varchar('category', { length: 50 }),
    userEmail: varchar('user_email', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
