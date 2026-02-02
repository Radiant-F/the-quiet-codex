import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { Link } from "react-router";
import {
  MdLightMode,
  MdDarkMode,
  MdLanguage,
  MdEdit,
  MdPeople,
  MdTrendingUp,
  MdArrowForward,
} from "react-icons/md";
import { useAppSelector } from "@/hooks";
import { useListPublishedArticlesQuery } from "@/features/article";
import { ArticleCard } from "@/features/article/components/ArticleCard";

export default function RootPage() {
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, resolvedTheme } = useTheme();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch latest articles for landing page
  const { data: articlesData, isLoading: isLoadingArticles } =
    useListPublishedArticlesQuery({ page: 1, limit: 6 });

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

  return (
    <main className="min-h-screen hero-gradient relative z-10">
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
            {isAuthenticated ? (
              <Link
                to="/my-articles"
                className="px-5 py-2.5 rounded-xl glass-button text-white font-medium"
              >
                {t("article", "myArticles")}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="px-5 py-2.5 rounded-xl glass-button text-white font-medium"
              >
                {t("common", "login")}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t("landing", "heroTitle")}
          </h1>
          <p className="text-lg sm:text-xl theme-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("landing", "heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/articles"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass font-medium text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              {t("landing", "startReading")}
              <MdArrowForward className="h-5 w-5" />
            </Link>
            <Link
              to={isAuthenticated ? "/write" : "/auth"}
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-button text-white font-medium text-lg flex items-center justify-center gap-2"
            >
              {t("landing", "startWriting")}
              <MdEdit className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-[var(--page-border)]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-8 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 rounded-xl bg-[var(--page-accent)]/20 flex items-center justify-center mb-5">
                <MdEdit size={28} className="theme-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("landing", "feature1Title")}
              </h3>
              <p className="theme-muted">{t("landing", "feature1Desc")}</p>
            </div>

            <div className="glass rounded-2xl p-8 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 rounded-xl bg-[var(--page-accent)]/20 flex items-center justify-center mb-5">
                <MdPeople size={28} className="theme-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("landing", "feature2Title")}
              </h3>
              <p className="theme-muted">{t("landing", "feature2Desc")}</p>
            </div>

            <div className="glass rounded-2xl p-8 transition-all hover:scale-[1.02]">
              <div className="w-14 h-14 rounded-xl bg-[var(--page-accent)]/20 flex items-center justify-center mb-5">
                <MdTrendingUp size={28} className="theme-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t("landing", "feature3Title")}
              </h3>
              <p className="theme-muted">{t("landing", "feature3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 border-t border-[var(--page-border)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {t("landing", "latestArticles")}
            </h2>
            <Link
              to="/articles"
              className="theme-accent flex items-center gap-2 font-medium hover:underline"
            >
              {locale === "en" ? "View All" : "Lihat Semua"}
              <MdArrowForward className="h-5 w-5" />
            </Link>
          </div>

          {isLoadingArticles ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--page-accent)] border-t-transparent" />
            </div>
          ) : articlesData?.articles && articlesData.articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articlesData.articles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  featured={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl py-16 text-center">
              <span className="mb-4 block text-5xl">📝</span>
              <h3 className="theme-text mb-2 text-xl font-semibold">
                {t("landing", "noArticlesYet")}
              </h3>
              <Link
                to={isAuthenticated ? "/write" : "/auth"}
                className="glass-button mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white"
              >
                {t("landing", "startWriting")}
                <MdEdit className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-[var(--page-border)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t("landing", "joinCommunity")}
          </h2>
          <p className="theme-muted text-lg mb-8 max-w-xl mx-auto">
            {locale === "en"
              ? "Start sharing your stories and connect with readers who care about what you have to say."
              : "Mulai bagikan cerita Anda dan terhubung dengan pembaca yang peduli dengan apa yang Anda sampaikan."}
          </p>
          <Link
            to={isAuthenticated ? "/write" : "/auth"}
            className="px-10 py-4 rounded-xl glass-button text-white font-medium text-lg inline-flex items-center gap-2"
          >
            {t("common", "getStarted")}
            <MdArrowForward className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--page-border)] py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="theme-muted text-sm">
            © {new Date().getFullYear()} The Quiet Codex.{" "}
            {locale === "en" ? "All rights reserved." : "Hak cipta dilindungi."}
          </p>
        </div>
      </footer>
    </main>
  );
}
