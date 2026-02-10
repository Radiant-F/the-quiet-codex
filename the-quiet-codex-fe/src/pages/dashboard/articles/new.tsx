import { Helmet } from "react-helmet-async";
import DashboardHeader from "../../../components/DashboardHeader";
import { ArticleForm } from "../../../features/article";

export default function NewArticlePage() {
  return (
    <>
      <Helmet>
        <title>New Article — The Quiet Codex</title>
      </Helmet>

      <DashboardHeader title="New Article" subtitle="Create" />

      <ArticleForm mode="create" />
    </>
  );
}
