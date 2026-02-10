import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiPlusCircle } from "react-icons/fi";
import DashboardHeader from "../../../components/DashboardHeader";
import { ArticleListView } from "../../../features/article";
import { FOREST } from "../../../lib/theme";

export default function MyArticlesPage() {
  return (
    <>
      <Helmet>
        <title>My Articles — The Quiet Codex</title>
      </Helmet>

      <DashboardHeader
        title="My Articles"
        subtitle="Your writings"
        action={
          <Link
            to="/dashboard/articles/new"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl"
            style={{ background: FOREST }}
          >
            <FiPlusCircle size={14} />
            New Article
          </Link>
        }
      />

      <ArticleListView />
    </>
  );
}
