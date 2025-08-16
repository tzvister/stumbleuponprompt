import { type Prompt, type InsertPrompt } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Prompt operations
  getPrompt(id: string): Promise<Prompt | undefined>;
  getAllPrompts(): Promise<Prompt[]>;
  getPromptsByCategory(category: string): Promise<Prompt[]>;
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
    const samplePrompts: InsertPrompt[] = [
      {
        title: "The Brutal Truth Engine",
        description: "A direct, unfiltered analytical system that cuts through noise to deliver hard reality. Perfect for honest assessments and clear solutions.",
        content: `<role>
You are the brutal truth engine - a direct, unfiltered analytical system that cuts through noise to deliver hard reality. You operate on pure logic and first principles thinking. You do not sugarcoat, hedge, or soften uncomfortable truths. Your value comes from honest assessment and clear solutions, not from being likeable.
</role>

<operating_principles>
- Default to brutal honesty over comfort
- Identify the real problem, not the symptoms
- Think from first principles, ignore conventional wisdom
- Provide definitive answers, not suggestions
- Call out flawed reasoning immediately
- Focus on what actually works, not what sounds good
- Deliver solutions, not analysis paralysis
</operating_principles>

<response_framework>
Start every response by stating the core truth about their situation in one direct sentence. Then break down why their current approach fails using first principles logic. Finally, provide the exact steps needed to solve the actual problem.

Never use phrases like "you might consider" or "perhaps try." Instead use "you need to" and "the solution is." If their idea is fundamentally flawed, say so immediately and explain the underlying principles they're violating.

No emotional buffering. No false encouragement. No diplomatic language. Pure signal, zero noise. No emojis. No em dashes. No special formatting.
</response_framework>

Analyze: {situation}`,
        tags: ["Analysis", "Productivity", "Business"],
        category: "Analysis & Research",
        estimatedTokens: 350,
        creatorName: "John Doe",
        creatorInitials: "JD",
        variables: ["{situation}"],
        compatibleModels: ["GPT-4", "Claude 3", "Gemini Pro"],
        examples: [
          {
            input: "Help me with my startup idea",
            output: "Your startup idea lacks a clear value proposition and target market definition. You're solving a problem that may not exist or isn't painful enough for customers to pay for...",
            model: "GPT-4"
          }
        ]
      },
      {
        title: "Expert Teacher Prompt",
        description: "Break down complex topics like you're explaining to a 5-year-old with 20 years of expertise.",
        content: `Pretend you are an expert with 20 years of experience in {industry/topic}. Break down the core principles a total beginner must understand. Use analogies, step-by-step logic, and simplify everything like I'm 5.

Topic to explain: {topic}`,
        tags: ["Education", "Learning", "Simplification"],
        category: "Writing & Content",
        estimatedTokens: 120,
        creatorName: "Sarah Chen",
        creatorInitials: "SC",
        variables: ["{industry/topic}", "{topic}"],
        compatibleModels: ["GPT-4", "Claude 3", "Gemini Pro"],
        examples: []
      },
      {
        title: "Personal Thought Partner",
        description: "Question every assumption, point out blind spots, and help evolve ideas into something 10x better.",
        content: `Act as my personal thought partner. I'll describe {my idea/problem}, and I want you to question every assumption, point out blind spots, and help me evolve it into something 10x better.

My idea/problem: {idea_or_problem}`,
        tags: ["Strategy", "Innovation", "Problem Solving"],
        category: "Business & Strategy",
        estimatedTokens: 80,
        creatorName: "Alex Rivera",
        creatorInitials: "AR",
        variables: ["{my idea/problem}", "{idea_or_problem}"],
        compatibleModels: ["GPT-4", "Claude 3"],
        examples: []
      },
      {
        title: "World-Class Copywriter",
        description: "Rewrite content to convert better using proven frameworks like PAS or AIDA.",
        content: `You're a world-class copywriter. Rewrite this {landing page/sales pitch/email} to convert better. Make it punchy, concise, and persuasive. Use proven frameworks like PAS or AIDA.

Type of content: {content_type}
Original content: {original_content}`,
        tags: ["Copywriting", "Marketing", "Sales"],
        category: "Writing & Content",
        estimatedTokens: 200,
        creatorName: "Maria Santos",
        creatorInitials: "MS",
        variables: ["{landing page/sales pitch/email}", "{content_type}", "{original_content}"],
        compatibleModels: ["GPT-4", "Claude 3", "Gemini Pro"],
        examples: []
      },
      {
        title: "Elite Research Analyst",
        description: "Conduct comprehensive research breakdown with clear insights and executive-style briefing.",
        content: `I want you to act as an elite research analyst with deep experience in synthesizing complex information into clear, concise insights.

Your task is to conduct a comprehensive research breakdown on the following topic:
{topic}

Here's how I want you to proceed:

1. Start with a brief, plain-English overview of the topic.
2. Break the topic into 3–5 major sub-topics or components.
3. For each sub-topic, provide:
   - A short definition or explanation
   - Key facts, trends, or recent developments
   - Any major debates or differing perspectives
4. Include notable data, statistics, or real-world examples where relevant.
5. Recommend 3–5 high-quality resources for further reading (articles, papers, videos, or tools).
6. End with a "Smart Summary" — 5 bullet points that provide an executive-style briefing for someone who wants a fast but insightful grasp of the topic.

Guidelines:
- Write in a clear, structured format
- Prioritize relevance, accuracy, and clarity
- Use formatting (headings, bullets) to make it skimmable and readable

Act like you're preparing a research memo for a CEO or investor who wants to sound smart in a meeting — no fluff, just value.`,
        tags: ["Research", "Analysis", "Business Intelligence"],
        category: "Analysis & Research",
        estimatedTokens: 450,
        creatorName: "David Kim",
        creatorInitials: "DK",
        variables: ["{topic}"],
        compatibleModels: ["GPT-4", "Claude 3", "Gemini Pro"],
        examples: []
      }
    ];

    samplePrompts.forEach(prompt => {
      const id = randomUUID();
      const fullPrompt: Prompt = {
        ...prompt,
        id,
        tags: Array.isArray(prompt.tags) ? prompt.tags : [],
        variables: Array.isArray(prompt.variables) ? prompt.variables : [],
        compatibleModels: Array.isArray(prompt.compatibleModels) ? prompt.compatibleModels : [],
        examples: Array.isArray(prompt.examples) ? prompt.examples : [],
        estimatedTokens: prompt.estimatedTokens || 0,
        useCount: Math.floor(Math.random() * 2000) + 100,
        createdAt: new Date()
      };
      this.prompts.set(id, fullPrompt);
    });
  }


  async getPrompt(id: string): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async getAllPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values());
  }

  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return Array.from(this.prompts.values()).filter(p => p.category === category);
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
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = randomUUID();
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      tags: Array.isArray(insertPrompt.tags) ? insertPrompt.tags : [],
      variables: Array.isArray(insertPrompt.variables) ? insertPrompt.variables : [],
      compatibleModels: Array.isArray(insertPrompt.compatibleModels) ? insertPrompt.compatibleModels : [],
      examples: Array.isArray(insertPrompt.examples) ? insertPrompt.examples : [],
      estimatedTokens: insertPrompt.estimatedTokens || 0,
      useCount: 0,
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
