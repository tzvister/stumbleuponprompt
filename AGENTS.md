# Repository Guidelines

## Project Structure & Module Organization
- `client/`: React 18 + Vite app. Source in `client/src` (`components/`, `pages/`, `lib/`, `hooks/`). Public assets in `client/public`.
- `server/`: Express + TypeScript (`index.ts`, `routes.ts`, `storage.ts`, `vite.ts`). Handles API and dev middleware.
- `shared/`: Cross‑shared TypeScript types and Zod schemas (e.g., `shared/schema.ts`).
- `data/`: Static seed content (e.g., prompts JSON).
- `dist/`: Build output. Client to `dist/public/`, server bundle to `dist/index.js`.

## Build, Test, and Development Commands
- `npm run dev`: Start Express with Vite middleware (HMR) at `http://localhost:5000`.
- `npm run build`: Build client (Vite) to `dist/public` and bundle server (esbuild) to `dist/`.
- `npm start`: Run production build (`node dist/index.js`).
- `npm run check`: TypeScript type‑check (`tsc`).
- `npm run db:push`: Apply Drizzle schema changes (optional Postgres setup).
- Example checks: `curl http://localhost:5000/health`, `curl http://localhost:5000/api/prompts`.

## Coding Style & Naming Conventions
- TypeScript strict mode enabled; prefer explicit types and narrow unions.
- Indentation: 2 spaces; single quotes or double consistently (project uses double in TS).
- React: function components, hooks prefixed `use*` in `client/src/hooks`.
- Filenames: kebab‑case (`prompt-card.tsx`, `prompt-detail.tsx`). Components export PascalCase symbols.
- Imports: use aliases `@` → `client/src`, `@shared` → `shared`, `@assets` → `attached_assets`.

## Testing Guidelines
- No formal test runner is configured yet. If adding tests:
  - Use Vitest for client/shared (`*.test.ts[x]`) and Supertest for API routes.
  - Place tests next to sources or under `__tests__` per folder.
  - Keep unit tests fast; mock network/DB. Aim for coverage on `shared/schema.ts` and `server/routes.ts`.

## Commit & Pull Request Guidelines
- Prefer Conventional Commits: `type(scope): short summary`.
  - Examples: `feat(server): add /health endpoint`, `fix(client): handle empty tags`.
- PRs: include a concise description, linked issue, reproduction steps, and screenshots for UI changes.
- Keep PRs focused and small; update docs and `CHANGELOG.md` when applicable.

## Security & Configuration Tips
- Never commit secrets. Use `.env` (see `.env` template) and reference via `process.env`.
- For persistence, set `DATABASE_URL` and run `npm run db:push`.
- Avoid logging sensitive data; use `/health` for uptime checks instead.
