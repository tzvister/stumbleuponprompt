## 0.3.0 (2025-08-31)

### Security
- Add `helmet` with safe defaults (no CSP); enable HSTS in production only.
- Enforce body size limits via `BODY_LIMIT` (default 100kb) for JSON/urlencoded.
- Add rate limiting in production: API 100/min, Health 30/min (tune via env).
- Validate `/api/prompts` query params (`search`, `tags`) with Zod; invalid returns 400.

### Chore
- Remove Drizzle tooling (`drizzle-orm`, `drizzle-zod`, `drizzle-kit`) and `drizzle.config.ts`.
- Convert `shared/schema.ts` to pure Zod + TypeScript types; API exports preserved.
- Update README with security notes and remove DB/migration instructions.
- `npm audit`: now reports 0 vulnerabilities.

## 0.1.0 (2025-08-17)

### Features
- UI input placeholders now use descriptive text from `variableDescriptions` in `data/prompts.json`, improving guidance when customizing variables.

### Fixes
- Robust UUID extraction from prompt slugs in `lib/seo-utils.ts`, ensuring prompt detail pages load reliably.

### Docs
- README updated with `variableDescriptions` schema details and recent changes section.

