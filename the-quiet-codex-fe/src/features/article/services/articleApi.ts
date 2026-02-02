import { apiSlice } from "@/api/apiSlice";
import type {
  Article,
  ArticleListParams,
  ArticleMeta,
  CreateArticleRequest,
  MessageResponse,
  PaginatedArticleList,
  UpdateArticleRequest,
  UploadBannerResponse,
} from "../article.d";

export const articleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ============ Public Endpoints ============

    // List published articles (public)
    listPublishedArticles: builder.query<
      PaginatedArticleList,
      ArticleListParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        if (params?.authorId) searchParams.set("authorId", params.authorId);
        const queryString = searchParams.toString();
        return `/articles${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.articles.map(({ id }) => ({
                type: "Article" as const,
                id,
              })),
              { type: "Article", id: "LIST" },
            ]
          : [{ type: "Article", id: "LIST" }],
    }),

    // Get published article by slug (public)
    getArticleBySlug: builder.query<Article, string>({
      query: (slug) => `/articles/slug/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Article", id: slug }],
    }),

    // Get article meta for Open Graph (public)
    getArticleMeta: builder.query<ArticleMeta, string>({
      query: (slug) => `/articles/slug/${slug}/meta`,
    }),

    // ============ Protected Endpoints ============

    // List my articles (protected)
    listMyArticles: builder.query<
      PaginatedArticleList,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        const queryString = searchParams.toString();
        return `/articles/me${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.articles.map(({ id }) => ({
                type: "MyArticle" as const,
                id,
              })),
              { type: "MyArticle", id: "LIST" },
            ]
          : [{ type: "MyArticle", id: "LIST" }],
    }),

    // Get article by ID (protected - can view own drafts)
    getArticleById: builder.query<Article, string>({
      query: (id) => `/articles/${id}`,
      providesTags: (_result, _error, id) => [{ type: "MyArticle", id }],
    }),

    // Create article (protected)
    createArticle: builder.mutation<Article, CreateArticleRequest>({
      query: (body) => ({
        url: "/articles",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Article", id: "LIST" },
        { type: "MyArticle", id: "LIST" },
      ],
    }),

    // Update article (protected)
    updateArticle: builder.mutation<
      Article,
      { id: string; data: UpdateArticleRequest }
    >({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Article", id: "LIST" },
        { type: "MyArticle", id: "LIST" },
        { type: "MyArticle", id },
      ],
    }),

    // Delete article (protected)
    deleteArticle: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Article", id: "LIST" },
        { type: "MyArticle", id: "LIST" },
      ],
    }),

    // Upload banner image (protected)
    uploadBanner: builder.mutation<
      UploadBannerResponse,
      { id: string; file: File }
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/articles/${id}/banner`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MyArticle", id },
        { type: "Article", id: "LIST" },
      ],
    }),

    // Delete banner image (protected)
    deleteBanner: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/articles/${id}/banner`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MyArticle", id },
        { type: "Article", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListPublishedArticlesQuery,
  useGetArticleBySlugQuery,
  useGetArticleMetaQuery,
  useListMyArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useUploadBannerMutation,
  useDeleteBannerMutation,
} = articleApi;
