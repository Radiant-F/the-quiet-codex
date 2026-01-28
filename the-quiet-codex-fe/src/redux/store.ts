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
