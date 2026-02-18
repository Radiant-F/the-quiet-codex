import { Link } from "react-router-dom";
import type { ArticleListItem } from "../article.domain";
import {
  DISPLAY,
  SANS,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_DIM,
  GLASS,
  GLASS_BORDER,
  GRADIENT_PRIMARY,
} from "../../../lib/theme";

interface PublicArticleCardProps {
  article: ArticleListItem;
}

export default function PublicArticleCard({ article }: PublicArticleCardProps) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border transition-all hover:border-[rgba(255,255,255,0.14)]"
      style={{ borderColor: GLASS_BORDER, background: GLASS }}
    >
      {/* Banner */}
      {article.bannerImageUrl ? (
        <div className="h-52 overflow-hidden">
          <img
            src={article.bannerImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className="flex h-52 items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(123,97,255,0.08), rgba(0,212,170,0.05))",
          }}
        >
          <span
            className="text-6xl font-semibold opacity-15"
            style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
          >
            {article.title.charAt(0)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3
          className="mb-2 line-clamp-2 text-xl font-semibold leading-tight transition-colors group-hover:opacity-80"
          style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
        >
          {article.title}
        </h3>

        {article.metaDescription && (
          <p
            className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed"
            style={{ color: TEXT_MUTED, fontFamily: SANS }}
          >
            {article.metaDescription}
          </p>
        )}

        {/* Author + date */}
        <div
          className="mt-auto flex items-center gap-3 pt-4"
          style={{ borderTop: `1px solid ${GLASS_BORDER}` }}
        >
          {article.author.profilePictureUrl ? (
            <img
              src={article.author.profilePictureUrl}
              alt={article.author.username}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white"
              style={{ background: GRADIENT_PRIMARY }}
            >
              {article.author.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>
              {article.author.username}
            </p>
            <p className="text-xs" style={{ color: TEXT_DIM }}>
              {date}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
