import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import PublicArticleList from "../../features/article/components/PublicArticleList";

export default function ArticlesPage() {
  return (
    <>
      <Helmet>
        <title>Articles — The Quiet Codex</title>
        <meta
          name="description"
          content="Browse thoughtful articles from writers on The Quiet Codex."
        />
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="mb-2 text-4xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Articles
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Discover stories, ideas, and insights from our community of writers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <PublicArticleList />
        </motion.div>
      </div>
    </>
  );
}
