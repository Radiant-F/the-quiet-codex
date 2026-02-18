import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiBookOpen } from "react-icons/fi";
import type { ArticleListParams } from "../article.domain";
import { useListArticlesQuery } from "../services/article.api";
import PublicArticleCard from "./PublicArticleCard";
import {
  DISPLAY,
  TEXT_PRIMARY,
  TEXT_MUTED,
  GLASS,
  GLASS_BORDER,
} from "../../../lib/theme";

const LIMIT = 9;

export default function PublicArticleList() {
  const [page, setPage] = useState(1);
  const params: ArticleListParams = { page, limit: LIMIT };
  const { data, isLoading, isFetching } = useListArticlesQuery(params);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-2xl"
            style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}
          />
        ))}
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FiBookOpen size={48} className="mb-4" style={{ color: TEXT_MUTED }} />
        <h3
          className="mb-2 text-2xl font-semibold"
          style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
        >
          No articles published yet
        </h3>
        <p className="text-sm" style={{ color: TEXT_MUTED }}>
          Check back soon — new stories are always in the making.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div
        className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity ${isFetching ? "opacity-60" : ""}`}
      >
        {data.articles.map((article) => (
          <PublicArticleCard key={article.id} article={article} />
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all disabled:opacity-30"
            style={{ borderColor: GLASS_BORDER, color: TEXT_PRIMARY }}
          >
            <FiChevronLeft size={14} /> Previous
          </button>
          <span className="text-sm" style={{ color: TEXT_MUTED }}>
            {page} / {data.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages}
            className="inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all disabled:opacity-30"
            style={{ borderColor: GLASS_BORDER, color: TEXT_PRIMARY }}
          >
            Next <FiChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
