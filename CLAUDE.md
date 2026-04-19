# pe-mfe-recipes — Claude Context

## What This Is

GraphQL MFE for recipe management. Also the canonical reference implementation for the GraphQL MFE pattern — check this repo before writing any new GraphQL MFE code.

Port: 3006. Accessed via the shell at `/recipes/*`.

---

## Domain Model

**Recipe** (`src/types/recipe.ts`):
`id` (RCP- prefix), `name`, `ingredients: string[]`, `directions: string[]`, `description?`, `prepTime?`, `cookTime?`, `servings?`, `tags?: string[]`, `imageUrl?`, `macros?`

---

## What's Implemented

- `GET_RECIPES` — `getRecipes` query; returns all recipe fields; no filter params
- `CREATE_RECIPE` — mutation; required: `name`, `ingredients[]`, `directions[]`; all other fields optional
- Single index page with recipe list and create form

---

## What's Not Here Yet

- Update and delete mutations
- Single-recipe fetch
- Filtering, pagination, sorting

---

## GraphQL Pattern (canonical)

This is the established pattern all GraphQL MFEs follow:

```
src/
  utils/
    authClient.ts     ← creates axiosPublic (AUTH_URL) and axiosAuth (GQL_URL); calls createAuthClient()
    graphqlClient.ts  ← gqlRequest<T>(query, variables?) — imports axiosAuth, POSTs to GQL_URL
  gql/
    queries/          ← plain GraphQL strings (no gql tag, no codegen)
    hooks/            ← TanStack Query hooks; useMutation hooks invalidate relevant query keys on success
    fragments/        ← shared fragments (add when needed)
  types/              ← TypeScript types
```

No intermediate API layer — hooks call `gqlRequest` directly.

---

## env vars

- `AUTH_URL` → go-auth base URL for token refresh (default: `http://localhost:8080`)
- `GQL_URL` → Apollo Router URL (default: `http://localhost:4000`)

---

## Tailwind
Uses `tw:` prefix (`tw:flex`, `tw:text-sm`, etc.) — required by the MFE Tailwind config.

## pe-mfe-utils
`@bka-stuff/pe-mfe-utils` is installed via `github:` URL (public tarball). Never use `pnpm link` or workspace overrides — breaks CI.
