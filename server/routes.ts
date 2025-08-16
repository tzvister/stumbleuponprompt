import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPromptSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment monitoring
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "unknown"
    });
  });

  // Get all prompts
  app.get("/api/prompts", async (req, res) => {
    try {
      const { category, tags, search } = req.query;
      
      let prompts;
      if (search) {
        prompts = await storage.searchPrompts(search as string);
      } else if (category) {
        prompts = await storage.getPromptsByCategory(category as string);
      } else if (tags) {
        const tagArray = (tags as string).split(',');
        prompts = await storage.getPromptsByTags(tagArray);
      } else {
        prompts = await storage.getAllPrompts();
      }
      
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  // Get random prompt (stumble)
  app.get("/api/prompts/random", async (req, res) => {
    try {
      const prompt = await storage.getRandomPrompt();
      if (!prompt) {
        return res.status(404).json({ message: "No prompts available" });
      }
      res.json(prompt);
    } catch (error) {
      res.status(500).json({ message: "Failed to get random prompt" });
    }
  });

  // Get specific prompt
  app.get("/api/prompts/:id", async (req, res) => {
    try {
      const prompt = await storage.getPrompt(req.params.id);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prompt" });
    }
  });

  // Create new prompt
  app.post("/api/prompts", async (req, res) => {
    try {
      const validatedData = insertPromptSchema.parse(req.body);
      const prompt = await storage.createPrompt(validatedData);
      res.status(201).json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid prompt data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create prompt" });
    }
  });

  // Increment use count
  app.post("/api/prompts/:id/use", async (req, res) => {
    try {
      await storage.incrementPromptUseCount(req.params.id);
      res.status(200).json({ message: "Use count incremented" });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment use count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
