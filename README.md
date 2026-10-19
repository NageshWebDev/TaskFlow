## Prerequisites

- Node.js 22+
- MongoDB 7 running locally, **or** Docker
---

## Run with Docker (full stack)

```bash
docker compose up --build
```

This starts MongoDB, the API on port `4000` and the web app on port `3000`. The Compose file uses a placeholder `JWT_SECRET`; change it before deploying anywhere real.

---

# TaskFlow

A mini project-management app. Users register, create projects, add tasks with status, priority and due dates, and track progress on a dashboard.

**Stack:** Next.js 14 (App Router) + React + TypeScript + Zustand on the frontend; Node.js + Express + TypeScript + MongoDB (Mongoose) on the backend; JWT auth with bcrypt; Jest tests; Docker Compose; GitHub Actions CI.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the schema, auth approach and key trade-offs.

---

## Features

- **Authentication**: register, log in and log out with email and password. Passwords are hashed with bcrypt. Logout invalidates every token issued before it (server-side `tokenVersion` bump).
- **Ownership on the server**: every project and task query is scoped to the logged-in user. Another user's resource returns `404`, so the API doesn't reveal that it exists.
- **Projects**: create, list, view, rename and delete. Each project card shows its task count and completion progress.
- **Tasks**: create, view, edit and delete tasks inside a project. Each task has a title, description, status (`To Do`, `In Progress`, `Done`), priority (`Low`, `Medium`, `High`) and due date.
- **Filtering and search**: filter by status and priority, search by title, and combine all three. When nothing matches, an empty state is shown.
- **Dashboard**: total projects, total tasks, completed tasks and overdue tasks, calculated with MongoDB aggregation. A task is overdue when its due date has passed and it isn't `Done`.
- **Validation and errors**: Zod schemas validate every request body, param and query. Errors always use the same shape, and requests are logged with morgan.
- **API docs**: Swagger UI at `/api/docs`.

---

## Project structure

```
.
├── api/                  Express API (TypeScript)
│   ├── src/
│   │   ├── config/       env + MongoDB connection
│   │   ├── routes/       route definitions
│   │   ├── controllers/  HTTP layer
│   │   ├── services/     business logic + ownership checks
│   │   ├── models/       Mongoose schemas (User, Project, Task)
│   │   ├── middleware/   auth, validation, error handler
│   │   ├── validators/   Zod schemas
│   │   └── swagger.ts    OpenAPI spec
│   └── tests/            Jest + Supertest integration tests
├── web/                  Next.js app (TypeScript)
│   └── src/
│       ├── app/          pages: dashboard, projects, projects/[id], tasks, login, register
│       ├── components/   reusable UI components
│       ├── lib/          API client, filters, overdue logic
│       ├── store/        Zustand auth store
│       └── __tests__/    Jest + React Testing Library tests
├── docker-compose.yml
├── .github/workflows/ci.yml
└── ARCHITECTURE.md
```

---

## Environment variables

Copy the example files. No real secrets are committed; `.env` and `.env.local` are git-ignored.

```bash
cp api/.env.example api/.env
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > web/.env.local
```

| Variable | App | Description | Example |
| --- | --- | --- | --- |
| `PORT` | API | HTTP port | `4000` |
| `MONGODB_URI` | API | MongoDB connection string | `mongodb://localhost:27017/taskflow` |
| `JWT_SECRET` | API | Secret used to sign JWTs (use a long random string) | `replace-with-a-long-random-string` |
| `JWT_EXPIRES_IN` | API | Token lifetime | `7d` |
| `NODE_ENV` | API | `development`, `production` or `test` | `development` |
| `NEXT_PUBLIC_API_URL` | Web | API base URL, including `/api` | `http://localhost:4000/api` |

---

## Database setup

TaskFlow uses MongoDB. You don't need to run any migrations: Mongoose creates the collections and indexes the first time they're used. The schema is defined in `api/src/models/`.

Start MongoDB with Docker if you don't have it installed:

```bash
docker compose up mongo -d
```

The default connection string is `mongodb://localhost:27017/taskflow`.

---

## Run locally

```bash
# Terminal 1 – API
cd api
npm install
npm run dev        # http://localhost:4000

# Terminal 2 – Web
cd web
npm install
npm run dev        # http://localhost:3000
```

| What | URL |
| --- | --- |
| Web app | http://localhost:3000 |
| API health check | http://localhost:4000/api/health |
| Swagger docs | http://localhost:4000/api/docs |

Open the web app, register an account, and you're in.

### Production build

```bash
cd api && npm run build && npm start
cd web && npm run build && npm start
```

---

## API overview

All endpoints are under `/api`. Every endpoint except register, login and health needs an `Authorization: Bearer <token>` header. Full request and response schemas are in Swagger at `/api/docs`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create an account (`email`, `password` of at least 6 characters) |
| `POST` | `/auth/login` | Log in and receive a JWT |
| `POST` | `/auth/logout` | Invalidate all of the user's current tokens |
| `GET` | `/projects` | List the user's projects with task counts and progress |
| `POST` | `/projects` | Create a project (`name`, `description`) |
| `GET` | `/projects/:id` | Get one project |
| `PUT` | `/projects/:id` | Update a project |
| `DELETE` | `/projects/:id` | Delete a project and its tasks |
| `GET` | `/projects/:projectId/tasks` | List tasks in a project (`?status=&priority=&search=`) |
| `POST` | `/projects/:projectId/tasks` | Create a task |
| `GET` | `/projects/:projectId/tasks/:taskId` | Get one task |
| `PUT` | `/projects/:projectId/tasks/:taskId` | Update a task, including its status |
| `DELETE` | `/projects/:projectId/tasks/:taskId` | Delete a task |
| `GET` | `/tasks` | Search tasks across all projects (`?status=&priority=&search=&projectId=`) |
| `GET` | `/dashboard` | Totals for projects, tasks, completed and overdue tasks |
| `GET` | `/health` | Health check |

**Success responses** look like `{ "success": true, "data": ... }`.

**Error responses** look like this:

```json
{ "success": false, "error": { "message": "Validation failed", "details": { } } }
```

| Status | When |
| --- | --- |
| `400` | Request failed validation (bad body, invalid id, unknown status or priority) |
| `401` | Token is missing, invalid, expired or logged out |
| `404` | The resource doesn't exist or belongs to another user |
| `409` | Email is already registered |
| `500` | Unexpected server error (logged on the server) |

---

## Tests

```bash
cd api && npm test     # Jest + Supertest against an in-memory MongoDB
cd web && npm test     # Jest + React Testing Library
```

The API tests need no running database, because they use `mongodb-memory-server`. They cover:

- registering, logging in, rejecting a duplicate email, and invalidating the token on logout
- the full CRUD flow for projects and tasks, including filters
- ownership enforcement: user B can't read or change user A's projects or tasks

The web tests cover:

- the login form, both success and error
- task filters and the empty state
- the overdue logic: Done tasks and tasks due today are never overdue
- the dashboard stat cards, including the 0% case with no division by zero
- the task cards

### Lint

```bash
cd api && npm run lint
cd web && npm run lint
cd web && npm run lint:css
```

---

## CI/CD

`.github/workflows/ci.yml` runs on every push and pull request. It has two parallel jobs, **API** and **Web**, and each one runs `npm ci`, then lint, then tests on Node 22.

---

## Not done (optional or out of scope)

- Drag-and-drop Kanban board
- Pagination and sorting
- Refresh-token rotation
- Rate limiting
- Public cloud deployment
- End-to-end and visual regression tests
- Editing a project's description in the UI (the UI supports renaming; the API's `PUT` accepts both name and description)
