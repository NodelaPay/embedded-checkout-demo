# Embedded checkout demo

Next.js storefront frontend for Nodela's embedded checkout demo, based on the supplied local Figma export. The project follows the hosted checkout demo's module boundaries, strict TypeScript rules, PostgreSQL/Drizzle persistence, and Redis infrastructure.

The frontend includes responsive home, product, account, lookbook, newsletter, about, shop, bag, and checkout screens. Products, guest carts, saved items, contact details, newsletter subscriptions, and orders are backed by PostgreSQL. Redis caches the catalog and rate limits writes. Checkout creates an order with server calculated prices and an `awaiting_payment` status. Payment is the remaining integration.

## Local setup

Requires Node.js 20.9 or newer, npm, and Docker.

```bash
cp .env.example .env.local
npm install
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Set `SESSION_SECRET` to a random value of at least 32 characters. The app uses port 3001; PostgreSQL and Redis use loopback ports 5435 and 6382 so it can run beside the hosted demo. `NODELA_API_KEY` is only needed for the future payment integration.

The local Figma export contained screenshots and layer metadata but no original image files. Representative test photos were downloaded from Unsplash; their links are in [`public/images/SOURCES.md`](public/images/SOURCES.md).

## Project commands

```bash
npm run format:check
npm run typecheck
npm run lint
npm run build
```

When module tables change, run `npm run db:generate` and commit the generated migrations. Then run `npm run db:migrate` and `npm run db:seed` against the local database.

## Architecture

Feature code goes in `src/modules/<name>/`. Modules expose service contracts and public DTOs; their entities, tables, and repository adapters stay private. Shared PostgreSQL, Redis cache, and Redis rate-limit providers are constructed in `src/infrastructure/` factories. See `AGENTS.md` for the full rules.
