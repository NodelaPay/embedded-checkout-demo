# Embedded checkout demo

Next.js starter for Nodela's embedded checkout demo. The project follows the hosted checkout demo's module boundaries, strict TypeScript rules, PostgreSQL/Drizzle persistence, and Redis infrastructure. The storefront and payment flow will be implemented when the UI is supplied.

## Local setup

Requires Node.js 20.9 or newer, npm, and Docker.

```bash
cp .env.example .env.local
npm install
docker compose up -d
npm run dev
```

Set `SESSION_SECRET` to a random value of at least 32 characters before implementing session-backed features. Set `NODELA_API_KEY` to a test key when implementing payments. The app uses port 3001; PostgreSQL and Redis use loopback ports 5435 and 6382 so it can run beside the hosted demo.

## Project commands

```bash
npm run format:check
npm run typecheck
npm run lint
npm run build
```

When module tables are added, run `npm run db:generate` and commit the generated migrations. Then run `npm run db:migrate` against the local database.

## Architecture

Feature code goes in `src/modules/<name>/`. Modules expose service contracts and public DTOs; their entities, tables, and repository adapters stay private. Shared PostgreSQL, Redis cache, and Redis rate-limit providers are constructed in `src/infrastructure/` factories. See `AGENTS.md` for the full rules.
