import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBookOpen, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { MyArticleListParams } from "../article.domain";
import {
  useListMyArticlesQuery,
  useDeleteArticleMutation,
} from "../services/article.api";
import ArticleCard from "./ArticleCard";
import DeleteArticleDialog from "./DeleteArticleDialog";
import {
  DISPLAY,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_DIM,
  GLASS,
  GLASS_BORDER,
  GRADIENT_PRIMARY,
} from "../../../lib/theme";

const LIMIT = 8;

export default function ArticleListView() {
  const [page, setPage] = useState(1);
  const params: MyArticleListParams = { page, limit: LIMIT };
  const { data, isLoading, isFetching } = useListMyArticlesQuery(params);
  const [deleteArticle, deleteState] = useDeleteArticleMutation();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteArticle(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch {
      // error logged by RTK Query onQueryStarted
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl"
            style={{ background: GLASS, border: `1px solid ${GLASS_BORDER}` }}
          />
        ))}
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center"
        style={{ borderColor: GLASS_BORDER }}
      >
        <FiBookOpen size={40} className="mb-4" style={{ color: TEXT_DIM }} />
        <h3
          className="mb-2 text-2xl font-semibold"
          style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
        >
          No articles yet
        </h3>
        <p className="mb-6 text-sm" style={{ color: TEXT_MUTED }}>
          Start writing your first article — your ideas are waiting to shine.
        </p>
        <Link
          to="/dashboard/articles/new"
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-110"
          style={{ background: GRADIENT_PRIMARY }}
        >
          <FiBookOpen size={14} />
          Write your first article
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`grid grid-cols-1 gap-6 md:grid-cols-2 transition-opacity ${isFetching ? "opacity-60" : ""}`}
      >
        {data.articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onDelete={(id) => setDeleteTarget({ id, title: article.title })}
          />
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all disabled:opacity-30"
            style={{
              borderColor: GLASS_BORDER,
              color: TEXT_PRIMARY,
            }}
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
            style={{
              borderColor: GLASS_BORDER,
              color: TEXT_PRIMARY,
            }}
          >
            Next <FiChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Delete dialog */}
      {deleteTarget && (
        <DeleteArticleDialog
          articleTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleteState.isLoading}
        />
      )}
    </div>
  );
}
