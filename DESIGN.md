# Design Considerations

Changes were delivered in separate pull requests:
[View closed pull requests →](https://github.com/dilekamadushan/coding-test-web/pulls?q=is%3Apr+is%3Aclosed)

## Table of Contents

1. [Project structure overview](#1-project-structure-overview)
2. [TypeScript interfaces for the domain model](#2-typescript-interfaces-for-the-domain-model)
3. [Dependency changes](#3-dependency-changes)
4. [Code comments](#code-comments)
5. [Assumptions](#4-assumptions)

## 1. Project structure overview

| Layer | Responsibility |
| --- | --- |
| `types/` | Shared data shapes — no logic |
| `data/` | Raw static data — no logic |
| `lib/` | Backend business logic |
| `pages/api/` | HTTP layer — calls `lib/`, sends response |
| `services/` | Frontend fetch — calls the API, no UI |
| `app/components/` | UI rendering only — except `Companies`, which owns feature state |
| `app/` | Route shell only — no state, no imports from `services/` |

---

```
app/
  page.tsx               ← route entry point; delegates to <Companies>
  components/
    Companies/
      Companies.tsx         ← "use client"; owns all search, pagination
    CompanyList/
      CompanyList.tsx           ← owns expand/collapse state; renders title + list
      ... all sub ui components
    SearchBar/
      SearchBar.tsx             ← debounced search input; fires callback after user pauses
  __tests__/
    components/           ← all test files for UI components (mirrors the components/ hierarchy)

data/
  companies.ts           ← raw static data

lib/
  companies.ts           ← backend service: business logic over the data layer

pages/
  api/
    companies.ts         ← Next.js API route (HTTP layer only)
    __tests__/
      companies.test.ts

services/
  companies.ts           ← frontend fetch abstraction
  __tests__/
    companies.test.ts

types/
  companies.ts           ← shared TypeScript interfaces
```

## 2. TypeScript interfaces for the domain model

All layers import from `types/` — so field rename is caught by the compiler everywhere at once.

- `Company` — core entity used by every layer
- `CompaniesResponse` — shared by the API handler and the service, keeping them in sync

Optional fields (`iconUrl`, `qnaTimestamp`) are typed as `string | null` rather than `?`, so consumers are forced to handle the null case.
---

### State co-location

`expandedId` lives in `CompanyList` — the lowest component that needs it. Items receive only `isExpanded` and `onToggle`, keeping them stateless.

### SearchBar

Fires `onSearchInputChanged` only after the user pauses typing (300 ms debounce), so the API isn't called on every keystroke. The timer is stored in a `useRef` so it survives re-renders. The input goes `readOnly` while a state is loading.


### `page.tsx` as a routing artifact

In the Next.js App Router, `page.tsx` defines the route segment — it's a framework file, not a feature file.



### Client components for all features

All feature components use `"use client"`. The motivation:

- ** User Interactivity.**  Search, pagination, expand/collapse — every feature requires interactivity hence client components were used
- **Testability.** Client Components render predictably in Jest + RTL without a server runtime. 
- **Simpler mental model.** The team can reason about the entire component tree as standard React without tracking which components run where.


### Pagination

The current dataset is small (5 companies), but the architecture is designed for a much larger real-world load where returning every record in a single response is not viable.

Pagination is implemented end-to-end across every layer:

### `React.memo` and `useCallback`

I didn't use them, intentionally.

`React.memo` and `useCallback` are only useful together
The best candidate for using this is `CompanyListItem` + `useCallback` for `toggle` in `CompanyList`: toggling one item causes all siblings to re-render. With a page size of ≤10 and since cheap renders I decided against it.

### CSS

CSS Modules over Tailwind/Bootstrap:
- Built into Next.js — no extra packages or PostCSS config

Inter (latin) is loaded in `layout.tsx` so it applies to the whole app, not per-page.

### Code comments

- **`useRef` over `useState`** — a one-liner above `searchQueryRef` explains the choice to avoid a re-render.
- **`useEffect` empty dependency array** — an inline `eslint-disable` comment explains that `searchCompanies` is intentionally omitted to prevent an infinite fetch loop on every render.

### Tests

Component tests mirror the source tree under `app/__tests__/components/` — including `Companies/Companies.test.tsx` for the feature-level integration tests. Backend and service tests stay co-located with their source (`pages/api/__tests__/`, `services/__tests__/`).

`page.tsx` has no logic of its own so it has no test file.

Component tests use real data from `data/companies.ts` rather than synthetic mocks — real data has edge cases like trailing whitespace and `null` fields that inline fixtures miss.

---

## 3. Dependency changes

`@types/*` and `typescript` moved to `devDependencies` — not needed in the production bundle.

## 4. Assumptions

- Translations are not supported at this release
