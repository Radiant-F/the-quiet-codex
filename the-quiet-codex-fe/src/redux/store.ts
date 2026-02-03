import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/api/apiSlice";
import { authReducer } from "@/features/auth";
import { todoFiltersReducer } from "@/features/todo";

// Factory function to create a new store instance
// This is critical for SSR to avoid sharing state between requests
export function createStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      todoFilters: todoFiltersReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (defaultMiddleware) =>
      defaultMiddleware().concat(apiSlice.middleware),
  });
}

// Create a singleton store for client-side only
// This ensures the same store instance is used throughout the client app
let clientStore: ReturnType<typeof createStore> | undefined;

export function getStore() {
  // Server: always create a new store to avoid sharing state between requests
  if (typeof window === "undefined") {
    return createStore();
  }

  // Client: reuse the same store instance
  if (!clientStore) {
    clientStore = createStore();
  }
  return clientStore;
}

// For backwards compatibility, export a store getter
// Components should use the store from context, but this helps with type inference
export const store = typeof window === "undefined" ? createStore() : getStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
