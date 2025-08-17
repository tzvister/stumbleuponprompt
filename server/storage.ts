import { type Prompt, type InsertPrompt } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

export interface IStorage {
  // Prompt operations
  getPrompt(id: string): Promise<Prompt | undefined>;
  getAllPrompts(): Promise<Prompt[]>;
  getPromptsByTags(tags: string[]): Promise<Prompt[]>;
  searchPrompts(query: string): Promise<Prompt[]>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt | undefined>;
  deletePrompt(id: string): Promise<boolean>;
  getRandomPrompt(): Promise<Prompt | undefined>;
  incrementPromptUseCount(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private prompts: Map<string, Prompt>;

  constructor() {
    this.prompts = new Map();
    this.seedPrompts();
  }

  private seedPrompts() {
    try {
      const promptsPath = join(process.cwd(), 'data', 'prompts.json');
      const promptsData = readFileSync(promptsPath, 'utf-8');
      const samplePrompts: InsertPrompt[] = JSON.parse(promptsData);

      samplePrompts.forEach(prompt => {
        const id = randomUUID();
        const fullPrompt: Prompt = {
          ...prompt,
          id,
          tags: Array.isArray(prompt.tags) ? prompt.tags as string[] : [],
          variables: Array.isArray(prompt.variables) ? prompt.variables as string[] : [],
          variableDescriptions: (prompt as any).variableDescriptions || {},
          testedOn: Array.isArray(prompt.testedOn) ? prompt.testedOn as string[] : [],
          estimatedTokens: prompt.estimatedTokens || 0,
          version: prompt.version || '1.0.0',
          useCount: Math.floor(Math.random() * 2000) + 100,
          lastUpdated: new Date(),
          createdAt: new Date()
        };
        this.prompts.set(id, fullPrompt);
      });
    } catch (error) {
      console.error('Error loading prompts from JSON file:', error);
      // Fallback to empty prompts if file can't be loaded
    }
  }


  async getPrompt(id: string): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async getAllPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values());
  }


  async getPromptsByTags(tags: string[]): Promise<Prompt[]> {
    return Array.from(this.prompts.values()).filter(p => 
      tags.some(tag => p.tags.includes(tag))
    );
  }

  async searchPrompts(query: string): Promise<Prompt[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.prompts.values()).filter(p =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.prompt.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = randomUUID();
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      tags: Array.isArray(insertPrompt.tags) ? insertPrompt.tags as string[] : [],
      variables: Array.isArray(insertPrompt.variables) ? insertPrompt.variables as string[] : [],
      variableDescriptions: (insertPrompt as any).variableDescriptions ?? {},
      testedOn: Array.isArray(insertPrompt.testedOn) ? insertPrompt.testedOn as string[] : [],
      estimatedTokens: insertPrompt.estimatedTokens || 0,
      version: insertPrompt.version || '1.0.0',
      useCount: 0,
      lastUpdated: new Date(),
      createdAt: new Date()
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt | undefined> {
    const existing = this.prompts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.prompts.set(id, updated);
    return updated;
  }

  async deletePrompt(id: string): Promise<boolean> {
    return this.prompts.delete(id);
  }

  async getRandomPrompt(): Promise<Prompt | undefined> {
    const prompts = Array.from(this.prompts.values());
    if (prompts.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  }

  async incrementPromptUseCount(id: string): Promise<void> {
    const prompt = this.prompts.get(id);
    if (prompt) {
      prompt.useCount = (prompt.useCount || 0) + 1;
      this.prompts.set(id, prompt);
    }
  }
}

export const storage = new MemStorage();
