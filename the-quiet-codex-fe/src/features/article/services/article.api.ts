import { apiSlice } from "../../../api/api.slice";
import type {
  Article,
  ArticleListParams,
  ArticleMeta,
  BannerUploadResponse,
  CreateArticleRequest,
  MessageResponse,
  MyArticleListParams,
  PaginatedArticles,
  UpdateArticleRequest,
} from "../article.domain";
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

export const articleApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── Public endpoints ────────────────
    listArticles: builder.query<PaginatedArticles, ArticleListParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        if (params?.authorId) searchParams.set("authorId", params.authorId);
        const qs = searchParams.toString();
        return `/articles${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.articles.map((a) => ({
                type: "Article" as const,
                id: a.id,
              })),
              { type: "ArticleList" },
            ]
          : [{ type: "ArticleList" }],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),

    getArticleBySlug: builder.query<Article, string>({
      query: (slug) => `/articles/slug/${slug}`,
      providesTags: (result) =>
        result ? [{ type: "Article", id: result.id }] : [],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),

    getArticleMeta: builder.query<ArticleMeta, string>({
      query: (slug) => `/articles/slug/${slug}/meta`,
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),

    // ── Protected endpoints ─────────────
    listMyArticles: builder.query<
      PaginatedArticles,
      MyArticleListParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        const qs = searchParams.toString();
        return `/articles/me${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.articles.map((a) => ({
                type: "Article" as const,
                id: a.id,
              })),
              { type: "MyArticleList" },
            ]
          : [{ type: "MyArticleList" }],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),

    createArticle: builder.mutation<Article, CreateArticleRequest>({
      query: (body) => ({
        url: "/articles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyArticleList", "ArticleList"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),

    getArticleById: builder.query<Article, string>({
      query: (id) => `/articles/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Article", id }],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),

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
        { type: "Article", id },
        "MyArticleList",
        "ArticleList",
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

    deleteArticle: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyArticleList", "ArticleList"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),

    uploadBanner: builder.mutation<
      BannerUploadResponse,
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
        { type: "Article", id },
        "MyArticleList",
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

    deleteBanner: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/articles/${id}/banner`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Article", id },
        "MyArticleList",
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
  useListArticlesQuery,
  useGetArticleBySlugQuery,
  useGetArticleMetaQuery,
  useListMyArticlesQuery,
  useCreateArticleMutation,
  useGetArticleByIdQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useUploadBannerMutation,
  useDeleteBannerMutation,
} = articleApiSlice;
