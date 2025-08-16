# Overview

StumbleOnPrompt is a discovery platform for high-quality AI prompts with a "stumble through" experience. The application allows users to discover, preview, and try prompts with their preferred AI models through one-click deep links. It features a React frontend with shadcn/ui components, an Express backend, and uses Drizzle ORM with PostgreSQL for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## August 16, 2025
- Removed user authentication system per user request
- Removed prompt rating and save functionality
- Simplified data model to focus on core stumble experience
- Fixed type safety issues and SelectItem component errors

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with `/api` prefix for all endpoints
- **Database Access**: Drizzle ORM for type-safe database operations
- **Data Storage**: In-memory storage with fallback for development, configured for PostgreSQL production
- **Development Setup**: Vite middleware integration for hot module replacement

## Core Features
- **Stumble Experience**: Random prompt discovery with navigation controls
- **Prompt Management**: Full CRUD operations for prompts with metadata (tags, categories)
- **Search & Filtering**: Text search and filtering by categories, tags, and compatibility
- **Creator Flow**: Form-based prompt creation with auto-linting and validation
- **Deep Link Integration**: One-click "Try Now" buttons for ChatGPT, Claude, Gemini, and OpenRouter

## Data Models
- **Prompts**: Core entity with title, description, content, tags, categories, usage metrics, and variable extraction
- **Variables**: Dynamic field extraction from prompt content using curly brace syntax `{variable}`

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database for production
- **Drizzle Kit**: Database migrations and schema management

### UI Components
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography

### Deep Link Integrations
- **ChatGPT**: Direct links to chat.openai.com with pre-filled prompts
- **Claude**: Integration with claude.ai chat interface
- **Gemini**: Links to Google's Gemini chat interface
- **OpenRouter**: Playground integration for model comparison

### Development Tools
- **Replit Integration**: Development banner and error overlay for Replit environment
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **ESLint/Prettier**: Code formatting and quality assurance