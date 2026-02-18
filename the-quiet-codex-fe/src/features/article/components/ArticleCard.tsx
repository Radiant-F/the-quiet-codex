import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiClock, FiCheck } from "react-icons/fi";
import type { ArticleListItem } from "../article.domain";
import {
  DISPLAY,
  SANS,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_DIM,
  AURORA_1,
  AURORA_2,
  AURORA_3,
  GLASS,
  GLASS_BORDER,
  GLASS_HOVER,
  GRADIENT_PRIMARY,
  colors,
} from "../../../lib/theme";

interface ArticleCardProps {
  article: ArticleListItem;
  onDelete: (id: string) => void;
}

export default function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const isPublished = article.publishedAt !== null;
  const date = new Date(
    article.publishedAt ?? article.createdAt,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border transition-all hover:border-[rgba(255,255,255,0.14)]"
      style={{
        borderColor: GLASS_BORDER,
        background: GLASS,
      }}
    >
      {/* Banner */}
      {article.bannerImageUrl ? (
        <div className="h-40 overflow-hidden">
          <img
            src={article.bannerImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className="flex h-40 items-center justify-center"
          style={{
            background: `linear-gradient(135deg, rgba(123,97,255,0.08), rgba(0,212,170,0.05))`,
          }}
        >
          <span
            className="text-3xl font-semibold opacity-20"
            style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
          >
            {article.title.charAt(0)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              background: isPublished
                ? "rgba(0,212,170,0.1)"
                : "rgba(255,107,202,0.1)",
              color: isPublished ? AURORA_2 : AURORA_3,
            }}
          >
            {isPublished ? (
              <>
                <FiCheck size={10} /> Published
              </>
            ) : (
              <>
                <FiClock size={10} /> Draft
              </>
            )}
          </span>
          <span className="text-xs" style={{ color: TEXT_DIM }}>
            {date}
          </span>
        </div>

        <h3
          className="mb-1 line-clamp-2 text-lg font-semibold"
          style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
        >
          {article.title}
        </h3>

        {article.metaDescription && (
          <p
            className="line-clamp-2 text-sm leading-relaxed"
            style={{ color: TEXT_MUTED, fontFamily: SANS }}
          >
            {article.metaDescription}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/dashboard/articles/${article.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all"
            style={{
              background: GLASS_HOVER,
              color: TEXT_PRIMARY,
              border: `1px solid ${GLASS_BORDER}`,
            }}
          >
            <FiEdit2 size={12} />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(article.id)}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all"
            style={{
              background: colors.dangerBg,
              color: colors.danger,
            }}
          >
            <FiTrash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
