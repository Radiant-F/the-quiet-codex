import { Helmet } from "react-helmet-async";
import DashboardLayout from "../../components/DashboardLayout";

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard — The Quiet Codex</title>
      </Helmet>
      <DashboardLayout />
    </>
  );
}
