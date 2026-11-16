# Embedded checkout demo

Next.js storefront frontend for Nodela's embedded checkout demo, based on the supplied local Figma export. The project follows the hosted checkout demo's module boundaries, strict TypeScript rules, PostgreSQL/Drizzle persistence, and Redis infrastructure.

The frontend includes responsive home, product, account, lookbook, newsletter, about, shop, bag, checkout, and thank-you screens. Products, guest carts, saved items, contact details, newsletter subscriptions, orders, and payments are backed by PostgreSQL. Redis caches the catalog and rate limits writes. Checkout creates an order with server calculated prices, creates a Nodela invoice server-side, and opens it in the page through Nodela's CDN script. The server verifies the invoice before marking an order paid.

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

Set `SESSION_SECRET` to a random value of at least 32 characters and `NODELA_API_KEY` to your Nodela test or live key. The key stays on the server. The app uses port 3001; PostgreSQL and Redis use loopback ports 5435 and 6382 so it can run beside the hosted demo. `APP_BASE_URL` must match the public app URL. For webhook verification, register `${APP_BASE_URL}/api/payments/webhook` in the Nodela dashboard and set `NODELA_WEBHOOK_SECRET`. Without a webhook, the checkout and thank-you pages can still verify payment on demand. The overlay uses `https://pay.nodela.co` as requested.

The local Figma export contained screenshots and layer metadata but no original image files. Representative test photos were downloaded from Unsplash; their links are in [`public/images/SOURCES.md`](public/images/SOURCES.md).

## Project commands

```bash
npm run format:check
npm run typecheck
npm run lint
npm run build
npm run test:payment
```

When module tables change, run `npm run db:generate` and commit the generated migrations. Then run `npm run db:migrate` and `npm run db:seed` against the local database. `test:payment` starts a local Nodela stand-in on port 3011, exercises invoice creation, verification, guest isolation, and webhook handling, and removes its test records. Build the app before running it.

## Architecture

Feature code goes in `src/modules/<name>/`. Modules expose service contracts and public DTOs; their entities, tables, and repository adapters stay private. Shared PostgreSQL, Redis cache, and Redis rate-limit providers are constructed in `src/infrastructure/` factories. See `AGENTS.md` for the full rules.
