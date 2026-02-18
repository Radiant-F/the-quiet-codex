import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import ArticleForm from "../../../features/article/components/ArticleForm";

export default function DashboardArticleNewPage() {
  return (
    <>
      <Helmet>
        <title>New Article — The Quiet Codex</title>
      </Helmet>

      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <ArticleForm mode="create" />
      </motion.div>
    </>
  );
}
