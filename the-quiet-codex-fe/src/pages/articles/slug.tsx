import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiBookOpen, FiLoader } from "react-icons/fi";
import { useGetArticleBySlugQuery } from "../../features/article";
import { ArticleContent } from "../../features/article";
import {
  DISPLAY,
  SANS,
  DEEP,
  TEXT_PRIMARY,
  TEXT_MUTED,
  TEXT_DIM,
  AURORA_1,
  AURORA_2,
  AURORA_3,
  AURORA_4,
  GLASS_BORDER,
  GRADIENT_PRIMARY,
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
      style={{ background: DEEP, color: TEXT_PRIMARY, fontFamily: SANS }}
    >
      {article && (
        <Helmet>
          <title>{article.title} — The Quiet Codex</title>
          <meta
            name="description"
            content={article.metaDescription ?? article.title}
          />
          <meta name="theme-color" content={DEEP} />
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
          <link
            href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </Helmet>
      )}

      {/* Noise */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" />

      {/* Ambient orb */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 right-1/4"
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `conic-gradient(from 90deg, ${AURORA_1}, ${AURORA_2}, ${AURORA_3}, ${AURORA_4})`,
            filter: "blur(120px)",
            opacity: 0.2,
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 md:px-16">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
            style={{ background: GRADIENT_PRIMARY }}
          >
            <FiBookOpen size={16} />
          </div>
          <div>
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
            >
              The Quiet Codex
            </span>
            <p className="text-xs" style={{ color: TEXT_DIM }}>
              Where ideas illuminate
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/articles"
            className="hidden text-sm transition-colors hover:opacity-80 md:block"
            style={{ color: TEXT_DIM }}
          >
            All Articles
          </Link>
          <Link
            to="/auth"
            className="rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
            style={{ background: GRADIENT_PRIMARY }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Content */}
      <section className="relative z-10 px-8 py-12 md:px-16 md:py-16">
        {isLoading && (
          <div className="flex justify-center py-32">
            <FiLoader
              size={32}
              className="animate-spin"
              style={{ color: AURORA_2 }}
            />
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-3xl py-32 text-center">
            <h2
              className="mb-2 text-3xl font-semibold"
              style={{ fontFamily: DISPLAY }}
            >
              Article not found
            </h2>
            <p className="mb-6 text-sm" style={{ color: TEXT_MUTED }}>
              This article may have been removed or the URL may be incorrect.
            </p>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white"
              style={{ background: GRADIENT_PRIMARY }}
            >
              Browse all articles
            </Link>
          </div>
        )}

        {article && <ArticleContent article={article} />}
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 px-8 py-8 md:px-16"
        style={{ borderTop: `1px solid ${GLASS_BORDER}` }}
      >
        <div
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row"
          style={{ color: TEXT_DIM }}
        >
          <span style={{ fontFamily: DISPLAY }} className="text-base">
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
