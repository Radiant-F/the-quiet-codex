import { apiSlice } from "../../../api/api.slice";
import type {
  Article,
  ArticleListParams,
  ArticleMeta,
  CreateArticleRequest,
  MessageResponse,
  MyArticleListParams,
  PaginatedArticles,
  UpdateArticleRequest,
} from "../article.domain";
import { getRtkQueryErrorInfo } from "../../../api/rtk-query-error";

function appendIfDefined(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value === "boolean") {
    formData.append(key, String(value));
    return;
  }

  if (value instanceof File) {
    formData.append(key, value);
    return;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      formData.append(key, trimmed);
    }
    return;
  }

  formData.append(key, String(value));
}

function toArticleFormData(
  payload: CreateArticleRequest | UpdateArticleRequest,
): FormData {
  const formData = new FormData();
  appendIfDefined(formData, "title", payload.title);
  appendIfDefined(formData, "metaDescription", payload.metaDescription);
  appendIfDefined(formData, "body", payload.body);
  appendIfDefined(formData, "slug", payload.slug);
  appendIfDefined(formData, "publish", payload.publish);
  appendIfDefined(formData, "banner", payload.banner);

  if ("removeBanner" in payload) {
    appendIfDefined(formData, "removeBanner", payload.removeBanner);
  }

  return formData;
}

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
        body: toArticleFormData(body),
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
        body: toArticleFormData(data),
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
} = articleApiSlice;
