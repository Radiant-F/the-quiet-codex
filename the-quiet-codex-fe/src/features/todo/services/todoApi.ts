import { apiSlice } from "@/api/apiSlice";
import type { Todo, Tag, CreateTodoRequest, UpdateTodoRequest } from "../todo";

export const todoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query<{ todos: Todo[] }, void>({
      query: () => "/todos",
      providesTags: ["Todo"],
    }),
    getTodo: builder.query<{ todo: Todo }, string>({
      query: (id) => `/todos/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Todo", id }],
    }),
    createTodo: builder.mutation<{ todo: Todo }, CreateTodoRequest>({
      query: (data) => ({
        url: "/todos",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),
    updateTodo: builder.mutation<{ todo: Todo }, UpdateTodoRequest>({
      query: ({ id, ...data }) => ({
        url: `/todos/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Todo", id },
        "Todo",
      ],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
    getTags: builder.query<{ tags: Tag[] }, void>({
      query: () => "/tags",
      providesTags: ["Tag"],
    }),
    createTag: builder.mutation<{ tag: Tag }, { name: string; color?: string }>(
      {
        query: (data) => ({
          url: "/tags",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Tag"],
      },
    ),
    deleteTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tag"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useGetTagsQuery,
  useCreateTagMutation,
  useDeleteTagMutation,
} = todoApi;
