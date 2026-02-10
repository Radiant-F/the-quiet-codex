import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiClock, FiCheck } from "react-icons/fi";
import type { ArticleListItem } from "../article.domain";
import {
  SERIF,
  SANS,
  FOREST,
  SAGE,
  TERRACOTTA,
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
      className="group relative overflow-hidden rounded-2xl border transition-all hover:shadow-lg"
      style={{
        borderColor: `${FOREST}10`,
        background: "white",
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
            background: `linear-gradient(135deg, ${SAGE}15, ${TERRACOTTA}10)`,
          }}
        >
          <span
            className="text-3xl font-semibold opacity-20"
            style={{ fontFamily: SERIF, color: FOREST }}
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
              background: isPublished ? `${SAGE}15` : `${TERRACOTTA}15`,
              color: isPublished ? SAGE : TERRACOTTA,
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
          <span className="text-xs" style={{ color: `${FOREST}40` }}>
            {date}
          </span>
        </div>

        <h3
          className="mb-1 line-clamp-2 text-lg font-semibold"
          style={{ fontFamily: SERIF, color: FOREST }}
        >
          {article.title}
        </h3>

        {article.metaDescription && (
          <p
            className="line-clamp-2 text-sm leading-relaxed"
            style={{ color: `${FOREST}60`, fontFamily: SANS }}
          >
            {article.metaDescription}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/dashboard/articles/${article.id}`}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all"
            style={{
              background: `${FOREST}08`,
              color: FOREST,
            }}
          >
            <FiEdit2 size={12} />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(article.id)}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all"
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
