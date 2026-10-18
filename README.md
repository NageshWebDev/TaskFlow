# TaskFlow

Mini project-management app: Next.js frontend + Express/MongoDB API.

## Setup

### Prerequisites

- Node.js 22+
- MongoDB (local) **or** Docker

### Environment

```bash
cp .env.example .env
cp .env.example api/.env
# For web, set NEXT_PUBLIC_API_URL in web/.env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > web/.env.local
```

| Variable | App | Description |
| --- | --- | --- |
| `PORT` | API | HTTP port (default `4000`) |
| `MONGODB_URI` | API | Mongo connection string |
| `JWT_SECRET` | API | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | API | Token lifetime (e.g. `7d`) |
| `NEXT_PUBLIC_API_URL` | Web | API base URL including `/api` |

### Database

Start MongoDB locally, or via Compose:

```bash
docker compose up mongo -d
```

Default URI: `mongodb://localhost:27017/taskflow`

No migrations are required; Mongoose creates collections/indexes on first use.

## Run locally

```bash
# Terminal 1 – API
cd api
npm install
npm run dev

# Terminal 2 – Web
cd web
npm install
npm run dev
```

- Web: http://localhost:3000  
- API: http://localhost:4000/api/health  
- Swagger: http://localhost:4000/api/docs  

## Docker (full stack)

```bash
docker compose up --build
```

- Web: http://localhost:3000  
- API: http://localhost:4000  

## Tests

```bash
cd api && npm test
cd web && npm test
```

Lint:

```bash
cd api && npm run lint
cd web && npm run lint
```

## Project structure

```
/api   Express API (routes → controllers → services → models)
/web   Next.js App Router UI
```

## Not done (optional / out of scope for this submission)

- Drag-and-drop Kanban board  
- Pagination and sorting  
- Refresh-token rotation  
- Rate limiting  
- Public cloud deployment  
- Broader e2e / visual regression suite  
- Edit-project UI (API supports PATCH; UI focuses on create/list/delete)  
- Edit-task fields beyond status (API supports full PATCH)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for stack, schema, auth, and trade-offs.
