import { Link } from "react-router";
import { useI18n } from "@/i18n";
import type { ArticleListItem } from "../article.d";
import { MdAccessTime, MdPerson } from "react-icons/md";

interface ArticleCardProps {
  article: ArticleListItem;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { t } = useI18n();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Estimate reading time (rough: 200 words per minute)
  const estimateReadTime = () => {
    const wordCount = article.metaDescription.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 50)); // Very rough estimate from description
  };

  return (
    <Link
      to={`/article/${article.slug}`}
      className={`glass group block overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        featured ? "md:flex" : ""
      }`}
    >
      {/* Banner Image */}
      <div
        className={`relative overflow-hidden bg-[var(--page-elevated)] ${
          featured ? "md:w-1/2" : "aspect-video"
        }`}
      >
        {article.bannerImageUrl ? (
          <img
            src={article.bannerImageUrl}
            alt={article.title}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              featured ? "aspect-video md:aspect-auto md:h-full" : ""
            }`}
            loading="lazy"
          />
        ) : (
          <div
            className={`flex items-center justify-center bg-gradient-to-br from-[var(--page-accent)]/20 to-[var(--page-accent)]/5 ${
              featured ? "aspect-video md:h-full" : "aspect-video"
            }`}
          >
            <span className="text-4xl opacity-50">📝</span>
          </div>
        )}

        {/* Draft Badge */}
        {!article.publishedAt && (
          <span className="absolute top-3 left-3 rounded-full bg-yellow-500/90 px-3 py-1 text-xs font-medium text-black">
            {t("article", "draft")}
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`p-5 ${featured ? "md:w-1/2 md:p-6" : ""}`}>
        <h3
          className={`theme-text mb-2 font-bold transition-colors group-hover:text-[var(--page-accent)] ${
            featured ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>

        <p className="theme-muted mb-4 line-clamp-2 text-sm">
          {article.metaDescription}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Author */}
          <div className="flex items-center gap-1.5">
            {article.author.profilePictureUrl ? (
              <img
                src={article.author.profilePictureUrl}
                alt={article.author.username}
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <MdPerson className="h-4 w-4 text-[var(--page-muted)]" />
            )}
            <span className="theme-muted">{article.author.username}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-[var(--page-muted)]">
            <MdAccessTime className="h-3.5 w-3.5" />
            <span>
              {article.publishedAt
                ? formatDate(article.publishedAt)
                : formatDate(article.createdAt)}
            </span>
          </div>

          {/* Read Time */}
          <span className="theme-muted">
            {estimateReadTime()} {t("article", "minRead")}
          </span>
        </div>
      </div>
    </Link>
  );
}
