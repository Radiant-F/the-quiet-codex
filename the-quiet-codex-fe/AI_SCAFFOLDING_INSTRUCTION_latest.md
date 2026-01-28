# Frontend Scaffolding Instruction (React Router v7 SSR)

You are a senior frontend architect and TypeScript engineer.

Your task is to scaffold a production-ready frontend project that **exactly matches the current frontend setup** in this repository. Follow all instructions carefully and **do not deviate** from the versions, tooling, or structure described below.

---

## CORE STACK & RUNTIME

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Runtime          | Node (Vite tooling)                     |
| Framework        | React 19                                |
| Router (SSR)     | React Router v7 (SSR enabled)           |
| Build Tool       | Vite 7                                  |
| Language         | TypeScript (strict)                     |
| State Management | Redux Toolkit + RTK Query               |
| Styling          | Tailwind CSS v4 (via @tailwindcss/vite) |
| Forms            | react-hook-form                         |
| Icons            | react-icons                             |
| Linting          | ESLint (flat config)                    |

> ✅ **Always use the latest versions** and install via Bun commands only. **Never** edit package.json manually for dependencies.

---

## REQUIRED DEPENDENCIES (LATEST VIA BUN)

Install dependencies using Bun only. **Do not edit package.json manually**.

### Dependencies (install with bun)

```bash
bun add \
  @react-router/node \
  @react-router/serve \
  @reduxjs/toolkit \
  @tailwindcss/vite \
  isbot \
  react \
  react-dom \
  react-hook-form \
  react-icons \
  react-redux \
  react-router \
  react-router-dom \
  tailwindcss
```

### Dev Dependencies (install with bun)

```bash
bun add -d \
  @eslint/js \
  @react-router/dev \
  @types/node \
  @types/react \
  @types/react-dom \
  @vitejs/plugin-react-swc \
  eslint \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  globals \
  typescript \
  typescript-eslint \
  vite
```

---

## REQUIRED SCRIPTS (package.json)

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "tsc -b && react-router build",
    "start": "react-router-serve build/server/index.js",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

---

## REACT ROUTER V7 + SSR SETUP

### 1) react-router.config.ts

```ts
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: true,
} satisfies Config;
```

### 2) Vite configuration (vite.config.ts)

```ts
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 3) App entry points (SSR)

#### src/entry.client.tsx

```tsx
import { HydratedRouter } from "react-router/dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
```

#### src/entry.server.tsx

```tsx
import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";
import type { EntryContext } from "react-router";

export const streamTimeout = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: any,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}
```

### 4) Route configuration (src/routes.ts)

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/root/index.tsx"),
  route("auth", "pages/auth/index.tsx"),
  route("home", "pages/home/index.tsx"),
] satisfies RouteConfig;
```

### 5) React Router Generated Types

React Router auto-generates `.react-router/types/` on first dev server run. These files:

- Provide route-level type safety (`Route.LoaderArgs`, `Route.ErrorBoundaryProps`, etc.)
- Are committed to version control
- Should **not** be manually edited

> Run `bun run dev` once to generate them before importing route types.

---

## REDUX TOOLKIT + RTK QUERY

### Store (src/redux/store.ts)

```ts
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/api/apiSlice";
import { authReducer } from "@/features/auth";
import { todoFiltersReducer } from "@/features/todo";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todoFilters: todoFiltersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### RTK Query base slice (src/api/apiSlice.ts)

```ts
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/redux/store";
import type { TokenResponse } from "@/features/auth/auth";
import { logout, setAccessToken } from "@/features/auth/services/authReducer";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "string" ? args : args.url;
  const isAuthRequest = requestUrl?.startsWith("/auth/") ?? false;

  if (result.error && result.error.status === 401 && !isAuthRequest) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as TokenResponse;
      api.dispatch(setAccessToken(accessToken));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Todo", "Tag"],
  endpoints: () => ({}),
});
```

---

## ERROR HANDLING PATTERNS

### API Error Typing

Create a shared error type for consistent API error handling:

```ts
// src/types/api.d.ts
export interface ApiError {
  status: number;
  data: {
    message: string;
    code?: string;
  };
}
```

Usage in components:

```tsx
const [login, { error }] = useLoginMutation();

if (error && "data" in error) {
  const apiError = error as ApiError;
  console.error(apiError.data.message);
}
```

### Form Validation

Always define validation rules with clear error messages:

```tsx
register("email", {
  required: "Email is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email format",
  },
});

register("password", {
  required: "Password is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
});
```

### Async Error Boundaries

For SSR, handle errors gracefully in loaders:

```ts
export async function loader({ request }: Route.LoaderArgs) {
  try {
    const data = await fetchData();
    return { data };
  } catch (error) {
    throw new Response("Failed to load data", { status: 500 });
  }
}
```

---

## TAILWIND CSS v4 SETUP

### Tailwind Vite plugin

Already wired in [vite.config.ts](vite.config.ts) via:

```ts
import tailwindcss from "@tailwindcss/vite";
// ...
plugins: [reactRouter(), tailwindcss()];
```

### Global stylesheet (src/index.css)

Keep the stylesheet minimal but include **clear light/dark theme variables** with appropriate contrast for text, page background, surface, and elevated layers. Also provide a few lightweight utility classes to demonstrate usage in placeholder pages:

```css
@import "tailwindcss";

:root {
  color-scheme: light dark;
  --page-bg: #0b0f19;
  --page-surface: #111827;
  --page-elevated: #1f2937;
  --page-text: #e5e7eb;
  --page-muted: #9ca3af;
  --page-border: #273241;
  --page-accent: #38bdf8;
}

:root[data-theme="light"] {
  color-scheme: light;
  --page-bg: #f8fafc;
  --page-surface: #ffffff;
  --page-elevated: #f1f5f9;
  --page-text: #0f172a;
  --page-muted: #475569;
  --page-border: #e2e8f0;
  --page-accent: #2563eb;
}

:root[data-theme="dark"] {
  color-scheme: dark;
}

body {
  background: var(--page-bg);
  color: var(--page-text);
}

.theme-page {
  background: var(--page-bg);
  color: var(--page-text);
}

.theme-surface {
  background: var(--page-surface);
  color: var(--page-text);
}

.theme-elevated {
  background: var(--page-elevated);
  color: var(--page-text);
}

.theme-muted {
  color: var(--page-muted);
}

.theme-border {
  border-color: var(--page-border);
}

.theme-accent {
  color: var(--page-accent);
}
```

---

## ENVIRONMENT CONFIGURATION

### Required Variables

| Variable            | Description          | Example                 |
| ------------------- | -------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:1337` |

### .env.example

```env
VITE_API_BASE_URL=http://host:1337
```

### Runtime Validation (optional)

For stricter env handling, create `src/lib/env.ts`:

```ts
const requiredEnvVars = ["VITE_API_BASE_URL"] as const;

for (const key of requiredEnvVars) {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
};
```

---

## TYPE CHECKING & TYPESCRIPT SETUP

### Validation Scripts

Add these scripts to package.json for CI/pre-commit checks:

```json
{
  "scripts": {
    "typecheck": "tsc -b --noEmit",
    "lint:fix": "eslint . --fix",
    "validate": "bun run typecheck && bun run lint"
  }
}
```

### Strict TypeScript Rules

This project enforces strict mode. Key constraints:

- **No `any`** — use `unknown` with type guards instead
- **Explicit return types** on exported functions
- **No implicit `any`** in catch blocks (use `unknown`)
- **No unused variables/parameters** — prefix with `_` if intentionally unused

### tsconfig.json

```jsonc
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
  ],
}
```

### tsconfig.app.json

```jsonc
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
    },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["node", "vite/client", "@react-router/node"],
    "rootDirs": [".", "./.react-router/types"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
  },
  "include": ["src"],
}
```

---

## ESLINT SETUP (flat config)

### eslint.config.js

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
```

---

## ROOT LAYOUT & PROVIDERS

### src/root.tsx

```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthBootstrap } from "./features/auth";
import { I18nProvider } from "./i18n";
import { ThemeProvider } from "./theme";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Project Name</title>
        <meta property="og:title" content="Project Name" />
        <meta property="og:description" content="Project description." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/vite.svg" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <ThemeProvider>
            <I18nProvider>
              <AuthBootstrap />
              {children}
            </I18nProvider>
          </ThemeProvider>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto theme-page min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{message}</h1>
      <p className="text-lg mb-4">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-black/50 rounded-lg">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
```

---

## THEME (LIGHT / DARK / SYSTEM)

Implement a theme system with three modes: `light`, `dark`, and `system` (follow device). **Default must be `system`.**

**Behavior requirements:**

- Store the selected mode (e.g., in localStorage).
- When mode is `system`, follow `prefers-color-scheme` and update on changes.
- Apply theme by setting `data-theme="light"` or `data-theme="dark"` on `document.documentElement`.
- If `system`, do not force `data-theme` unless you map it from the OS.

Minimal implementation can live in [src/theme/index.tsx](src/theme/index.tsx), and the provider must wrap the app as shown in [src/root.tsx](src/root.tsx).

---

## REACT HOOK FORM INTEGRATION

Use `react-hook-form` for all user forms. Each feature can include a local form component that uses the following pattern:

```tsx
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

export function ExampleForm() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // handle values
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="email" {...register("email")} />
      <input type="password" {...register("password")} />
      {formState.errors.email && <span>Invalid email</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## BASIC LOCALIZATION (ENGLISH / INDONESIA)

Provide a minimal localization setup with **English (default)** and **Indonesia**. The placeholder pages should read their text from the localization layer.

**Requirements:**

- Default locale: `en`.
- Support `id`.
- Store selected locale (e.g., localStorage).
- Create a lightweight dictionary and context provider in [src/i18n/index.tsx](src/i18n/index.tsx).
- Use the provider in [src/root.tsx](src/root.tsx).

Example minimal dictionary:

```ts
const messages = {
  en: {
    pages: {
      root: "Welcome",
      auth: "Auth Page",
      home: "Home Page",
    },
  },
  id: {
    pages: {
      root: "Selamat Datang",
      auth: "Halaman Auth",
      home: "Halaman Beranda",
    },
  },
} as const;
```

The placeholder UI should render these strings in the page components.

---

## FOLDER STRUCTURE

### Root Files

| File                     | Purpose                         |
| ------------------------ | ------------------------------- |
| `react-router.config.ts` | React Router SSR configuration  |
| `vite.config.ts`         | Vite + Tailwind + path aliases  |
| `tsconfig.json`          | TypeScript project references   |
| `tsconfig.app.json`      | App-specific TS config (strict) |
| `eslint.config.js`       | ESLint flat config              |
| `.env` / `.env.example`  | Environment variables           |

### Source Directory (`src/`)

| Path                      | Purpose                                                |
| ------------------------- | ------------------------------------------------------ |
| `api/apiSlice.ts`         | RTK Query base slice with auth refresh                 |
| `components/`             | Shared UI components (Button, FormInput, Selects)      |
| `features/<name>/`        | Feature modules (auth, todo, root)                     |
| `hooks/index.ts`          | Typed Redux hooks (`useAppDispatch`, `useAppSelector`) |
| `i18n/index.tsx`          | Localization provider & dictionaries                   |
| `pages/<route>/index.tsx` | Route page components                                  |
| `redux/store.ts`          | Redux store configuration                              |
| `theme/index.tsx`         | Theme provider (light/dark/system)                     |
| `entry.client.tsx`        | Client hydration entry                                 |
| `entry.server.tsx`        | SSR streaming entry                                    |
| `root.tsx`                | Root layout with providers                             |
| `routes.ts`               | Route definitions                                      |
| `index.css`               | Global styles + Tailwind import                        |

### Feature Module Structure

Each feature follows this pattern:

```
features/<name>/
├── index.ts          # Public exports (barrel file)
├── <name>.d.ts       # Type definitions
├── components/       # UI components
└── services/         # Redux slices & RTK Query endpoints
```

### Initial Features

| Feature | Purpose                                                      |
| ------- | ------------------------------------------------------------ |
| `auth`  | Authentication state, API endpoints, bootstrap               |
| `todo`  | Todo CRUD, filters, list components                          |
| `root`  | Landing page components (Hero, Features, Navigation, Footer) |

---

## IMPORTANT IMPLEMENTATION RULES

1. **React Router v7 SSR must be enabled** (`ssr: true`) and use `@react-router/dev` tooling.
2. **Tailwind v4 must use `@tailwindcss/vite`** and only `@import "tailwindcss";` in [src/index.css](src/index.css).
3. **Redux store must include RTK Query** and set up the auth + todo slices exactly as shown.
4. **Use the alias `@` -> `src`** in both Vite and TS config.
5. **Keep file/folder naming identical** to the structure above.

---

## TESTING (FUTURE)

Testing setup is not included in the initial scaffold. When adding tests:

| Tool                          | Purpose                  |
| ----------------------------- | ------------------------ |
| **Vitest**                    | Unit & integration tests |
| **React Testing Library**     | Component testing        |
| **Playwright** or **Cypress** | End-to-end testing       |

Place test files adjacent to source: `Component.test.tsx`

---

## RUNNING LOCALLY

```bash
# Install dependencies
bun install

# Dev server (React Router SSR)
bun run dev

# Type check
bun run typecheck

# Lint
bun run lint

# Build for production
bun run build

# Serve SSR build
bun run start
```

> Ensure `VITE_API_BASE_URL` is defined in `.env` before running.
