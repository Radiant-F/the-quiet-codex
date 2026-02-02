import { t } from "elysia";

// ============ Error & Message Responses ============

export const errorResponse = t.Object({
  message: t.String({ examples: ["Error description"] }),
});

export const messageResponse = t.Object({
  message: t.String({ examples: ["Operation successful"] }),
});

// ============ Author Info (embedded in article responses) ============

export const authorResponse = t.Object({
  id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  username: t.String({ examples: ["johndoe"] }),
  profilePictureUrl: t.Optional(
    t.Nullable(
      t.String({ examples: ["https://res.cloudinary.com/.../profile.jpg"] }),
    ),
  ),
});

// ============ Article Responses ============

export const articleResponse = t.Object({
  id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  slug: t.String({ examples: ["my-awesome-article"] }),
  title: t.String({ examples: ["My Awesome Article"] }),
  metaDescription: t.String({
    examples: ["A brief description of the article for SEO purposes."],
  }),
  bannerImageUrl: t.Optional(
    t.Nullable(
      t.String({ examples: ["https://res.cloudinary.com/.../banner.jpg"] }),
    ),
  ),
  body: t.String({
    examples: [
      "<p>This is the article content with <strong>HTML</strong>.</p>",
    ],
  }),
  publishedAt: t.Optional(
    t.Nullable(t.String({ examples: ["2024-01-01T00:00:00.000Z"] })),
  ),
  author: authorResponse,
  createdAt: t.String({ examples: ["2024-01-01T00:00:00.000Z"] }),
  updatedAt: t.String({ examples: ["2024-01-01T00:00:00.000Z"] }),
});

export const articleListItemResponse = t.Object({
  id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  slug: t.String({ examples: ["my-awesome-article"] }),
  title: t.String({ examples: ["My Awesome Article"] }),
  metaDescription: t.String({
    examples: ["A brief description of the article for SEO purposes."],
  }),
  bannerImageUrl: t.Optional(
    t.Nullable(
      t.String({ examples: ["https://res.cloudinary.com/.../banner.jpg"] }),
    ),
  ),
  publishedAt: t.Optional(
    t.Nullable(t.String({ examples: ["2024-01-01T00:00:00.000Z"] })),
  ),
  author: authorResponse,
  createdAt: t.String({ examples: ["2024-01-01T00:00:00.000Z"] }),
});

export const articleListResponse = t.Object({
  articles: t.Array(articleListItemResponse),
  total: t.Number({ examples: [42] }),
  page: t.Number({ examples: [1] }),
  limit: t.Number({ examples: [10] }),
  totalPages: t.Number({ examples: [5] }),
});

// ============ Open Graph / SEO Meta Response ============

export const articleMetaResponse = t.Object({
  title: t.String({ examples: ["My Awesome Article"] }),
  description: t.String({
    examples: ["A brief description of the article for SEO purposes."],
  }),
  image: t.Optional(
    t.Nullable(
      t.String({ examples: ["https://res.cloudinary.com/.../banner.jpg"] }),
    ),
  ),
  url: t.String({
    examples: ["https://the-quiet-codex.com/article/my-awesome-article"],
  }),
  author: t.String({ examples: ["johndoe"] }),
  publishedAt: t.Optional(
    t.Nullable(t.String({ examples: ["2024-01-01T00:00:00.000Z"] })),
  ),
  type: t.Literal("article"),
});

// ============ Request Bodies ============

export const createArticleBody = t.Object({
  title: t.String({
    minLength: 1,
    maxLength: 200,
    examples: ["My Awesome Article"],
  }),
  metaDescription: t.String({
    minLength: 1,
    maxLength: 320,
    examples: ["A brief description of the article for SEO purposes."],
  }),
  body: t.String({
    minLength: 1,
    examples: [
      "<p>This is the article content with <strong>HTML</strong>.</p>",
    ],
  }),
  slug: t.Optional(
    t.String({
      minLength: 1,
      maxLength: 200,
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      examples: ["my-custom-slug"],
    }),
  ),
  publish: t.Optional(t.Boolean({ examples: [true] })),
});

export const updateArticleBody = t.Object({
  title: t.Optional(
    t.String({
      minLength: 1,
      maxLength: 200,
      examples: ["Updated Article Title"],
    }),
  ),
  metaDescription: t.Optional(
    t.String({
      minLength: 1,
      maxLength: 320,
      examples: ["Updated description for SEO."],
    }),
  ),
  body: t.Optional(
    t.String({
      minLength: 1,
      examples: ["<p>Updated article content.</p>"],
    }),
  ),
  slug: t.Optional(
    t.String({
      minLength: 1,
      maxLength: 200,
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      examples: ["updated-custom-slug"],
    }),
  ),
  publish: t.Optional(
    t.Boolean({
      examples: [true],
      description:
        "true to publish, false to unpublish, omit to leave unchanged",
    }),
  ),
});

// ============ Query Parameters ============

export const articleListQuery = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, examples: [1] })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50, examples: [10] })),
  authorId: t.Optional(
    t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  ),
});

// ============ Upload Response ============

export const uploadBannerResponse = t.Object({
  message: t.String({ examples: ["Banner image uploaded successfully"] }),
  bannerImageUrl: t.String({
    examples: ["https://res.cloudinary.com/.../banner.jpg"],
  }),
});
