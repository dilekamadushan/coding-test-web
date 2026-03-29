# Design Considerations

## This explains the decisions behind code changes made and the motivation.

Changes were delivered in separate pull requests to keep each review focused and easy to follow:
[View closed pull requests →](https://github.com/dilekamadushan/coding-test-web/pulls?q=is%3Apr+is%3Aclosed)

## Table of Contents

1. [Project structure overview](#1-project-structure-overview)
2. [TypeScript interfaces for the domain model](#2-typescript-interfaces-for-the-domain-model)
3. [Backend layering: data, lib, and API](#3-backend-layering-data-lib-and-api)
4. [Frontend component design](#4-frontend-component-design)
5. [Dependency changes](#5-dependency-changes)
6. [Assumptions](#6-assumptions)

## 1. Project structure overview

```
app/
  globals.css            ← global reset, body font/colour, font-weight baseline
  layout.tsx             ← root layout; applies Inter (latin) font to <body>
  page.tsx               ← client component: search state, loading/error handling
  components/
    CompanyList/
      CompanyList.tsx           ← owns expand/collapse state; renders title + list
      EmptyCompanyList/
        EmptyCompanyList.tsx
      CompanyListItem/
        CompanyListItem.tsx     ← single row: header button + chevron
        CompanyItemIcon/
          CompanyItemIcon.tsx   ← img and initial placeholder
        CompanyItemPanel/
          CompanyItemPanel.tsx  ← expandable details panel
          CompanyEventList/
            CompanyEventList.tsx        ← events list
    CompanyListTitle/
      CompanyListTitle.tsx      ← section label ("Trending companies")
    SearchBar/
      SearchBar.tsx             ← debounced search input; fires callback after user pauses
    LoadingIndicator/
      LoadingIndicator.tsx
    ErrorMessage/
      ErrorMessage.tsx
  __tests__/
    page.test.tsx
    components/           ← all test files for UI components (mirrors the components/ hierarchy)

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
| `app/components/` | UI components — rendering only, no fetch or business logic |
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

## 4. Frontend component design

### Component hierarchy

Components are split by a single responsibility and nested to reflect ownership. Sub-components that are only used by one parent live inside that parent's folder — this makes it clear they are implementation details, not shared primitives.

```
CompanyList              — owns expand/collapse state; the only stateful component
└── CompanyListItem      — row layout: header button, icon, title group, chevron
    ├── CompanyItemIcon  — img vs lettered placeholder (brand colour)
    └── CompanyItemPanel — expandable detail panel
        └── CompanyEventList — events sub-list
```

`CompanyListTitle` and `LoadingIndicator` / `ErrorMessage` sit at the `components/` level because they are used directly by `page.tsx` or `CompanyList`, not as internal details of list items.

### State co-location

`expandedId` lives in `CompanyList` — the lowest component that needs it. Each `CompanyListItem` receives only `isExpanded: boolean` and `onToggle`, keeping items stateless and easy to test.

### SearchBar (New feature)

The `SearchBar` fires the parent-supplied `onSearchInputChanged` callback only after the user pauses typing, using a `setTimeout`-based debounce (default 300 ms). This prevents a network request on every keystroke.


### Early-return pattern in `page.tsx`

`page.tsx` uses a `renderContent()` helper that returns exactly one of `<LoadingIndicator>`, `<ErrorMessage>`, or `<CompanyList>`. This makes it immediately clear that only one thing renders at a time, and the `<main>` wrapper is declared once.

### CSS approach

Each component has its own CSS Module scoped to that component's file. `font-weight: 400` is set once on `body` in `globals.css` and inherited everywhere, except `<dt>` elements which browsers default to bold and need an explicit override.

The Inter (latin subset) font from `@next/font/google` is loaded in `layout.tsx` and applied as a `className` on `<body>`. Placing it in the root layout — rather than in `page.tsx` — ensures the font is applied to the entire application, including any future pages, without each page needing to import it separately.

### Test organisation

All component tests live under `app/__tests__/components/` and mirror the source tree exactly. This gives a single place to find all tests while keeping the structural relationship to the source obvious — navigating to a component's test is the same relative path as navigating to the component itself.

Backend and service tests stay co-located with their source (`pages/api/__tests__/`, `services/__tests__/`) because they are entirely separate from the frontend component tree and would be out of place under `app/`.

#### Using real data in component tests

Component tests import `companies` from `data/companies.ts` rather than defining inline mock objects. The reasons:

- **No duplication** — the shape of `Company` is already defined in `types/companies.ts` and instantiated in `data/companies.ts`. Duplicating it in every test file creates maintenance overhead every time the type evolves.
- **Realistic coverage** — real data contains edge cases that synthetic data misses: trailing whitespace in names (`"Måsøval "`), `null` fields (`iconUrl`, `reportUrl`), etc. These surface real rendering bugs rather than hiding them.
- **Assertion style** — because `displayName` can also appear inside the (always-rendered but hidden) detail panel, queries use `getAllByText(...).length >= 1` or reference `companies[0].companyId` directly. This makes the intent clear: we care that the value is present somewhere, not about how many times it appears.

---

## 5. Dependency changes

`@types/*` packages and `typescript` are moved to `devDependencies` since they are only needed at compile time and are not required in the production bundle. Runtime dependencies (`next`, `react`, `react-dom`, `@next/font`) remain in `dependencies`.

## 6. Assumptions

- Translations are not supported at this release
