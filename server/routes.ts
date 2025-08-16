import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPromptSchema } from "@shared/schema";
import { z } from "zod";
import { generateSitemap } from "./sitemap";

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('🔧 Registering API routes...');
  
  // Health check endpoint for deployment monitoring
  app.get("/health", (req, res) => {
    try {
      const healthData = {
        status: "healthy", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || "unknown",
        environment: process.env.NODE_ENV || "development",
        memory: process.memoryUsage(),
        pid: process.pid
      };
      res.status(200).json(healthData);
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({ 
        status: "unhealthy", 
        error: "Health check failed",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get all prompts
  app.get("/api/prompts", async (req, res) => {
    try {
      const { tags, search } = req.query;
      
      let prompts;
      if (search && typeof search === 'string') {
        prompts = await storage.searchPrompts(search);
      } else if (tags && typeof tags === 'string') {
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
        prompts = await storage.getPromptsByTags(tagArray);
      } else {
        prompts = await storage.getAllPrompts();
      }
      
      res.json(prompts || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      res.status(500).json({ 
        message: "Failed to fetch prompts",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
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
      console.error('Error getting random prompt:', error);
      res.status(500).json({ 
        message: "Failed to get random prompt",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  // Get specific prompt
  app.get("/api/prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: "Invalid prompt ID" });
      }
      
      const prompt = await storage.getPrompt(id);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      console.error('Error fetching prompt:', error);
      res.status(500).json({ 
        message: "Failed to fetch prompt",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  // Create new prompt
  app.post("/api/prompts", async (req, res) => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ message: "Request body is required" });
      }
      
      const validatedData = insertPromptSchema.parse(req.body);
      const prompt = await storage.createPrompt(validatedData);
      res.status(201).json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error creating prompt:', error.errors);
        return res.status(400).json({ 
          message: "Invalid prompt data", 
          errors: error.errors 
        });
      }
      console.error('Error creating prompt:', error);
      res.status(500).json({ 
        message: "Failed to create prompt",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  // Increment use count
  app.post("/api/prompts/:id/use", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: "Invalid prompt ID" });
      }
      
      await storage.incrementPromptUseCount(id);
      res.status(200).json({ message: "Use count incremented" });
    } catch (error) {
      console.error('Error incrementing use count:', error);
      res.status(500).json({ 
        message: "Failed to increment use count",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  // Generate sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const prompts = await storage.getAllPrompts();
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : 'https://stumbleuponprompt.replit.app';
      
      const sitemap = generateSitemap(prompts || [], baseUrl);
      
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).json({ 
        message: "Failed to generate sitemap",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });

  console.log('✅ All routes registered successfully');
  
  const httpServer = createServer(app);
  
  // Add server-level error handling
  httpServer.on('error', (error: any) => {
    console.error('HTTP Server error:', error);
  });
  
  httpServer.on('clientError', (error: any, socket: any) => {
    console.error('Client error:', error);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });
  
  return httpServer;
}
