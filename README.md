# Design Considerations

Changes were delivered in separate pull requests:
[View closed pull requests →](https://github.com/dilekamadushan/coding-test-web/pulls?q=is%3Apr+is%3Aclosed)

## Table of Contents

1. [Project structure overview](#project-structure-overview)
2. [Unit tests and Story-driven snapshot testing](#unit-tests-and-story-driven-snapshot-testing)
3. [SearchBar](#searchbar)
4. [Pagination](#pagination)
5. [TypeScript interfaces for the domain model](#2-typescript-interfaces-for-the-domain-model)
6. [State co-location](#state-co-location)
7. [page.tsx as a routing artifact](#pagetsx-as-a-routing-artifact)
8. [Client components for all features](#client-components-for-all-features)
9. [React.memo and useCallback](#reactmemo-and-usecallback)
10. [CSS](#css)
11. [Code comments](#code-comments)
12. [Dependency changes](#3-dependency-changes)
13. [Assumptions](#4-assumptions)

## 1. Project structure overview

| Layer | Responsibility |
| --- | --- |
| `types/` | Shared types (typescript interfaces)
| `data/` | Raw static data
| `lib/` | Backend business logic |
| `pages/api/` | HTTP layer — calls `lib/`, sends response |
| `services/` | Frontend fetch — calls the API, no UI |
| `app/components/` | UI components

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

## Unit tests and Story-driven snapshot testing
I have implemented unit tests and story driven snapshot testing to make sure all the code is covered and has a strong foundation for robust application and smooth UI experience

### Unit Tests

Component tests mirror the source tree under `app/__tests__/components/` — including `Companies/Companies.test.tsx` for the feature-level integration tests. Backend and service tests stay co-located with their source (`pages/api/__tests__/`, `services/__tests__/`).

`page.tsx` has no logic of its own so it has no test file.

Component tests use real data from `data/companies.ts` rather than synthetic mocks — real data has edge cases like trailing whitespace and `null` fields that inline fixtures miss.

---


### Story driven UI regression testing

- Story-driven snapshot testing for checking UI regression to maintain quality of the UI and user experience.

- Steps
  - 1. Add or update stories in the `stories/` folder to represent all important UI states.
  - 2. Run `npm run test:snapshots` to check for changes.
  - 3. If a change is intentional, run `npm run test:snapshots:update` to update the stored snapshots.

All stories and their snapshot tests are kept in the `stories/` folder for consistency and discoverability.


### SearchBar

Fires `onSearchInputChanged` only after the user pauses typing (300 ms debounce), so the API isn't called on every keystroke. The timer is stored in a `useRef` so it survives re-renders. The input goes `readOnly` while a state is loading.

### Pagination

The current dataset is small (5 companies), but the architecture is designed for a much larger real-world load where returning every record in a single response is not viable.

Pagination is implemented end-to-end across every layer:

## 2. TypeScript interfaces for the domain model

All layers import from `types/` — so field rename is caught by the compiler everywhere at once.

- `Company` — core entity used by every layer
- `ApiResponse<T>` — reusable interface to handle API response

Optional fields (`iconUrl`, `qnaTimestamp`) are typed as `string | null` rather than `?`, so consumers need to handle the null case.
---

### State co-location

`expandedId` lives in `CompanyList` — the lowest component that needs it. Items receive only `isExpanded` and `onToggle`, keeping them stateless.



### `page.tsx` as a routing artifact

In the Next.js App Router, `page.tsx` defines the route segment — it's a framework file, not a feature file.



### Client components for all features

All feature components use `"use client"`. The motivation:

- Every feature requires interactivity hence client components were used
- The team can reason about the entire component tree as standard React without tracking which components run where.


### `React.memo` and `useCallback`

I didn't use them, intentionally for this scope of the project,

`React.memo` and `useCallback` are only useful together
The best candidate for using this is `CompanyListItem` + `useCallback` for `toggle` in `CompanyList`: toggling one item causes all siblings to re-render. With a page size of ≤10 and since cheap renders I decided against it.

### CSS

CSS Modules over Tailwind/Bootstrap:
- Built into Next.js — no extra packages or PostCSS config

Inter (latin) is loaded in `layout.tsx` so it applies to the whole app, not per-page.

### Code comments

- **`useRef` over `useState`** — a one-liner above `searchQueryRef` explains the choice to avoid a re-render.
- **`useEffect` empty dependency array** — an inline `eslint-disable` comment explains that `searchCompanies` is intentionally omitted to prevent an infinite fetch loop on every render.


## 3. Dependency changes

`@types/*` and `typescript` moved to `devDependencies` — not needed in the production bundle.

## 4. Assumptions

- Translations are not supported at this release
