# AI Scaffolding Prompt (React + Vite + TS SWC + Bun)

You are an AI developer assistant. Your task is to scaffold a frontend React app that matches the structure and patterns of this project. This prompt assumes the user has already created a default React + Vite + TypeScript SWC project using Bun. Do NOT use this prompt for other frameworks (Vue, Svelte, etc.).

## Goals

- Use Bun for package management.
- Set up React + Vite + TypeScript SWC.
- Add Tailwind CSS v4 with the Vite plugin.
- Add Redux Toolkit + RTK Query with async mutex handling for refresh token flow.
- Add React Router DOM.
- Add React Hook Form.
- Add React Icons.
- Add Motion (animation library).
- Provide minimal placeholder UI that includes a theme switcher (light/dark or system).
- Use the folder structure and file layout defined below.
- After implementing, run typechecking and fix issues.

## Install Dependencies (Bun only)

Use Bun commands only, never edit package.json directly.

```bash
bun add @reduxjs/toolkit react-redux @tailwindcss/vite tailwindcss react-router-dom react-hook-form react-icons motion async-mutex
```

Dev dependencies (if not present):

```bash
bun add -d @vitejs/plugin-react-swc typescript @types/react @types/react-dom
```

## Tailwind CSS v4 Setup (Vite)

1. Update Vite config to include the Tailwind plugin.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

2. In the main CSS entry, import Tailwind.

```css
/* src/index.css */
@import "tailwindcss";
```

## Project Structure (create these folders and files)

```
src/
  api/
    api.slice.ts
    rtk-query-error.ts
  assets/
  components/
    DesignNav.tsx
    index.ts
  features/
    auth/
      auth.domain.ts
      index.ts
      components/
        AuthForm.tsx
        AuthHeader.tsx
      services/
        auth.api.ts
        auth.reducer.ts
    task/
      task.domain.ts
      index.ts
      components/
        CreateTaskForm.tsx
        TaskList.tsx
        TaskCard.tsx
        SubtaskList.tsx
        AddSubtaskForm.tsx
        TaskFilterBar.tsx
      services/
        task.api.ts
  hooks/
    index.ts
  pages/
    root/
      index.tsx
    auth/
      index.tsx
    home/
      index.tsx
  redux/
    store.ts
  App.tsx
  main.tsx
  index.css
```

## Redux Store + Hooks

Create a typed store and typed hooks.

```ts
// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";
import { apiSlice } from "../api/api.slice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// src/hooks/index.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
```

## RTK Query Base API + Async Mutex Refresh

Implement a base API slice with async-mutex to avoid multiple refresh calls.

```ts
// src/api/api.slice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../redux/store";
import { clearSession, setUserSession } from "../features/auth";
import type { AuthResponse } from "../features/auth";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, api) => {
    const accessToken = (api.getState() as RootState).auth.accessToken;
    if (accessToken) headers.append("Authorization", `Bearer ${accessToken}`);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await rawBaseQuery(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions,
        );
        if (
          refreshResult.data &&
          typeof refreshResult.data === "object" &&
          "accessToken" in refreshResult.data
        ) {
          api.dispatch(setUserSession(refreshResult.data as AuthResponse));
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearSession());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Task", "TaskList"],
  endpoints: () => ({}),
});
```

```ts
// src/api/rtk-query-error.ts
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type QueryErrorInfo =
  | {
      kind: "fetch";
      status: FetchBaseQueryError["status"];
      data?: FetchBaseQueryError["data"];
      raw: FetchBaseQueryError;
    }
  | {
      kind: "serialized";
      message?: string;
      raw: SerializedError;
    }
  | {
      kind: "unknown";
      raw: unknown;
    };

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === "object" && error !== null && "status" in error;

const isSerializedError = (error: unknown): error is SerializedError =>
  typeof error === "object" && error !== null && "message" in error;

const unwrapError = (error: unknown): unknown => {
  if (typeof error === "object" && error !== null && "error" in error) {
    return (error as { error?: unknown }).error;
  }

  return error;
};

const getRtkQueryErrorInfo = (error: unknown): QueryErrorInfo => {
  const unwrapped = unwrapError(error);

  if (isFetchBaseQueryError(unwrapped)) {
    return {
      kind: "fetch",
      status: unwrapped.status,
      data: unwrapped.data,
      raw: unwrapped,
    };
  }

  if (isSerializedError(unwrapped)) {
    return {
      kind: "serialized",
      message: unwrapped.message,
      raw: unwrapped,
    };
  }

  return { kind: "unknown", raw: unwrapped };
};

export { getRtkQueryErrorInfo, isFetchBaseQueryError, isSerializedError };
export type { QueryErrorInfo };
```

## Auth Feature (Domain + Slice + API)

Create typed auth models, reducer, and RTK Query endpoints with logging of query errors.

```ts
// src/features/auth/auth.domain.ts
export interface User {
  username: string;
  id: string;
}

export interface AuthState {
  accessToken: string;
  user: User;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface SignInRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface UpdateMeRequest {
  username?: string;
  password?: string;
}

export interface LogoutResponse {
  message: string;
}
```

```ts
// src/features/auth/services/auth.reducer.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../auth.domain";

const initialState: AuthState = {
  accessToken: "",
  user: {
    id: "",
    username: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserSession(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearSession(state) {
      state.accessToken = "";
      state.user = { id: "", username: "" };
    },
  },
});

export const { setUserSession, setAccessToken, clearSession } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
```

```ts
// src/features/auth/services/auth.api.ts
import { apiSlice } from "../../../api/api.slice";
import type {
  AuthResponse,
  SignInRequest,
  SignUpRequest,
  UpdateMeRequest,
  LogoutResponse,
  User,
} from "../auth.domain";
import { clearSession, setUserSession } from "./auth.reducer";
import { getRtkQueryErrorInfo } from "../../../api/rtk-query-error";

const logQueryError = (error: unknown) => {
  const errorInfo = getRtkQueryErrorInfo(error);
  switch (errorInfo.kind) {
    case "fetch":
      console.log("RESPONSE ERROR QUERY:", errorInfo.status, errorInfo.data);
      break;
    case "serialized":
      console.log("RESPONSE ERROR SERIALIZED:", errorInfo.message);
      break;
    default:
      console.log("RESPONSE ERROR ANY:", errorInfo.raw);
      break;
  }
};

export const authApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserSession(data));
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    signIn: builder.mutation<AuthResponse, SignInRequest>({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserSession(data));
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserSession(data));
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(clearSession());
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    me: builder.query<User, null>({
      query: () => "/users/me",
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    updateMe: builder.mutation<User, UpdateMeRequest>({
      query: (payload) => ({
        url: "/users/me",
        method: "PUT",
        body: payload,
      }),
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    deleteMe: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(clearSession());
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useRefreshMutation,
  useLogoutMutation,
  useMeQuery,
  useUpdateMeMutation,
  useDeleteMeMutation,
} = authApiSlice;
```

```ts
// src/features/auth/index.ts
export * from "./auth.domain";
export * from "./services/auth.api";
export {
  authReducer,
  setUserSession,
  setAccessToken,
  clearSession,
} from "./services/auth.reducer";
export { default as AuthHeader } from "./components/AuthHeader";
export { default as AuthForm } from "./components/AuthForm";
```

## Task Feature (Domain + API)

```ts
// src/features/task/task.domain.ts
export interface Subtask {
  id: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  isImportant: boolean;
  dueAt?: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
}

export interface PaginatedTasks {
  items: Task[];
  nextCursor?: string | null;
}

export interface CreateSubtaskRequest {
  title: string;
  description?: string;
  isCompleted?: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  isImportant?: boolean;
  dueAt?: string;
  isCompleted?: boolean;
  subtasks?: CreateSubtaskRequest[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  isImportant?: boolean;
  dueAt?: string;
  isCompleted?: boolean;
}

export interface AddSubtasksRequest {
  subtasks: CreateSubtaskRequest[];
}

export interface UpdateSubtaskRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}

export interface TaskListParams {
  limit?: number;
  cursor?: string;
  isImportant?: boolean;
  dueFrom?: string;
  dueTo?: string;
  isCompleted?: boolean;
}

export interface TaskMessageResponse {
  message: string;
}
```

```ts
// src/features/task/services/task.api.ts
import { apiSlice } from "../../../api/api.slice";
import type {
  AddSubtasksRequest,
  CreateTaskRequest,
  PaginatedTasks,
  Task,
  TaskListParams,
  TaskMessageResponse,
  UpdateSubtaskRequest,
  UpdateTaskRequest,
} from "../task.domain";
import { getRtkQueryErrorInfo } from "../../../api/rtk-query-error";

const logQueryError = (error: unknown) => {
  const errorInfo = getRtkQueryErrorInfo(error);
  switch (errorInfo.kind) {
    case "fetch":
      console.log("RESPONSE ERROR QUERY:", errorInfo.status, errorInfo.data);
      break;
    case "serialized":
      console.log("RESPONSE ERROR SERIALIZED:", errorInfo.message);
      break;
    default:
      console.log("RESPONSE ERROR ANY:", errorInfo.raw);
      break;
  }
};

export const taskApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (payload) => ({
        url: "/tasks/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TaskList"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    listTasks: builder.query<PaginatedTasks, TaskListParams | void>({
      query: (params) =>
        params
          ? {
              url: "/tasks/",
              params,
            }
          : "/tasks/",
      providesTags: (result) => {
        if (!result) return ["TaskList"];
        return [
          "TaskList",
          ...result.items.map((task) => ({
            type: "Task" as const,
            id: task.id,
          })),
        ];
      },
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    updateTask: builder.mutation<Task, { id: string; data: UpdateTaskRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/tasks/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          "TaskList",
          { type: "Task", id },
        ],
        onQueryStarted: async (_args, { queryFulfilled }) => {
          try {
            const { data } = await queryFulfilled;
            console.log("RESPONSE SUCCESS:", data);
          } catch (error) {
            logQueryError(error);
          }
        },
      },
    ),
    deleteTask: builder.mutation<TaskMessageResponse, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "TaskList",
        { type: "Task", id },
      ],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    addSubtasks: builder.mutation<
      Task,
      { id: string; payload: AddSubtasksRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/tasks/${id}/subtasks`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "TaskList",
        { type: "Task", id },
      ],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    updateSubtask: builder.mutation<
      Task,
      { id: string; subtaskId: string; payload: UpdateSubtaskRequest }
    >({
      query: ({ id, subtaskId, payload }) => ({
        url: `/tasks/${id}/subtasks/${subtaskId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "TaskList",
        { type: "Task", id },
      ],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    deleteSubtask: builder.mutation<
      TaskMessageResponse,
      { id: string; subtaskId: string }
    >({
      query: ({ id, subtaskId }) => ({
        url: `/tasks/${id}/subtasks/${subtaskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "TaskList",
        { type: "Task", id },
      ],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useListTasksQuery,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAddSubtasksMutation,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
} = taskApiSlice;
```

```ts
// src/features/task/index.ts
export * from "./task.domain";
export * from "./services/task.api";
export { default as CreateTaskForm } from "./components/CreateTaskForm";
export { default as TaskList } from "./components/TaskList";
export { default as TaskCard } from "./components/TaskCard";
export { default as SubtaskList } from "./components/SubtaskList";
export { default as AddSubtaskForm } from "./components/AddSubtaskForm";
export { default as TaskFilterBar } from "./components/TaskFilterBar";
export type { TaskFilters } from "./components/TaskFilterBar";
```

## Router + Pages

Use a simple router structure with guest and protected routes.

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Root from "./pages/root";
import Auth from "./pages/auth";
import Home from "./pages/home";
import { useAppSelector } from "./hooks";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  if (!accessToken) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  if (accessToken) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route
          path="/auth"
          element={
            <GuestRoute>
              <Auth />
            </GuestRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./redux/store.ts";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>,
);
```

## Minimal Placeholder UI (Theme Switcher)

Add a minimal placeholder to show light/dark/system theme support. Keep this simple and focused.

Example component:

```tsx
// src/components/ThemeToggle.tsx
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const resolved =
      theme === "system" ? (systemDark ? "dark" : "light") : theme;
    root.dataset.theme = resolved;
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-3 py-1 rounded-full border ${theme === "light" ? "bg-black text-white" : "bg-white text-black"}`}
        onClick={() => setTheme("light")}
      >
        light
      </button>
      <button
        className={`px-3 py-1 rounded-full border ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
        onClick={() => setTheme("dark")}
      >
        dark
      </button>
      <button
        className={`px-3 py-1 rounded-full border ${theme === "system" ? "bg-black text-white" : "bg-white text-black"}`}
        onClick={() => setTheme("system")}
      >
        system
      </button>
    </div>
  );
}
```

In your root page, render this component near the top and define light/dark styles using Tailwind classes or CSS variables. Keep styling minimal and clean.

## Environment Variables

Define the API base URL:

```
VITE_BASE_API_URL=https://your-api.example.com
```

## Typecheck After Implementation

After all scaffolding and example code is in place, run typechecking and fix any issues:

```bash
bun run tsc -b
```

If errors appear, fix them and re-run until it passes cleanly.

## Final Notes

- Keep examples minimal, production-friendly, and easy to extend.
- The placeholder UI should prove integration of routing, Tailwind, and a small interactive component.
- Do not add extra frameworks or change the base project setup.
