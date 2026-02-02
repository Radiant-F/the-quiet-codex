import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import {
  useListMyArticlesQuery,
  useDeleteArticleMutation,
  useUpdateArticleMutation,
} from "@/features/article";
import {
  MdLightMode,
  MdDarkMode,
  MdLanguage,
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdArrowBack,
  MdLogout,
} from "react-icons/md";
import { useLogoutMutation } from "@/features/auth";

function MyArticlesContent() {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, resolvedTheme } = useTheme();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useListMyArticlesQuery({
    page,
    limit,
  });
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [logout] = useLogoutMutation();

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : mode === "light" ? "system" : "dark");
  };

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "id" : "en");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `${t("article", "deleteConfirm")}\n\n"${title}"`,
    );
    if (confirmed) {
      await deleteArticle(id);
    }
  };

  const handleTogglePublish = async (
    id: string,
    currentlyPublished: boolean,
  ) => {
    await updateArticle({
      id,
      data: { publish: !currentlyPublished },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "en" ? "en-US" : "id-ID",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
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
              to="/articles"
              className="theme-muted hover:theme-text transition-colors"
            >
              {t("article", "articles")}
            </Link>
            <button
              onClick={handleLogout}
              className="theme-muted hover:text-red-400 cursor-pointer transition-colors"
              title={t("common", "logout")}
            >
              <MdLogout className="h-5 w-5" />
            </button>
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8">
          <div>
            <h1 className="theme-text mb-2 text-3xl font-bold">
              {t("article", "myArticles")}
            </h1>
            <p className="theme-muted">
              {locale === "en"
                ? "Manage your published articles and drafts"
                : "Kelola artikel dan draf yang telah Anda publikasikan"}
            </p>
          </div>
          <Link
            to="/write"
            className="glass-button flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white"
          >
            <MdAdd className="h-5 w-5" />
            <span className="hidden sm:inline">
              {t("article", "writeArticle")}
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--page-accent)] border-t-transparent" />
          </div>
        ) : data?.articles && data.articles.length > 0 ? (
          <>
            {/* Articles Table */}
            <div className="glass overflow-hidden rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--page-border)] bg-[var(--page-elevated)]">
                      <th className="theme-text px-6 py-4 text-left font-medium">
                        {t("article", "title")}
                      </th>
                      <th className="theme-text hidden px-6 py-4 text-left font-medium sm:table-cell">
                        {locale === "en" ? "Status" : "Status"}
                      </th>
                      <th className="theme-text hidden px-6 py-4 text-left font-medium md:table-cell">
                        {locale === "en" ? "Date" : "Tanggal"}
                      </th>
                      <th className="theme-text px-6 py-4 text-right font-medium">
                        {locale === "en" ? "Actions" : "Aksi"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.articles.map((article) => (
                      <tr
                        key={article.id}
                        className="border-b border-[var(--page-border)] last:border-0"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="theme-text font-medium line-clamp-1">
                              {article.title}
                            </p>
                            <p className="theme-muted text-sm line-clamp-1">
                              /{article.slug}
                            </p>
                          </div>
                        </td>
                        <td className="hidden px-6 py-4 sm:table-cell">
                          {article.publishedAt ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                              <MdVisibility className="h-3.5 w-3.5" />
                              {t("home", "published")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">
                              <MdVisibilityOff className="h-3.5 w-3.5" />
                              {t("article", "draft")}
                            </span>
                          )}
                        </td>
                        <td className="theme-muted hidden px-6 py-4 text-sm md:table-cell">
                          {article.publishedAt
                            ? formatDate(article.publishedAt)
                            : formatDate(article.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* View (only if published) */}
                            {article.publishedAt && (
                              <Link
                                to={`/article/${article.slug}`}
                                className="theme-muted rounded p-2 transition-colors hover:bg-[var(--page-elevated)] hover:text-[var(--page-accent)]"
                                title={locale === "en" ? "View" : "Lihat"}
                              >
                                <MdVisibility className="h-5 w-5" />
                              </Link>
                            )}

                            {/* Toggle Publish */}
                            <button
                              onClick={() =>
                                handleTogglePublish(
                                  article.id,
                                  !!article.publishedAt,
                                )
                              }
                              className="theme-muted rounded p-2 transition-colors hover:bg-[var(--page-elevated)] hover:text-[var(--page-accent)]"
                              title={
                                article.publishedAt
                                  ? t("article", "unpublish")
                                  : t("article", "publish")
                              }
                            >
                              {article.publishedAt ? (
                                <MdVisibilityOff className="h-5 w-5" />
                              ) : (
                                <MdVisibility className="h-5 w-5" />
                              )}
                            </button>

                            {/* Edit */}
                            <Link
                              to={`/write/${article.id}`}
                              className="theme-muted rounded p-2 transition-colors hover:bg-[var(--page-elevated)] hover:text-[var(--page-accent)]"
                              title={t("common", "edit")}
                            >
                              <MdEdit className="h-5 w-5" />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(article.id, article.title)
                              }
                              disabled={isDeleting}
                              className="theme-muted rounded p-2 transition-colors hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
                              title={t("common", "delete")}
                            >
                              <MdDelete className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
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
            <span className="mb-4 block text-6xl">✍️</span>
            <h3 className="theme-text mb-2 text-xl font-semibold">
              {t("home", "noArticlesYet")}
            </h3>
            <p className="theme-muted mb-6">{t("article", "createFirst")}</p>
            <Link
              to="/write"
              className="glass-button inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white"
            >
              <MdAdd className="h-5 w-5" />
              {t("article", "writeArticle")}
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

export default function MyArticlesPage() {
  return (
    <RequireAuth>
      <MyArticlesContent />
    </RequireAuth>
  );
}
