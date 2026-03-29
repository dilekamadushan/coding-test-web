# Design Considerations

Changes were delivered in separate pull requests:
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
      companies.test.ts

services/
  companies.ts           ← frontend fetch abstraction
  __tests__/
    companies.test.ts

types/
  companies.ts           ← shared TypeScript interfaces
```

| Layer | Responsibility |
| --- | --- |
| `types/` | Shared data shapes — no logic |
| `data/` | Raw static data — no logic |
| `lib/` | Backend business logic |
| `pages/api/` | HTTP layer — calls `lib/`, sends response |
| `services/` | Frontend fetch — calls the API, no UI |
| `app/components/` | UI rendering only |
| `app/` | UI state — no fetch code |

---

## 2. TypeScript interfaces for the domain model

All layers import from `types/` — a field rename is caught by the compiler everywhere at once.

- `Company` — core entity used by every layer
- `Event` — separated from `Company` so it can be imported independently
- `ColorSettings` — its own interface so fields can be added without touching `Company`
- `CompaniesResponse` — shared by the API handler and the service, keeping them in sync

**Nullability is explicit.** Optional fields (`iconUrl`, `qnaTimestamp`) are typed as `string | null` rather than `?`, so consumers are forced to handle the null case.

---

## 3. Backend layering: data, lib, and API

**`data/`** — holds raw static data, no logic. Swap the data source here without touching anything else.

**`lib/`** — business logic (`getCompanies()`, filtering). Tested independently, no HTTP involved.

**`pages/api/`** — HTTP boundary only. Calls `lib/`, sets status code, sends response. No data logic.

---

## 4. Frontend component design

### Component hierarchy

Sub-components used by only one parent live inside that parent's folder — they're implementation details, not shared primitives.

```
CompanyList              — only stateful component; owns expand/collapse
└── CompanyListItem      — row: button, icon, title, chevron
    ├── CompanyItemIcon  — img or lettered placeholder
    └── CompanyItemPanel — expandable detail panel
        └── CompanyEventList
```

### State co-location

`expandedId` lives in `CompanyList` — the lowest component that needs it. Items receive only `isExpanded` and `onToggle`, keeping them stateless.

### SearchBar

Fires `onSearchInputChanged` only after the user pauses typing (300 ms debounce), so the API isn't called on every keystroke. The timer is stored in a `useRef` so it survives re-renders. The input goes `readOnly` while a request is in-flight. The display value is untrimmed trimming happens inside the timeout callback before hitting the API.

### EmptyCompanyList

Lives inside `CompanyList/` because it's an internal detail of the list. `CompanyList` renders it when `companies.length === 0` — callers just pass an array.

### Early-return in `page.tsx`

`renderContent()` returns exactly one of `<LoadingIndicator>`, `<ErrorMessage>`, or `<CompanyList>`. One thing renders at a time; the `<main>` wrapper is declared once.

### CSS

CSS Modules over Tailwind/Bootstrap:
- Built into Next.js — no extra packages or PostCSS config
- Scoped at build time — no style leakage, no BEM needed
- No constraints on selectors or values unlike utility classes
- JSX stays clean without long class strings

Inter (latin) is loaded in `layout.tsx` so it applies to the whole app, not per-page.

### Tests

Component tests mirror the source tree under `app/__tests__/components/`. Backend and service tests stay co-located with their source (`pages/api/__tests__/`, `services/__tests__/`).

Component tests use real data from `data/companies.ts` rather than synthetic mocks — real data has edge cases like trailing whitespace and `null` fields that inline fixtures miss.

---

## 5. Dependency changes

`@types/*` and `typescript` moved to `devDependencies` — not needed in the production bundle.

## 6. Assumptions

- Translations are not supported at this release
