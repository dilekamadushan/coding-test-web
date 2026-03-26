# Design Considerations

## This explains the decisions behind code changes made and the motivation.

## Table of Contents

1. [Project structure overview](#1-project-structure-overview)
2. [TypeScript interfaces for the domain model](#2-typescript-interfaces-for-the-domain-model)

## 1. Project structure overview

```
app/
  page.tsx               ← client component (UI only, no fetch logic)
  __tests__/
    page.test.tsx        ← component tests

pages/
  api/
    companies.ts         ← Next.js API route (data provider)
    __tests__/
      companies.test.ts  ← API handler unit tests

services/
  companies.ts           ← data-fetching abstraction
  __tests__/
    companies.test.ts    ← service unit tests

types/
  companies.ts           ← shared TypeScript interfaces
```

Each directory has a single responsibility:

| Layer        | Responsibility                         |
| ------------ | -------------------------------------- |
| `types/`     | Shared data shapes — no logic          |
| `services/`  | HTTP communication — no UI             |
| `pages/api/` | Data provision — no business logic     |
| `app/`       | Rendering and UI state — no fetch code |

This separation means each layer can change independently and can be tested in isolation.

---

## 2. TypeScript interfaces for the domain model (types)

Both api and app (frontend) can import from it without any circular dependency concerns. And also every layer could import from this, so a field rename or type change is caught by the compiler everywhere at once.

- `Company` — Every layer that touches company data imports this type, so a field rename or type change is caught by the compiler everywhere at once.
- `Event` — nested inside `Company`; separated so it can be imported and reasoned about independently.
- `ColorSettings` — a small sub-object given its own interface so it is named and can be extended (e.g., adding `textColor`) without touching `Company`.
- `CompaniesResponse` — The API handler's return type and the service's parse logic both reference this, ensuring they stay in sync.

## **Nullability is explicit.** Fields that can be absent from the API response (e.g., `iconUrl: string | null`, `qnaTimestamp: number | null`) are typed as unions rather than using optional (`?`).

## 3

Dependency changes - Dev dependencies have been added explicitly

5. Assumptions

- Translations are not supported at this release
