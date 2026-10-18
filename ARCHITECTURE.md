# TaskFlow Architecture

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Next.js 14 App Router + React + TypeScript | Matches the brief; App Router keeps routing simple for a small CRUD app |
| State | Zustand (persisted) | Lightweight auth session store without Redux boilerplate |
| Backend | Node.js + Express + TypeScript | Explicit routes/controllers/services/models separation, easy to explain |
| Validation | Zod | Shared request schemas with clear 400 errors |
| Database | MongoDB + Mongoose | Flexible documents for projects/tasks; aggregation for dashboard stats |
| Auth | JWT + bcrypt | Stateless API auth with hashed passwords |

## Schema

```
User { email (unique), passwordHash, tokenVersion }
  └── Project { userId, name, description, createdAt }
        └── Task { projectId, userId, title, description, status, priority, dueDate }
```

- `Task.userId` is denormalized so ownership checks and dashboard aggregation stay simple (`{ userId }` match) without joining through projects every time.
- Indexes: `Project.userId`; `Task.userId`, `projectId`, `status`, `priority`, `dueDate`, plus compound indexes for common filters.

## Auth approach

1. Register/login hash passwords with bcrypt and return a JWT containing `{ userId, tokenVersion }`.
2. `requireAuth` middleware verifies the JWT, loads the user, and rejects tokens whose `tokenVersion` no longer matches.
3. Logout increments `tokenVersion`, which invalidates all previously issued JWTs for that user (server-side invalidation without a denylist collection).
4. Every project/task query scopes by `userId` (and project ownership via `assertProjectOwnership`). Missing ownership returns **404**, not 403, to avoid leaking resource existence.

## API layout

```
routes → controllers → services → models
middleware: auth, zod validate, morgan logging, central errorHandler
```

Consistent error shape:

```json
{ "success": false, "error": { "message": "...", "details": ... } }
```

Swagger UI is served at `/api/docs`.

## Key trade-offs

1. **Token version vs denylist** — Version bump is simpler and invalidates all sessions on logout. Trade-off: you cannot revoke a single device without logging out everywhere.
2. **404 on cross-user access** — Slightly less informative than 403, but better privacy.
3. **Denormalized `userId` on tasks** — Extra field to keep in sync (always set from the authenticated user at create time). Avoids multi-collection joins for ownership and dashboard counts.
4. **Client-stored JWT (localStorage via Zustand persist)** — Fine for a take-home; production would prefer httpOnly cookies and refresh rotation (listed as optional in the brief).

## Dashboard query (explainable)

`dashboardService.getDashboardStats` runs two aggregations:

- Projects: `$match` by `userId` then `$count`.
- Tasks: `$match` by `userId`, then `$group` with conditional sums for completed (`status === Done`) and overdue (`dueDate < now && status !== Done`).
