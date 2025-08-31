import { z } from "zod";

// Insertable prompt payload (from clients)
export const insertPromptSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  prompt: z.string().min(1),
  creatorName: z.string().min(1),
  tags: z.array(z.string()).default([]).optional(),
  variables: z.array(z.string()).default([]).optional(),
  variableDescriptions: z.record(z.string()).default({}).optional(),
  testedOn: z.array(z.string()).default([]).optional(),
  estimatedTokens: z.number().int().nonnegative().default(0).optional(),
  version: z.string().default("1.0.0").optional(),
});

export type InsertPrompt = z.infer<typeof insertPromptSchema>;

// Full Prompt stored/returned by the API
export interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  estimatedTokens: number;
  useCount: number;
  creatorName: string;
  variables: string[];
  variableDescriptions: Record<string, string>;
  testedOn: string[];
  version: string;
  lastUpdated: Date | null;
  createdAt: Date | null;
}
