# Design Considerations

## This explains the decisions behind code changes made and the motivation.

## Table of Contents

1. [Project structure overview](#1-project-structure-overview)
2. [TypeScript interfaces for the domain model](#2-typescript-interfaces-for-the-domain-model)
3. [Backend layering: data, lib, and API](#3-backend-layering-data-lib-and-api)
4. [Dependency changes](#4-dependency-changes)
5. [Assumptions](#5-assumptions)

## 1. Project structure overview

```
app/
  page.tsx               ← client component (UI only, no fetch logic)
  __tests__/
    page.test.tsx        ← component tests

data/
  companies.ts           ← raw static data, typed as CompaniesApiResponse

lib/
  companies.ts           ← backend service: business logic over the data layer

pages/
  api/
    companies.ts         ← Next.js API route (HTTP layer only)
    __tests__/
      companies.test.ts  ← API handler unit tests

services/
  companies.ts           ← frontend data-fetching abstraction
  __tests__/
    companies.test.ts    ← service unit tests

types/
  companies.ts           ← shared TypeScript interfaces
```

Each directory has a single responsibility:

| Layer        | Responsibility                                      |
| ------------ | --------------------------------------------------- |
| `types/`     | Shared data shapes — no logic                       |
| `data/`      | Raw static/seed data — no logic                     |
| `lib/`       | Backend business logic — queries and transforms     |
| `pages/api/` | HTTP layer — calls `lib/`, sends response           |
| `services/`  | Frontend fetch — calls the API, no UI               |
| `app/`       | Rendering and UI state — no fetch code              |

This separation means each layer can change independently and can be tested in isolation.

---

## 2. TypeScript interfaces for the domain model (types)

Both api and app (frontend) can import from it without any circular dependency concerns. And also every layer could import from this, so a field rename or type change is caught by the compiler everywhere at once.

- `Company` — Every layer that touches company data imports this type, so a field rename or type change is caught by the compiler everywhere at once.
- `Event` — nested inside `Company`; separated so it can be imported and reasoned about independently.
- `ColorSettings` — a small sub-object given its own interface so it is named and can be extended (e.g., adding `textColor`) without touching `Company`.
- `CompaniesResponse` — The API handler's return type and the service's parse logic both reference this, ensuring they stay in sync.

**Nullability is explicit.** Fields that can be absent from the API response (e.g., `iconUrl: string | null`, `qnaTimestamp: number | null`) are typed as unions rather than using optional (`?`). This forces every consumer to handle the null case rather than silently receiving `undefined`.

---

## 3. Backend layering: data, lib, and API

The backend is split into three distinct layers to keep concerns separate:

**`data/companies.ts`** holds the raw static data, typed directly as `CompaniesApiResponse`. It has no logic — its only job is to exist as a typed, importable data source. If the data source later changes (e.g. a real database or external API), only this file changes.

**`lib/companies.ts`** is the backend service layer. It exposes functions like `getCompanies()` that read from `data/` and apply any business logic — filtering, sorting, transforming. The API handler and any future server-side consumers call `lib/`, not `data/` directly.

**`pages/api/companies.ts`** is the HTTP boundary only. It calls `lib/getCompanies()`, wraps the result in the response envelope, and sends it. It contains no data access or business logic.

This separation means:
- Business logic in `lib/` can be unit-tested without spinning up an HTTP server.
- The API handler tests only need to verify the HTTP contract (status code, response shape).
- Swapping the data source (static → database) requires changing `data/` and `lib/` only — the handler is untouched.

---

## 4. Dependency changes

`@types/*` packages and `typescript` are moved to `devDependencies` since they are only needed at compile time and are not required in the production bundle. Runtime dependencies (`next`, `react`, `react-dom`, `@next/font`) remain in `dependencies`.

---

## 5. Assumptions

- Translations are not supported at this release
