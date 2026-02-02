import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { Link, useNavigate } from "react-router";
import {
  MdLightMode,
  MdDarkMode,
  MdLanguage,
  MdLogout,
  MdAdd,
  MdEdit,
  MdArticle,
  MdArrowForward,
} from "react-icons/md";
import {
  useLogoutMutation,
  logout as logoutAction,
  RequireAuth,
} from "@/features/auth";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useListMyArticlesQuery } from "@/features/article";

function HomePageContent() {
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Fetch user's articles summary
  const { data: myArticles, isLoading: isLoadingArticles } =
    useListMyArticlesQuery({ page: 1, limit: 5 });

  const toggleTheme = () => {
    if (mode === "system") {
      setMode("light");
    } else if (mode === "light") {
      setMode("dark");
    } else {
      setMode("system");
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "id" : "en");
  };

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Even if the API call fails, we should still log out locally
    } finally {
      dispatch(logoutAction());
      navigate("/");
    }
  };

  const publishedCount =
    myArticles?.articles.filter((a) => a.publishedAt).length ?? 0;
  const draftCount =
    myArticles?.articles.filter((a) => !a.publishedAt).length ?? 0;

  return (
    <main className="min-h-screen theme-page">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="theme-accent">The Quiet</span>{" "}
            <span className="theme-text">Codex</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/articles"
              className="hidden sm:block px-4 py-2 rounded-lg theme-muted hover:theme-text transition-colors"
            >
              {t("article", "articles")}
            </Link>
            {/* User info */}
            {user && (
              <span className="text-sm theme-muted hidden sm:block">
                {t("home", "welcome")},{" "}
                <span className="font-medium text-[var(--page-text)]">
                  {user.username}
                </span>
              </span>
            )}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass hover:opacity-80 transition-all"
              title={t("common", "switchTheme")}
            >
              {resolvedTheme === "dark" ? (
                <MdLightMode size={20} />
              ) : (
                <MdDarkMode size={20} />
              )}
            </button>
            <button
              onClick={toggleLocale}
              className="p-2.5 rounded-xl glass hover:opacity-80 transition-all flex items-center gap-1.5"
              title={t("common", "switchLanguage")}
            >
              <MdLanguage size={20} />
              <span className="text-sm font-medium uppercase">{locale}</span>
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2.5 rounded-xl glass hover:bg-red-500/20 hover:text-red-400 transition-all disabled:opacity-50"
              title={t("common", "logout")}
            >
              {isLoggingOut ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdLogout size={20} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("home", "dashboard")}</h1>
            <p className="theme-muted mt-1">{t("home", "manageArticles")}</p>
          </div>
          <Link
            to="/write"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button text-white font-medium"
          >
            <MdAdd size={22} />
            <span className="hidden sm:inline">{t("home", "writeNew")}</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--page-accent)]/20 flex items-center justify-center">
                <MdArticle size={24} className="theme-accent" />
              </div>
              <div>
                <p className="theme-muted text-sm">
                  {t("home", "totalArticles")}
                </p>
                <p className="text-2xl font-bold">
                  {isLoadingArticles ? "..." : (myArticles?.total ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <MdArticle size={24} className="text-green-400" />
              </div>
              <div>
                <p className="theme-muted text-sm">{t("home", "published")}</p>
                <p className="text-2xl font-bold">
                  {isLoadingArticles ? "..." : publishedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <MdEdit size={24} className="text-yellow-400" />
              </div>
              <div>
                <p className="theme-muted text-sm">{t("home", "drafts")}</p>
                <p className="text-2xl font-bold">
                  {isLoadingArticles ? "..." : draftCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-[var(--page-border)]">
            <h2 className="text-lg font-semibold">
              {t("home", "recentArticles")}
            </h2>
            <Link
              to="/my-articles"
              className="theme-accent flex items-center gap-1 text-sm font-medium hover:underline"
            >
              {t("home", "viewAll")}
              <MdArrowForward size={16} />
            </Link>
          </div>

          {isLoadingArticles ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--page-accent)] border-t-transparent" />
            </div>
          ) : myArticles?.articles && myArticles.articles.length > 0 ? (
            <div className="divide-y divide-[var(--page-border)]">
              {myArticles.articles.slice(0, 5).map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 hover:bg-[var(--page-elevated)] transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="font-medium truncate">{article.title}</h3>
                    <p className="theme-muted text-sm truncate">
                      /{article.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {article.publishedAt ? (
                      <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                        {t("home", "published")}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                        {t("article", "draft")}
                      </span>
                    )}
                    <Link
                      to={`/write/${article.id}`}
                      className="p-2 rounded hover:bg-[var(--page-surface)] transition-colors"
                    >
                      <MdEdit size={18} className="theme-muted" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✍️</div>
              <h3 className="text-lg font-semibold mb-2">
                {t("home", "noArticlesYet")}
              </h3>
              <p className="theme-muted mb-6">{t("article", "createFirst")}</p>
              <Link
                to="/write"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-button text-white font-medium"
              >
                <MdAdd size={20} />
                {t("home", "startWriting")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <RequireAuth>
      <HomePageContent />
    </RequireAuth>
  );
}
