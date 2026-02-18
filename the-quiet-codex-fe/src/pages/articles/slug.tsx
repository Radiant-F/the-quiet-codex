import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { useGetArticleBySlugQuery } from "../../features/article/services/article.api";
import ArticleContent from "../../features/article/components/ArticleContent";

export default function ArticleReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useGetArticleBySlugQuery(slug!);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <div className="space-y-6">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-64 w-full rounded-2xl" />
          <div className="space-y-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center lg:px-8">
        <h2
          className="mb-3 text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Article not found
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          The article you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} — The Quiet Codex</title>
        {article.metaDescription && (
          <meta name="description" content={article.metaDescription} />
        )}
        <meta property="og:title" content={article.title} />
        {article.metaDescription && (
          <meta property="og:description" content={article.metaDescription} />
        )}
        {article.bannerImageUrl && (
          <meta property="og:image" content={article.bannerImageUrl} />
        )}
        <meta property="og:type" content="article" />
        <meta property="article:author" content={article.author.username} />
        {article.publishedAt && (
          <meta
            property="article:published_time"
            content={article.publishedAt}
          />
        )}
      </Helmet>

      <div className="px-4 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArticleContent article={article} />
        </motion.div>
      </div>
    </>
  );
}
