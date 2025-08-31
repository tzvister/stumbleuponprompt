# StumbleUponPrompt

A discovery platform for high-quality AI prompts with a "stumble through" experience. Users can discover, preview, and try prompts with their preferred AI models through one-click deep links.

## ✨ Features

- **🎲 Stumble Discovery**: Random prompt discovery with intuitive navigation
- **🚀 One-Click AI Integration**: Direct deep links to ChatGPT, Claude, Gemini, and OpenRouter
- **🔧 Variable Substitution**: Dynamic prompt customization with user inputs
- **🔍 Search & Filtering**: Find prompts by categories, tags, and AI model compatibility
- **📝 Creator Tools**: Easy prompt creation with validation and auto-linting
- **🎯 SEO Optimized**: Full SEO support with structured data, sitemaps, and social sharing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use the included in-memory storage for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stumbleuponprompt.git
   cd stumbleuponprompt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database connection details
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form + Zod validation

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data access layer
│   └── sitemap.ts          # SEO sitemap generation
├── shared/                 # Shared TypeScript schemas
├── data/                   # Static prompt data
└── lib/                    # Shared utilities
```

## 🎯 Core Features

### Prompt Management
- **CRUD Operations**: Full create, read, update, delete for prompts
- **Metadata Support**: Tags, categories, usage tracking, and compatibility markers
- **Variable Extraction**: Automatic detection of `{variable}` placeholders in prompts

### AI Platform Integration
- **ChatGPT**: Direct links with pre-filled prompts
- **Claude**: Integration with Anthropic's chat interface  
- **Gemini**: Google AI chat integration
- **OpenRouter**: Multi-model playground integration

### Search & Discovery
- **Text Search**: Full-text search across prompt titles and descriptions
- **Category Filtering**: Browse prompts by use case categories
- **Tag Filtering**: Filter by specific prompt characteristics
- **Compatibility Filtering**: Find prompts optimized for specific AI models

### SEO & Performance
- **Dynamic Meta Tags**: Automatic generation of page titles and descriptions
- **Open Graph Support**: Rich social media preview cards
- **JSON-LD Structured Data**: Enhanced search engine understanding
- **Automatic Sitemap**: Dynamic sitemap generation for search indexing
- **SEO-Friendly URLs**: Clean, descriptive URLs for all content

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Apply database schema changes

### Environment Variables

```env
# Database (optional - uses in-memory storage by default)
DATABASE_URL="postgresql://user:password@localhost:5432/stumbleuponprompt"

# Development
NODE_ENV="development"

# Security & limits
# Maximum JSON/body size accepted by the server (default 100kb)
BODY_LIMIT="100kb"
# Rate limiter (applies in production only)
# API defaults: 100 requests/min; Health defaults: 30 requests/min
RATE_LIMIT_WINDOW_MS=60000              # fallback window for both scopes
RATE_LIMIT_MAX=100                      # fallback max for both scopes
RATE_LIMIT_API_WINDOW_MS=60000          # API-specific window override
RATE_LIMIT_API_MAX=100                  # API-specific max override
RATE_LIMIT_HEALTH_WINDOW_MS=60000       # Health-specific window override
RATE_LIMIT_HEALTH_MAX=30                # Health-specific max override
```

### Database Setup (Optional)

The app works with in-memory storage by default. For persistent data:

1. Set up a PostgreSQL database
2. Add `DATABASE_URL` to your `.env` file  
3. Run database migrations:
   ```bash
   npm run db:generate
   npm run db:push
   ```

### Security Notes

- HTTP headers: `helmet` is enabled (no CSP by default). HSTS active in production.
- Rate limiting: `express-rate-limit` protects `/api/*` (default 100/min) and `/health` (default 30/min) in production.
  - Tune via `RATE_LIMIT_API_*`, `RATE_LIMIT_HEALTH_*`, or fallback `RATE_LIMIT_*` env vars.
- Body size limits: Requests are limited by `BODY_LIMIT` (default `100kb`). Increase if posting larger payloads.
- Query validation: `/api/prompts` validates `search` and `tags` parameters; invalid values return `400`.

## 📊 Prompt Data Management

All prompts are stored in `data/prompts.json` as a JSON array. This file serves as the single source of truth for all prompt content.

### JSON Structure

Each prompt object must follow this structure:

```json
{
  "title": "Expert Teacher Prompt",
  "description": "Break down complex topics like you're explaining to a 5-year-old with 20 years of expertise.",
  "prompt": "Pretend you are an expert with 20 years of experience in {industry/topic}. Break down the core principles a total beginner must understand. Use analogies, step-by-step logic, and simplify everything like I'm 5.\n\nTopic to explain: {topic}",
  "tags": ["Education", "Learning", "Simplification", "Writing & Content"],
  "estimatedTokens": 120,
  "creatorName": "Sarah Chen",
  "variables": ["{industry/topic}", "{topic}"],
  "variableDescriptions": {
    "industry/topic": "What area you want explained (e.g., quantum computing, unit testing)",
    "topic": "The specific topic within that area you want to focus on"
  },
  "testedOn": ["GPT-4", "Claude 3", "Gemini Pro"],
  "version": "1.0.0"
}
```

#### Variable Descriptions
- `variableDescriptions` is an optional map that provides a human‑friendly placeholder text for each variable input field on the UI.
- Keys can be either the bare variable name without braces (e.g., `niche`) or with braces (e.g., `{niche}`). The UI checks both.
- If a description is not provided, the UI falls back to `Enter value for {variable}`.

### Adding New Prompts

1. Follow the exact JSON structure above
2. Ensure all required fields are present
3. Use standard tag categories for consistency
4. Test variables work correctly in prompt content
5. Validate JSON syntax before committing

## 🔧 Recent Changes

- Fixed prompt detail slug parsing to correctly extract full UUIDs from URLs
- Added support for descriptive variable placeholders via `variableDescriptions` in `prompts.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- Icons from [Lucide React](https://lucide.dev/)
- Powered by [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations

---

**Made with ❤️ for the AI prompt community**
