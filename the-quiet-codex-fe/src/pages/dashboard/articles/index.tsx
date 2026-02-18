import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { FiPlus } from "react-icons/fi";
import ArticleListView from "../../../features/article/components/ArticleListView";

export default function DashboardArticlesPage() {
  return (
    <>
      <Helmet>
        <title>My Articles — The Quiet Codex</title>
      </Helmet>

      <div className="space-y-6">
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My Articles
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Manage your published and draft articles.
            </p>
          </div>
          <Link to="/dashboard/articles/new" className="btn btn-primary">
            <FiPlus size={16} />
            New Article
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ArticleListView />
        </motion.div>
      </div>
    </>
  );
}
