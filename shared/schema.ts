import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const classicVocab = pgTable("classic_vocab", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  word: text("word").notNull(),
  meaning: text("meaning").notNull(),
  example: text("example").notNull(),
  difficulty: integer("difficulty").notNull().default(1),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyVocabSet = pgTable("daily_vocab_set", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(),
  vocabIds: text("vocab_ids").array().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const vocabWrongAnswers = pgTable("vocab_wrong_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  vocabId: varchar("vocab_id").notNull(),
  word: text("word").notNull(),
  statement: text("statement").notNull(),
  userAnswer: text("user_answer").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  noteType: text("note_type").notNull().default("vocab"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVocabWrongAnswerSchema = createInsertSchema(vocabWrongAnswers).pick({
  userId: true,
  vocabId: true,
  word: true,
  statement: true,
  userAnswer: true,
  correctAnswer: true,
  explanation: true,
  noteType: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type ClassicVocab = typeof classicVocab.$inferSelect;
export type DailyVocabSet = typeof dailyVocabSet.$inferSelect;
export type VocabWrongAnswer = typeof vocabWrongAnswers.$inferSelect;
export type InsertVocabWrongAnswer = z.infer<typeof insertVocabWrongAnswerSchema>;
