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

// For client-side, we use a singleton store
// This is created lazily to avoid issues with SSR
let _store: ReturnType<typeof createStore> | null = null;

export function getClientStore() {
  if (typeof window === "undefined") {
    // On server, always return a new store
    return createStore();
  }

  // On client, use singleton
  if (!_store) {
    _store = createStore();
  }
  return _store;
}

// Export the store getter for use in components
export const getStore = getClientStore;

// Type exports for hooks
export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
