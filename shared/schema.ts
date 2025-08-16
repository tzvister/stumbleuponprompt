import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prompts = pgTable("prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  estimatedTokens: integer("estimated_tokens").notNull().default(0),
  useCount: integer("use_count").notNull().default(0),
  creatorName: text("creator_name").notNull(),
  variables: jsonb("variables").$type<string[]>().notNull().default([]),
  compatibleModels: jsonb("compatible_models").$type<string[]>().notNull().default([]),
  examples: jsonb("examples").$type<Array<{input: string, output: string, model: string}>>().notNull().default([]),
  version: text("version").notNull().default("1.0.0"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  useCount: true,
  createdAt: true,
  lastUpdated: true,
});

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;

