import { Elysia, t } from "elysia";
import {
  articleResponse,
  articleListResponse,
  articleMetaResponse,
  articleListQuery,
  errorResponse,
  messageResponse,
} from "./article.schema";
import { articleService } from "./article.service";
import { authGuard } from "../auth/auth.guard";
import { NotFoundError, ConflictError, ForbiddenError } from "../../lib/errors";

function normalizeFieldName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getNormalizedField(
  payload: Record<string, unknown>,
  field: string,
): unknown {
  if (payload[field] !== undefined) {
    return payload[field];
  }

  const target = normalizeFieldName(field);
  for (const [key, value] of Object.entries(payload)) {
    if (normalizeFieldName(key) === target) {
      return value;
    }
  }

  return undefined;
}

function hasNormalizedField(
  payload: Record<string, unknown>,
  field: string,
): boolean {
  if (payload[field] !== undefined) {
    return true;
  }

  const target = normalizeFieldName(field);
  return Object.keys(payload).some((key) => normalizeFieldName(key) === target);
}

function parseBooleanField(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return parseBooleanField(value[0]);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const unquoted =
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
        ? trimmed.slice(1, -1)
        : trimmed;
    const normalized = unquoted.toLowerCase();

    if (normalized === "true" || normalized === "false") {
      return normalized === "true";
    }

    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  return undefined;
}

// ============ Public Routes (No Auth Required) ============

const publicArticleRoutes = new Elysia({ prefix: "/articles" })
  // List published articles
  .get(
    "/",
    async ({ query }) => {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      return await articleService.listPublishedArticles(
        page,
        limit,
        query.authorId,
      );
    },
    {
      query: articleListQuery,
      response: {
        200: articleListResponse,
      },
      detail: {
        summary: "List published articles",
        description:
          "Returns a paginated list of published articles. Supports filtering by author.",
        tags: ["Articles"],
      },
    },
  )
  // Get published article by slug (SEO-friendly)
  .get(
    "/slug/:slug",
    async ({ params, set }) => {
      try {
        return await articleService.getPublishedArticleBySlug(params.slug);
      } catch (err) {
        if (err instanceof NotFoundError) {
          set.status = 404;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      params: t.Object({
        slug: t.String({ examples: ["my-awesome-article"] }),
      }),
      response: {
        200: articleResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Get article by slug",
        description:
          "Returns a published article by its slug. Used for SEO-friendly URLs.",
        tags: ["Articles"],
      },
    },
  )
  // Get Open Graph / SEO meta for an article
  .get(
    "/slug/:slug/meta",
    async ({ params, set, request }) => {
      try {
        // Extract base URL from request or use default
        const url = new URL(request.url);
        const baseUrl =
          process.env.FRONTEND_URL ?? `${url.protocol}//${url.host}`;
        return await articleService.getArticleMeta(params.slug, baseUrl);
      } catch (err) {
        if (err instanceof NotFoundError) {
          set.status = 404;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      params: t.Object({
        slug: t.String({ examples: ["my-awesome-article"] }),
      }),
      response: {
        200: articleMetaResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Get article meta for Open Graph",
        description:
          "Returns SEO meta data (title, description, image, URL) for Open Graph / Twitter Card tags.",
        tags: ["Articles"],
      },
    },
  );

// ============ Protected Routes (Auth Required) ============

const protectedArticleRoutes = new Elysia({ prefix: "/articles" })
  .use(authGuard)
  // List current user's articles (including drafts)
  .get(
    "/me",
    async ({ user, query }) => {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      return await articleService.listMyArticles(user.id, page, limit);
    },
    {
      query: t.Object({
        page: t.Optional(t.Numeric({ minimum: 1, examples: [1] })),
        limit: t.Optional(
          t.Numeric({ minimum: 1, maximum: 50, examples: [10] }),
        ),
      }),
      response: {
        200: articleListResponse,
        401: errorResponse,
      },
      detail: {
        summary: "List my articles",
        description:
          "Returns a paginated list of the current user's articles, including drafts.",
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  // Create a new article
  .post(
    "/",
    async ({ user, body, set }) => {
      try {
        const payload = body as Record<string, unknown>;
        const banner = getNormalizedField(payload, "banner") as
          | File
          | undefined;
        const publish = getNormalizedField(payload, "publish");
        const hasPublish = hasNormalizedField(payload, "publish");
        const parsedPublish = parseBooleanField(publish);
        const finalPublish = parsedPublish ?? (hasPublish ? true : false);

        const articleData = {
          title: payload.title as string,
          metaDescription: payload.metaDescription as string,
          body: payload.body as string,
          slug: payload.slug as string | undefined,
          publish: finalPublish,
        };
        return await articleService.createArticle(user.id, articleData, banner);
      } catch (err) {
        if (err instanceof ConflictError) {
          set.status = 409;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 3, maxLength: 100 }),
        metaDescription: t.String({ maxLength: 160 }),
        body: t.String(),
        slug: t.Optional(t.String({ pattern: "^[a-z0-9-]+$" })),
        publish: t.Optional(t.Any()),
        banner: t.Optional(
          t.File({
            type: [
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/webp",
              "image/avif",
            ],
            maxSize: "1m",
          }),
        ),
      }),
      response: {
        200: articleResponse,
        401: errorResponse,
        409: errorResponse,
        422: errorResponse,
      },
      detail: {
        summary: "Create article",
        description:
          "Creates a new article. Supports multipart/form-data for optional banner image upload.",
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  // Get article by ID (for viewing own drafts)
  .get(
    "/:id",
    async ({ params, user, set }) => {
      try {
        return await articleService.getArticleById(params.id, user.id);
      } catch (err) {
        if (err instanceof NotFoundError) {
          set.status = 404;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      params: t.Object({
        id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
      }),
      response: {
        200: articleResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Get article by ID",
        description:
          "Returns an article by ID. Authors can view their own unpublished drafts.",
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  // Update article
  .put(
    "/:id",
    async ({ params, user, body, set }) => {
      try {
        const payload = body as Record<string, unknown>;
        const banner = getNormalizedField(payload, "banner") as
          | File
          | undefined;
        const publish = getNormalizedField(payload, "publish");
        const removeBanner = getNormalizedField(payload, "removeBanner");
        const updateData = {
          title: payload.title as string | undefined,
          metaDescription: payload.metaDescription as string | undefined,
          body: payload.body as string | undefined,
          slug: payload.slug as string | undefined,
          // Only update publish if provided, convert string "true"/"false" to boolean
          publish: parseBooleanField(publish),
        };
        const removeBannerBool = parseBooleanField(removeBanner);

        return await articleService.updateArticle(
          params.id,
          user.id,
          updateData,
          banner,
          removeBannerBool,
        );
      } catch (err) {
        if (err instanceof NotFoundError) {
          set.status = 404;
          return { message: err.message };
        }
        if (err instanceof ForbiddenError) {
          set.status = 403;
          return { message: err.message };
        }
        if (err instanceof ConflictError) {
          set.status = 409;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      params: t.Object({
        id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
      }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 3, maxLength: 100 })),
        metaDescription: t.Optional(t.String({ maxLength: 160 })),
        body: t.Optional(t.String()),
        slug: t.Optional(t.String({ pattern: "^[a-z0-9-]+$" })),
        publish: t.Optional(t.Any()),
        banner: t.Optional(
          t.File({
            type: [
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/webp",
              "image/avif",
            ],
            maxSize: "1m",
          }),
        ),
        removeBanner: t.Optional(t.Any()),
      }),
      response: {
        200: articleResponse,
        401: errorResponse,
        403: errorResponse,
        404: errorResponse,
        409: errorResponse,
        422: errorResponse,
      },
      detail: {
        summary: "Update article",
        description:
          "Updates an article and optionally updates/removes the banner image using separate fields.",
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  // Delete article
  .delete(
    "/:id",
    async ({ params, user, set }) => {
      try {
        await articleService.deleteArticle(params.id, user.id);
        return { message: "Article deleted successfully" };
      } catch (err) {
        if (err instanceof NotFoundError) {
          set.status = 404;
          return { message: err.message };
        }
        if (err instanceof ForbiddenError) {
          set.status = 403;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      params: t.Object({
        id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
      }),
      response: {
        200: messageResponse,
        401: errorResponse,
        403: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Delete article",
        description:
          "Deletes an article. Only the author can delete their own articles.",
        tags: ["Articles"],
        security: [{ bearerAuth: [] }],
      },
    },
  );
// ============ Exports ============

// Export routes separately to prevent authGuard from bleeding into public routes
export const publicArticleRoutes_ = publicArticleRoutes;
export const protectedArticleRoutes_ = protectedArticleRoutes;
