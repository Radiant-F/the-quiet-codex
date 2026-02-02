import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    metaDescription: text("meta_description").notNull(),
    bannerImageUrl: text("banner_image_url"),
    bannerImagePublicId: text("banner_image_public_id"),
    body: text("body").notNull(), // Sanitized HTML content
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Index for faster slug lookups (SEO routes)
    index("articles_slug_idx").on(table.slug),
    // Index for author's articles
    index("articles_author_id_idx").on(table.authorId),
    // Index for published articles sorted by date
    index("articles_published_at_idx").on(table.publishedAt),
  ],
);

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
