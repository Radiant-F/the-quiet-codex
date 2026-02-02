import { useState } from "react";
import { Link } from "react-router";
import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { useListPublishedArticlesQuery } from "@/features/article";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import {
  MdLightMode,
  MdDarkMode,
  MdLanguage,
  MdArrowForward,
  MdArrowBack,
} from "react-icons/md";

export default function ArticlesPage() {
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, resolvedTheme } = useTheme();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isFetching } = useListPublishedArticlesQuery({
    page,
    limit,
  });

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : mode === "light" ? "system" : "dark");
  };

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "id" : "en");
  };

  return (
    <div className="theme-page min-h-screen">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="theme-accent">The Quiet</span>{" "}
            <span className="theme-text">Codex</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="theme-muted hover:theme-text transition-colors"
            >
              {t("common", "login")}
            </Link>
            <button
              onClick={toggleTheme}
              className="theme-muted hover:theme-accent cursor-pointer transition-colors"
              title={t("common", "switchTheme")}
            >
              {resolvedTheme === "dark" ? (
                <MdLightMode className="h-5 w-5" />
              ) : (
                <MdDarkMode className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={toggleLanguage}
              className="theme-muted hover:theme-accent cursor-pointer transition-colors"
              title={t("common", "switchLanguage")}
            >
              <MdLanguage className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="border-b border-[var(--page-border)] bg-[var(--page-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="theme-text mb-4 text-4xl font-bold">
            {t("article", "allArticles")}
          </h1>
          <p className="theme-muted max-w-2xl text-lg">
            {locale === "en"
              ? "Discover stories, ideas, and knowledge shared by our community of writers."
              : "Temukan cerita, ide, dan pengetahuan yang dibagikan oleh komunitas penulis kami."}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--page-accent)] border-t-transparent" />
          </div>
        ) : data?.articles && data.articles.length > 0 ? (
          <>
            {/* Articles Grid */}
            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="glass flex items-center gap-2 rounded-lg px-4 py-2 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MdArrowBack className="h-5 w-5" />
                  {locale === "en" ? "Previous" : "Sebelumnya"}
                </button>

                <span className="theme-muted">
                  {locale === "en"
                    ? `Page ${page} of ${data.totalPages}`
                    : `Halaman ${page} dari ${data.totalPages}`}
                </span>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(data.totalPages, p + 1))
                  }
                  disabled={page === data.totalPages || isFetching}
                  className="glass flex items-center gap-2 rounded-lg px-4 py-2 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {locale === "en" ? "Next" : "Selanjutnya"}
                  <MdArrowForward className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="glass rounded-2xl py-20 text-center">
            <span className="mb-4 block text-6xl">📝</span>
            <h3 className="theme-text mb-2 text-xl font-semibold">
              {t("article", "noArticles")}
            </h3>
            <p className="theme-muted mb-6">{t("article", "noArticlesDesc")}</p>
            <Link
              to="/auth"
              className="glass-button inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white"
            >
              {t("landing", "startWriting")}
              <MdArrowForward className="h-5 w-5" />
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--page-border)] py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="theme-muted text-sm">
            © {new Date().getFullYear()} The Quiet Codex.{" "}
            {locale === "en" ? "All rights reserved." : "Hak cipta dilindungi."}
          </p>
        </div>
      </footer>
    </div>
  );
}
