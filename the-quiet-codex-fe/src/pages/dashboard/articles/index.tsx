import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiPlusCircle } from "react-icons/fi";
import DashboardHeader from "../../../components/DashboardHeader";
import { ArticleListView } from "../../../features/article";
import { GRADIENT_PRIMARY } from "../../../lib/theme";

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
            className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
            style={{ background: GRADIENT_PRIMARY }}
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
