import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiFeather, FiLoader } from "react-icons/fi";
import { useGetArticleBySlugQuery } from "../../features/article";
import { ArticleContent } from "../../features/article";
import BlobSVG from "../../components/BlobSVG";
import {
  SERIF,
  SANS,
  FOREST,
  SAGE,
  TERRACOTTA,
  CREAM,
  KEYFRAMES,
} from "../../lib/theme";

export default function ArticleSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useGetArticleBySlugQuery(slug!);

  const jsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription ?? "",
        image: article.bannerImageUrl ?? undefined,
        author: {
          "@type": "Person",
          name: article.author.username,
        },
        datePublished: article.publishedAt ?? article.createdAt,
        dateModified: article.updatedAt,
      }
    : null;

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: CREAM, color: FOREST, fontFamily: SANS }}
    >
      {article && (
        <Helmet>
          <title>{article.title} — The Quiet Codex</title>
          <meta
            name="description"
            content={article.metaDescription ?? article.title}
          />
          <meta property="og:title" content={article.title} />
          <meta
            property="og:description"
            content={article.metaDescription ?? article.title}
          />
          {article.bannerImageUrl && (
            <meta property="og:image" content={article.bannerImageUrl} />
          )}
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={article.title} />
          <meta
            name="twitter:description"
            content={article.metaDescription ?? article.title}
          />
          {article.bannerImageUrl && (
            <meta name="twitter:image" content={article.bannerImageUrl} />
          )}
          {jsonLd && (
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
          )}
        </Helmet>
      )}

      <style>{KEYFRAMES}</style>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 md:px-16">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-white"
            style={{ background: SAGE }}
          >
            <FiFeather size={18} />
          </div>
          <div>
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: SERIF }}
            >
              The Quiet Codex
            </span>
            <p className="text-xs" style={{ color: `${FOREST}40` }}>
              Where ideas take root
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/articles"
            className="hidden text-sm transition-colors md:block"
            style={{ color: `${FOREST}50` }}
          >
            All Articles
          </Link>
          <Link
            to="/auth"
            className="rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg"
            style={{ background: TERRACOTTA }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      <BlobSVG
        className="float-slow pointer-events-none absolute -right-60 top-0 w-[700px]"
        color={SAGE}
        opacity={0.05}
      />

      {/* Content */}
      <section className="relative z-10 px-8 py-12 md:px-16 md:py-16">
        {isLoading && (
          <div className="flex justify-center py-32">
            <FiLoader
              size={32}
              className="animate-spin"
              style={{ color: SAGE }}
            />
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-3xl py-32 text-center">
            <h2
              className="mb-2 text-3xl font-semibold"
              style={{ fontFamily: SERIF }}
            >
              Article not found
            </h2>
            <p className="mb-6 text-sm" style={{ color: `${FOREST}50` }}>
              This article may have been removed or the URL may be incorrect.
            </p>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white"
              style={{ background: FOREST }}
            >
              Browse all articles
            </Link>
          </div>
        )}

        {article && <ArticleContent article={article} />}
      </section>

      {/* Footer */}
      <footer
        className="px-8 py-8 md:px-16"
        style={{ borderTop: `1px solid ${FOREST}10` }}
      >
        <div
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row"
          style={{ color: `${FOREST}60` }}
        >
          <span style={{ fontFamily: SERIF }} className="text-base">
            &copy; 2026 The Quiet Codex
          </span>
          <div className="flex items-center gap-6">
            <Link to="/" className="transition-colors hover:opacity-80">
              Home
            </Link>
            <Link to="/articles" className="transition-colors hover:opacity-80">
              Articles
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
