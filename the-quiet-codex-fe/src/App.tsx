import type { ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useAppSelector } from "./hooks";
import { FiLoader } from "react-icons/fi";
import { AURORA_2 } from "./lib/theme";

/* ---------- lazy pages ---------- */
const Root = lazy(() => import("./pages/root"));
const Auth = lazy(() => import("./pages/auth"));
const ArticlesPage = lazy(() => import("./pages/articles"));
const ArticleSlugPage = lazy(() => import("./pages/articles/slug"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const MyArticles = lazy(() => import("./pages/dashboard/articles"));
const NewArticle = lazy(() => import("./pages/dashboard/articles/new"));
const EditArticle = lazy(() => import("./pages/dashboard/articles/edit"));
const Profile = lazy(() => import("./pages/dashboard/profile"));

/* ---------- helpers ---------- */
function Spinner() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "#080B1A" }}
    >
      <FiLoader
        size={32}
        className="animate-spin"
        style={{ color: AURORA_2 }}
      />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  if (!accessToken) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: ReactNode }) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  if (accessToken) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/* ---------- app ---------- */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* public */}
          <Route path="/" element={<Root />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleSlugPage />} />

          {/* guest-only */}
          <Route
            path="/auth"
            element={
              <GuestRoute>
                <Auth />
              </GuestRoute>
            }
          />

          {/* legacy redirect */}
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />

          {/* protected dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="articles" replace />} />
            <Route path="articles" element={<MyArticles />} />
            <Route path="articles/new" element={<NewArticle />} />
            <Route path="articles/:id" element={<EditArticle />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
