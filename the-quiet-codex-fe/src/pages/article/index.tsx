import { Link, useParams, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { useGetArticleBySlugQuery } from "@/features/article";
import { ArticleContent } from "@/features/article/components/ArticleContent";
import {
  MdLightMode,
  MdDarkMode,
  MdLanguage,
  MdArrowBack,
  MdAccessTime,
  MdPerson,
  MdShare,
} from "react-icons/md";
import type { Article, ArticleMeta } from "@/features/article/article.d";

interface LoaderData {
  article: Article;
  meta: ArticleMeta | null;
}

// SSR Loader for fetching article data
export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  try {
    const [articleRes, metaRes] = await Promise.all([
      fetch(`${baseUrl}/articles/slug/${params.slug}`),
      fetch(`${baseUrl}/articles/slug/${params.slug}/meta`),
    ]);

    if (!articleRes.ok) {
      throw new Response("Article not found", { status: 404 });
    }

    const article = await articleRes.json();
    const meta = metaRes.ok ? await metaRes.json() : null;

    return { article, meta };
  } catch {
    throw new Response("Article not found", { status: 404 });
  }
}

// Dynamic meta tags for SEO and Open Graph
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.article) {
    return [
      { title: "Article Not Found - The Quiet Codex" },
      { name: "robots", content: "noindex" },
    ];
  }

  const { article, meta: articleMeta } = data;
  const title = `${article.title} - The Quiet Codex`;
  const description = article.metaDescription;
  const image = article.bannerImageUrl;
  const url =
    articleMeta?.url || `https://the-quiet-codex.com/article/${article.slug}`;

  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: article.author.username },

    // Open Graph
    { property: "og:type", content: "article" },
    { property: "og:title", content: article.title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    ...(image ? [{ property: "og:image", content: image }] : []),
    { property: "og:site_name", content: "The Quiet Codex" },
    ...(article.publishedAt
      ? [{ property: "article:published_time", content: article.publishedAt }]
      : []),
    { property: "article:author", content: article.author.username },

    // Twitter Card
    {
      name: "twitter:card",
      content: image ? "summary_large_image" : "summary",
    },
    { name: "twitter:title", content: article.title },
    { name: "twitter:description", content: description },
    ...(image ? [{ name: "twitter:image", content: image }] : []),
  ];
};

export default function ArticlePage() {
  const { slug } = useParams();
  const loaderData = useLoaderData<LoaderData>();
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, resolvedTheme } = useTheme();

  // Use SSR data if available, otherwise fetch client-side
  const {
    data: clientData,
    isLoading,
    error,
  } = useGetArticleBySlugQuery(slug!, { skip: !!loaderData?.article });

  const article = loaderData?.article || clientData;

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : mode === "light" ? "system" : "dark");
  };

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "id" : "en");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "en" ? "en-US" : "id-ID",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.metaDescription,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Estimate reading time
  const estimateReadTime = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "");
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  if (isLoading && !article) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--page-accent)] border-t-transparent" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="theme-page min-h-screen">
        <nav className="glass-nav sticky top-0 z-50">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <Link to="/" className="text-xl font-bold tracking-tight">
              <span className="theme-accent">The Quiet</span>{" "}
              <span className="theme-text">Codex</span>
            </Link>
          </div>
        </nav>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <span className="mb-4 block text-6xl">📭</span>
          <h1 className="theme-text mb-4 text-3xl font-bold">
            {t("article", "notFound")}
          </h1>
          <p className="theme-muted mb-8">{t("article", "notFoundDesc")}</p>
          <Link
            to="/articles"
            className="glass-button inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white"
          >
            <MdArrowBack className="h-5 w-5" />
            {t("article", "backToArticles")}
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Banner Image */}
      {article.bannerImageUrl && (
        <div className="relative h-64 w-full overflow-hidden bg-[var(--page-elevated)] sm:h-80 md:h-96">
          <img
            src={article.bannerImageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--page-bg)] to-transparent" />
        </div>
      )}

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Back Link */}
        <Link
          to="/articles"
          className="theme-muted mb-8 inline-flex items-center gap-2 text-sm transition-colors hover:text-[var(--page-accent)]"
        >
          <MdArrowBack className="h-4 w-4" />
          {t("article", "backToArticles")}
        </Link>

        {/* Title */}
        <h1 className="theme-text mb-6 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {article.title}
        </h1>

        {/* Meta Description */}
        <p className="theme-muted mb-8 text-lg leading-relaxed">
          {article.metaDescription}
        </p>

        {/* Author & Date Info */}
        <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-[var(--page-border)] pb-8">
          {/* Author */}
          <div className="flex items-center gap-3">
            {article.author.profilePictureUrl ? (
              <img
                src={article.author.profilePictureUrl}
                alt={article.author.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--page-elevated)]">
                <MdPerson className="h-6 w-6 text-[var(--page-muted)]" />
              </div>
            )}
            <div>
              <p className="theme-text font-medium">
                {article.author.username}
              </p>
              <p className="theme-muted text-sm">
                {article.publishedAt
                  ? formatDate(article.publishedAt)
                  : formatDate(article.createdAt)}
              </p>
            </div>
          </div>

          {/* Read Time */}
          <div className="flex items-center gap-2 text-sm text-[var(--page-muted)]">
            <MdAccessTime className="h-4 w-4" />
            <span>
              {estimateReadTime(article.body)} {t("article", "minRead")}
            </span>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="theme-muted ml-auto flex items-center gap-2 text-sm transition-colors hover:text-[var(--page-accent)]"
            title={t("article", "shareArticle")}
          >
            <MdShare className="h-5 w-5" />
            <span className="hidden sm:inline">
              {t("article", "shareArticle")}
            </span>
          </button>
        </div>

        {/* Article Body */}
        <ArticleContent html={article.body} />

        {/* Footer */}
        <div className="mt-12 border-t border-[var(--page-border)] pt-8">
          <Link
            to="/articles"
            className="glass inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-all hover:scale-105"
          >
            <MdArrowBack className="h-5 w-5" />
            {t("article", "backToArticles")}
          </Link>
        </div>
      </article>

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
