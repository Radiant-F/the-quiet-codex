# Project Setup

## Prerequisites

- Bun >= 1.0
- PostgreSQL >= 14

## Database Setup

> ⚠️ The application does NOT auto-create databases.

```bash
createdb the_quiet_codex_dev
```

## Environment Setup

```bash
cp .env.example .env
# Edit .env with your values
```

Generate JWT secrets:

```bash
openssl rand -base64 32  # Use output for JWT_ACCESS_SECRET
openssl rand -base64 32  # Use output for JWT_REFRESH_SECRET
```

Example `.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/the_quiet_codex_dev
JWT_ACCESS_SECRET=your-generated-secret-here
JWT_REFRESH_SECRET=your-generated-secret-here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

## Install & Run

```bash
bun install
bun run db:generate
bun run db:migrate
bun run dev
```

- API: http://localhost:3000
- Docs: http://localhost:3000/docs

## Available Scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `bun run dev`         | Start development server with hot reload |
| `bun run build`       | Build for production                     |
| `bun run start`       | Start production server                  |
| `bun run lint`        | Run ESLint                               |
| `bun run typecheck`   | Run TypeScript type checking             |
| `bun run test`        | Run tests                                |
| `bun run test:watch`  | Run tests in watch mode                  |
| `bun run validate`    | Run lint, typecheck, and tests           |
| `bun run db:generate` | Generate Drizzle migrations              |
| `bun run db:migrate`  | Apply database migrations                |
| `bun run db:studio`   | Open Drizzle Studio                      |
| `bun run db:seed`     | Seed database with test data             |

## API Endpoints

| Method | Path            | Auth     | Description           |
| ------ | --------------- | -------- | --------------------- |
| GET    | `/health`       | Public   | Health check          |
| POST   | `/auth/signup`  | Public   | Register new user     |
| POST   | `/auth/signin`  | Public   | Login, issue tokens   |
| POST   | `/auth/refresh` | Cookie   | Refresh access token  |
| POST   | `/auth/logout`  | Required | Invalidate all tokens |
| GET    | `/users/me`     | Required | Get current user      |
| PUT    | `/users/me`     | Required | Update current user   |
| DELETE | `/users/me`     | Required | Delete current user   |

## Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test src/modules/auth/auth.test.ts
```

## Project Structure

```
src/
├── index.ts              # App composition & export type
├── server.ts             # Bootstrap / listen
│
├── modules/
│   ├── auth/             # Authentication module
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   ├── auth.schema.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.guard.ts
│   │   ├── jwt.plugin.ts
│   │   └── auth.test.ts
│   │
│   └── user/             # User management module
│       ├── user.routes.ts
│       ├── user.service.ts
│       ├── user.schema.ts
│       ├── user.repository.ts
│       └── user.test.ts
│
├── db/
│   ├── index.ts          # Drizzle client instance
│   ├── schema/           # Database schemas
│   ├── migrations/       # Drizzle migrations
│   └── seed.ts           # Development seed script
│
├── lib/
│   ├── env.ts            # Environment config
│   └── errors.ts         # Custom error classes
│
└── plugins/
    └── error-handler.ts  # Global error handler
```
