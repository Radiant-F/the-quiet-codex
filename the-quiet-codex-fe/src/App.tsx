import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layouts/PublicLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import RequireAuth from "./components/guards/RequireAuth";
import CommandPalette from "./components/ui/CommandPalette";
import KonamiEasterEgg from "./components/ui/KonamiEasterEgg";

/* ── Lazy-loaded Pages ───────────────────────────────────── */
const RootPage = lazy(() => import("./pages/root"));
const ArticlesPage = lazy(() => import("./pages/articles"));
const ArticleReaderPage = lazy(() => import("./pages/articles/slug"));
const AuthPage = lazy(() => import("./pages/auth"));
const DashboardOverview = lazy(() => import("./pages/dashboard"));
const DashboardArticles = lazy(() => import("./pages/dashboard/articles"));
const DashboardArticleNew = lazy(
  () => import("./pages/dashboard/articles/new"),
);
const DashboardArticleEdit = lazy(
  () => import("./pages/dashboard/articles/edit"),
);
const DashboardProfile = lazy(() => import("./pages/dashboard/profile"));

/* ── Loading Fallback ────────────────────────────────────── */
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{
            borderColor: "var(--color-aurora-purple)",
            borderTopColor: "transparent",
          }}
        />
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Skip to content link (a11y) */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* Global UI */}
      <CommandPalette />
      <KonamiEasterEgg />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Routes ───────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route index element={<RootPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="articles/:slug" element={<ArticleReaderPage />} />
          </Route>

          {/* ── Auth Routes ─────────────────────────── */}
          <Route path="auth" element={<AuthLayout />}>
            <Route index element={<AuthPage />} />
          </Route>

          {/* ── Dashboard Routes (Protected) ────────── */}
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="articles" element={<DashboardArticles />} />
            <Route path="articles/new" element={<DashboardArticleNew />} />
            <Route path="articles/:id" element={<DashboardArticleEdit />} />
            <Route path="profile" element={<DashboardProfile />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
