import { eq, desc, sql, and, isNotNull } from "drizzle-orm";
import { db } from "../../db";
import {
  articles,
  users,
  type Article,
  type NewArticle,
} from "../../db/schema";

export interface ArticleWithAuthor extends Article {
  author: {
    id: string;
    username: string;
    profilePictureUrl: string | null;
  };
}

export interface PaginatedArticles {
  articles: ArticleWithAuthor[];
  total: number;
}

export interface ArticleFilters {
  authorId?: string;
  publishedOnly?: boolean;
}

export const articleRepository = {
  async findById(id: string): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    return article;
  },

  async findByIdWithAuthor(id: string): Promise<ArticleWithAuthor | undefined> {
    const [result] = await db
      .select({
        id: articles.id,
        authorId: articles.authorId,
        slug: articles.slug,
        title: articles.title,
        metaDescription: articles.metaDescription,
        bannerImageUrl: articles.bannerImageUrl,
        bannerImagePublicId: articles.bannerImagePublicId,
        body: articles.body,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          id: users.id,
          username: users.username,
          profilePictureUrl: users.profilePictureUrl,
        },
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.id, id))
      .limit(1);

    return result;
  },

  async findBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);
    return article;
  },

  async findBySlugWithAuthor(
    slug: string,
  ): Promise<ArticleWithAuthor | undefined> {
    const [result] = await db
      .select({
        id: articles.id,
        authorId: articles.authorId,
        slug: articles.slug,
        title: articles.title,
        metaDescription: articles.metaDescription,
        bannerImageUrl: articles.bannerImageUrl,
        bannerImagePublicId: articles.bannerImagePublicId,
        body: articles.body,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          id: users.id,
          username: users.username,
          profilePictureUrl: users.profilePictureUrl,
        },
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.slug, slug))
      .limit(1);

    return result;
  },

  async findPublishedBySlugWithAuthor(
    slug: string,
  ): Promise<ArticleWithAuthor | undefined> {
    const [result] = await db
      .select({
        id: articles.id,
        authorId: articles.authorId,
        slug: articles.slug,
        title: articles.title,
        metaDescription: articles.metaDescription,
        bannerImageUrl: articles.bannerImageUrl,
        bannerImagePublicId: articles.bannerImagePublicId,
        body: articles.body,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          id: users.id,
          username: users.username,
          profilePictureUrl: users.profilePictureUrl,
        },
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .where(and(eq(articles.slug, slug), isNotNull(articles.publishedAt)))
      .limit(1);

    return result;
  },

  async findMany(
    page: number,
    limit: number,
    filters?: ArticleFilters,
  ): Promise<PaginatedArticles> {
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    if (filters?.authorId) {
      conditions.push(eq(articles.authorId, filters.authorId));
    }
    if (filters?.publishedOnly) {
      conditions.push(isNotNull(articles.publishedAt));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get articles with author
    const results = await db
      .select({
        id: articles.id,
        authorId: articles.authorId,
        slug: articles.slug,
        title: articles.title,
        metaDescription: articles.metaDescription,
        bannerImageUrl: articles.bannerImageUrl,
        bannerImagePublicId: articles.bannerImagePublicId,
        body: articles.body,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          id: users.id,
          username: users.username,
          profilePictureUrl: users.profilePictureUrl,
        },
      })
      .from(articles)
      .innerJoin(users, eq(articles.authorId, users.id))
      .where(whereClause)
      .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(articles)
      .where(whereClause);

    return {
      articles: results,
      total: countResult.count,
    };
  },

  async findByAuthor(
    authorId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedArticles> {
    return this.findMany(page, limit, { authorId });
  },

  async create(data: NewArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(data).returning();
    return article;
  },

  async update(id: string, data: Partial<NewArticle>): Promise<Article> {
    const [article] = await db
      .update(articles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return article;
  },

  async delete(id: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  },

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const conditions = [eq(articles.slug, slug)];
    if (excludeId) {
      conditions.push(sql`${articles.id} != ${excludeId}`);
    }

    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(articles)
      .where(and(...conditions));

    return result.count > 0;
  },
};
