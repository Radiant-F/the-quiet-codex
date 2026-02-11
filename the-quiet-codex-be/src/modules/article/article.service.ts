import DOMPurify from "isomorphic-dompurify";
import {
  articleRepository,
  type ArticleWithAuthor,
} from "./article.repository";
import { NotFoundError, ConflictError, ForbiddenError } from "../../lib/errors";
import { uploadRawImage, deleteImage } from "../../lib/cloudinary";

// ============ Types ============

interface CreateArticleInput {
  title: string;
  metaDescription: string;
  body: string;
  slug?: string;
  publish?: boolean;
}

interface UpdateArticleInput {
  title?: string;
  metaDescription?: string;
  body?: string;
  slug?: string;
  publish?: boolean;
}

interface ArticleResponse {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  bannerImageUrl: string | null;
  body: string;
  publishedAt: string | null;
  author: {
    id: string;
    username: string;
    profilePictureUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  bannerImageUrl: string | null;
  publishedAt: string | null;
  author: {
    id: string;
    username: string;
    profilePictureUrl: string | null;
  };
  createdAt: string;
}

interface PaginatedArticleList {
  articles: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ArticleMeta {
  title: string;
  description: string;
  image: string | null;
  url: string;
  author: string;
  publishedAt: string | null;
  type: "article";
}

// ============ Helpers ============

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug, appending a number if needed
 */
async function generateUniqueSlug(
  title: string,
  excludeId?: string,
): Promise<string> {
  let baseSlug = generateSlug(title);

  // Fallback if slug is empty after sanitization
  if (!baseSlug) {
    baseSlug = `article-${String(Date.now())}`;
  }

  let slug = baseSlug;
  let counter = 1;

  while (await articleRepository.slugExists(slug, excludeId)) {
    slug = `${baseSlug}-${String(counter)}`;
    counter++;
  }

  return slug;
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows common formatting tags, links, and embeds
 */
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // Text formatting
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "del",
      "ins",
      "mark",
      "small",
      "sub",
      "sup",
      // Headings
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      // Lists
      "ul",
      "ol",
      "li",
      // Links
      "a",
      // Media
      "img",
      "figure",
      "figcaption",
      "video",
      "audio",
      "source",
      // Embeds (for social media, YouTube, etc.)
      "iframe",
      // Quotes
      "blockquote",
      "q",
      "cite",
      // Code
      "pre",
      "code",
      // Tables
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      // Structure
      "div",
      "span",
      "hr",
    ],
    ALLOWED_ATTR: [
      // Global
      "class",
      "id",
      "style",
      // Links
      "href",
      "target",
      "rel",
      // Media
      "src",
      "alt",
      "title",
      "width",
      "height",
      "loading",
      // Embeds
      "frameborder",
      "allowfullscreen",
      "allow",
      // Tables
      "colspan",
      "rowspan",
      // Data attributes (for embeds)
      "data-*",
    ],
    // Allow YouTube, Vimeo, Twitter, etc. embeds
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });
}

/**
 * Transform database article to API response format
 */
function toArticleResponse(article: ArticleWithAuthor): ArticleResponse {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    metaDescription: article.metaDescription,
    bannerImageUrl: article.bannerImageUrl,
    body: article.body,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    author: article.author,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

/**
 * Transform database article to list item format (no body)
 */
function toArticleListItem(article: ArticleWithAuthor): ArticleListItem {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    metaDescription: article.metaDescription,
    bannerImageUrl: article.bannerImageUrl,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    author: article.author,
    createdAt: article.createdAt.toISOString(),
  };
}

// ============ Service ============

export const articleService = {
  /**
   * Create a new article with optional banner image
   */
  async createArticle(
    authorId: string,
    input: CreateArticleInput,
    bannerFile?: File,
  ): Promise<ArticleResponse> {
    // Generate or validate slug
    let slug: string;
    if (input.slug) {
      // Custom slug provided - check if available
      if (await articleRepository.slugExists(input.slug)) {
        throw new ConflictError("Slug already exists");
      }
      slug = input.slug;
    } else {
      // Auto-generate from title
      slug = await generateUniqueSlug(input.title);
    }

    // Sanitize HTML body
    const sanitizedBody = sanitizeHtml(input.body);

    let bannerData = {};

    // Handle initial banner upload if provided
    if (bannerFile) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/avif",
      ];
      if (!allowedTypes.includes(bannerFile.type)) {
        throw new ConflictError("Invalid file type for banner");
      }

      const maxSize = 1 * 1024 * 1024;
      if (bannerFile.size > maxSize) {
        throw new ConflictError("Banner file size too large");
      }

      const arrayBuffer = await bannerFile.arrayBuffer();
      const uploadResult = await uploadRawImage(
        arrayBuffer,
        "the-quiet-codex/articles",
        `article_${slug}_${String(Date.now())}`,
      );

      bannerData = {
        bannerImageUrl: uploadResult.secureUrl,
        bannerImagePublicId: uploadResult.publicId,
      };
    }

    // Create article
    const article = await articleRepository.create({
      authorId,
      slug,
      title: input.title,
      metaDescription: input.metaDescription,
      body: sanitizedBody,
      publishedAt: input.publish ? new Date() : null,
      ...bannerData,
    });

    // Fetch with author info
    const articleWithAuthor = await articleRepository.findByIdWithAuthor(
      article.id,
    );
    if (!articleWithAuthor) {
      throw new NotFoundError("Article not found after creation");
    }

    return toArticleResponse(articleWithAuthor);
  },

  /**
   * Update an existing article (author only)
   */
  async updateArticle(
    articleId: string,
    userId: string,
    input: UpdateArticleInput,
    bannerFile?: File,
    removeBanner?: boolean,
  ): Promise<ArticleResponse> {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    // Check ownership
    if (article.authorId !== userId) {
      throw new ForbiddenError("You can only edit your own articles");
    }

    const updateData: Record<string, unknown> = {};

    // Handle title update
    if (input.title !== undefined) updateData.title = input.title;
    if (input.metaDescription !== undefined)
      updateData.metaDescription = input.metaDescription;
    if (input.body !== undefined) updateData.body = sanitizeHtml(input.body);

    // Handle slug update
    if (input.slug !== undefined && input.slug !== article.slug) {
      if (await articleRepository.slugExists(input.slug, articleId)) {
        throw new ConflictError("Slug already exists");
      }
      updateData.slug = input.slug;
    }

    // Handle publish state change
    if (input.publish === true && !article.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (input.publish === false && article.publishedAt) {
      updateData.publishedAt = null;
    }

    // Handle Banner Image Updates
    if (removeBanner && article.bannerImagePublicId) {
      await deleteImage(article.bannerImagePublicId);
      updateData.bannerImageUrl = null;
      updateData.bannerImagePublicId = null;
    }

    if (bannerFile) {
      // Validate file
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/avif",
      ];
      if (!allowedTypes.includes(bannerFile.type))
        throw new ConflictError("Invalid file type");
      if (bannerFile.size > 1 * 1024 * 1024)
        throw new ConflictError("File size too large");

      // Delete old image if it exists and wasn't just removed
      if (article.bannerImagePublicId && !removeBanner) {
        await deleteImage(article.bannerImagePublicId);
      }

      // Upload new
      const arrayBuffer = await bannerFile.arrayBuffer();
      const uploadResult = await uploadRawImage(
        arrayBuffer,
        "the-quiet-codex/articles",
        `article_${articleId}_${String(Date.now())}`,
      );

      updateData.bannerImageUrl = uploadResult.secureUrl;
      updateData.bannerImagePublicId = uploadResult.publicId;
    }

    // Update if there are changes
    if (Object.keys(updateData).length > 0) {
      await articleRepository.update(articleId, updateData);
    }

    // Fetch updated article with author
    const updatedArticle =
      await articleRepository.findByIdWithAuthor(articleId);
    if (!updatedArticle) {
      throw new NotFoundError("Article not found after update");
    }

    return toArticleResponse(updatedArticle);
  },

  /**
   * Delete an article (author only)
   */
  async deleteArticle(articleId: string, userId: string): Promise<void> {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    // Check ownership
    if (article.authorId !== userId) {
      throw new ForbiddenError("You can only delete your own articles");
    }

    // Delete banner image from Cloudinary if exists
    if (article.bannerImagePublicId) {
      await deleteImage(article.bannerImagePublicId);
    }

    await articleRepository.delete(articleId);
  },

  /**
   * Get a single article by ID (for authors to view their own drafts)
   */
  async getArticleById(
    articleId: string,
    userId?: string,
  ): Promise<ArticleResponse> {
    const article = await articleRepository.findByIdWithAuthor(articleId);
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    // If not published, only author can view
    if (!article.publishedAt && article.authorId !== userId) {
      throw new NotFoundError("Article not found");
    }

    return toArticleResponse(article);
  },

  /**
   * Get a published article by slug (public - for SEO)
   */
  async getPublishedArticleBySlug(slug: string): Promise<ArticleResponse> {
    const article = await articleRepository.findPublishedBySlugWithAuthor(slug);
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    return toArticleResponse(article);
  },

  /**
   * Get Open Graph / SEO meta data for an article
   */
  async getArticleMeta(slug: string, baseUrl: string): Promise<ArticleMeta> {
    const article = await articleRepository.findPublishedBySlugWithAuthor(slug);
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    return {
      title: article.title,
      description: article.metaDescription,
      image: article.bannerImageUrl,
      url: `${baseUrl}/article/${article.slug}`,
      author: article.author.username,
      publishedAt: article.publishedAt?.toISOString() ?? null,
      type: "article",
    };
  },

  /**
   * List published articles (public)
   */
  async listPublishedArticles(
    page: number,
    limit: number,
    authorId?: string,
  ): Promise<PaginatedArticleList> {
    const { articles, total } = await articleRepository.findMany(page, limit, {
      authorId,
      publishedOnly: true,
    });

    return {
      articles: articles.map(toArticleListItem),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * List current user's articles (including drafts)
   */
  async listMyArticles(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedArticleList> {
    const { articles, total } = await articleRepository.findByAuthor(
      userId,
      page,
      limit,
    );

    return {
      articles: articles.map(toArticleListItem),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};
