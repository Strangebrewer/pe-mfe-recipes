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

**GQL layer** (`src/gql/`):

- `GET_RECIPES` / `GET_RECIPE` — list and single-recipe queries
- `CREATE_RECIPE` / `UPDATE_RECIPE` / `DELETE_RECIPE` — full CRUD mutations
- All queries share a `RECIPE_FIELDS` fragment string in `queries/recipes.ts`
- `useUpdateRecipe` sets the single-recipe query cache directly on success (no refetch); also invalidates the list

**UI** (`src/components/`):

- `ListInput` — reusable enter-to-add input; Enter adds item to list and keeps focus; items removable via ✕ button; used for ingredients, directions, and tags in both create and edit flows
- `CreateRecipeModal` — modal with all fields (name, description, prepTime, cookTime, servings, tags, ingredients, directions, macros, imageUrl); submit disabled until name + at least one ingredient + one direction are present
- `RecipeCard` — list row showing name, description snippet, total/prep/cook time, servings, tag chips; navigates to detail on click
- `RecipeDetail` — full detail view at `/:id`; Edit button toggles inline edit mode; all fields editable in place; `ListInput` for list fields; Save/Cancel; delete with inline confirm (Yes/No); errors surfaced inline

**Routes:**

- `/` — recipe list with tag filter chips (client-side, from unique tags across loaded recipes) and "New Recipe" button
- `/:id` — recipe detail / edit

---

## What's Not Here Yet

- Pagination / infinite scroll (currently fetches all recipes)
- Image display (imageUrl stored and editable but not rendered as an image)

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

## Routing

MFE routes must NOT repeat the shell path prefix. Shell mounts at `/recipes/*`; inside the MFE use `path=":id"` (not `path="recipes/:id"`) and `navigate(recipe.id)` (not `navigate(`recipes/${recipe.id}`)`).

## Tailwind

Uses `tw:` prefix (`tw:flex`, `tw:text-sm`, etc.) — required by the MFE Tailwind config.

## pe-mfe-utils

`@bka-stuff/pe-mfe-utils` is installed via `github:` URL (public tarball). Never use `pnpm link` or workspace overrides — breaks CI.
