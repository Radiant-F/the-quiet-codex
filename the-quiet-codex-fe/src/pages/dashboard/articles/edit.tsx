import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiLoader } from "react-icons/fi";
import DashboardHeader from "../../../components/DashboardHeader";
import { ArticleForm, useGetArticleByIdQuery } from "../../../features/article";
import { SAGE, FOREST, SERIF } from "../../../lib/theme";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, error } = useGetArticleByIdQuery(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <FiLoader size={32} className="animate-spin" style={{ color: SAGE }} />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-32 text-center">
        <h2
          className="mb-2 text-2xl font-semibold"
          style={{ fontFamily: SERIF, color: FOREST }}
        >
          Article not found
        </h2>
        <p className="text-sm" style={{ color: `${FOREST}50` }}>
          This article may have been deleted.
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit: {article.title} — The Quiet Codex</title>
      </Helmet>

      <DashboardHeader title="Edit Article" subtitle="Update" />

      <ArticleForm mode="edit" initialData={article} />
    </>
  );
}
