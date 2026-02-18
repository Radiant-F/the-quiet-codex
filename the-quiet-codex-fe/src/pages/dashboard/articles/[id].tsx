import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { useGetArticleByIdQuery } from "../../../features/article/services/article.api";
import ArticleForm from "../../../features/article/components/ArticleForm";

export default function DashboardArticleEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, isError } = useGetArticleByIdQuery(id!);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="skeleton h-6 w-32" />
        <div className="skeleton h-48 w-full rounded-2xl" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2
          className="mb-3 text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Article not found
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          The article you're trying to edit doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit: {article.title} — The Quiet Codex</title>
      </Helmet>

      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <ArticleForm mode="edit" initialData={article} />
      </motion.div>
    </>
  );
}
