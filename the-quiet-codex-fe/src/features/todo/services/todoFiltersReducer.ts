import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TodoFiltersState } from "../todo";

const initialState: TodoFiltersState = {
  status: "all",
  tagId: null,
  searchQuery: "",
};

const todoFiltersSlice = createSlice({
  name: "todoFilters",
  initialState,
  reducers: {
    setStatusFilter(
      state,
      action: PayloadAction<"all" | "active" | "completed">,
    ) {
      state.status = action.payload;
    },
    setTagFilter(state, action: PayloadAction<string | null>) {
      state.tagId = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    resetFilters(state) {
      state.status = "all";
      state.tagId = null;
      state.searchQuery = "";
    },
  },
});

export const { setStatusFilter, setTagFilter, setSearchQuery, resetFilters } =
  todoFiltersSlice.actions;

export const todoFiltersReducer = todoFiltersSlice.reducer;
