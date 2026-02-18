import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiClock, FiCheck } from "react-icons/fi";
import type { ArticleListItem } from "../article.domain";

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
    <div className="glass-panel group relative overflow-hidden rounded-2xl border transition-all hover:border-[rgba(255,255,255,0.14)]">
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
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)",
            }}
          >
            {article.title.charAt(0)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={
              isPublished ? "badge badge-success" : "badge badge-warning"
            }
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
          <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            {date}
          </span>
        </div>

        <h3
          className="mb-1 line-clamp-2 text-lg font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
          }}
        >
          {article.title}
        </h3>

        {article.metaDescription && (
          <p
            className="line-clamp-2 text-sm leading-relaxed"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {article.metaDescription}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/dashboard/articles/${article.id}`}
            className="btn btn-secondary inline-flex items-center gap-1.5 text-xs"
          >
            <FiEdit2 size={12} />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(article.id)}
            className="btn btn-danger inline-flex items-center gap-1.5 text-xs"
          >
            <FiTrash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
