# Project architecture rules

- Keep each feature in `src/modules/<module>/`. A module owns its entity, repository contract and adapter, service, controller, validation, and tables where applicable.
- Only a module's service contract and public DTOs may be consumed by another module. A service must never import or use another module's entity or repository directly.
- Keep entities and persistence models private to their owning module. Translate to public DTOs at the service boundary.
- Depend on contracts for repositories and external services. Construct concrete providers in factories or the composition root so implementations can be replaced.
- Use strict TypeScript. Avoid `any` and unchecked casts. Use classes where they improve cohesion, lifecycle management, or dependency injection; simple pure helpers may remain functions.
- Keep controllers thin: parse input, call a service, and map its result to HTTP. Put business rules in services and persistence details in repositories.
- Add module tables to the Drizzle schema glob and commit generated migrations with schema changes.
- Use PostgreSQL for persistent storefront and checkout data. Use Redis for caching and rate limiting when those features are added.
- Nodela owns payment processing. The payments module must create payment sessions or invoices on the server and verify settlement server-side before the checkout module marks an order paid. Never expose the API key or trust client callbacks, redirects, or query parameters as proof of payment. Follow Nodela's embedded checkout integration contract when implementing the UI.
