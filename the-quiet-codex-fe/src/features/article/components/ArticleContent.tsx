import { Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import type { Article } from "../article.domain";

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  return (
    <article
      className="mx-auto max-w-3xl"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Back link */}
      <Link
        to="/articles"
        className="mb-8 inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
        style={{ color: "var(--color-text-dim)" }}
      >
        <FiArrowLeft size={14} />
        Back to articles
      </Link>

      {/* Banner */}
      {article.bannerImageUrl && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img
            src={article.bannerImageUrl}
            alt=""
            className="h-64 w-full object-cover md:h-80"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        <h1
          className="mb-4 text-4xl font-semibold leading-tight md:text-5xl"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
          }}
        >
          {article.title}
        </h1>

        {article.metaDescription && (
          <p
            className="mb-6 text-lg leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            {article.metaDescription}
          </p>
        )}

        {/* Author bar */}
        <div className="flex items-center gap-4 rounded-xl px-5 py-4 glass-panel">
          {article.author.profilePictureUrl ? (
            <img
              src={article.author.profilePictureUrl}
              alt={article.author.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-aurora-purple), var(--color-aurora-teal))",
              }}
            >
              {article.author.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {article.author.username}
            </p>
            <p
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--color-text-dim)" }}
            >
              <FiCalendar size={11} />
              {date}
            </p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      {/* Footer divider */}
      <div className="my-16 flex items-center justify-center gap-4">
        <div
          className="h-px w-20"
          style={{ background: "var(--color-glass-border)" }}
        />
        <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
          fin
        </span>
        <div
          className="h-px w-20"
          style={{ background: "var(--color-glass-border)" }}
        />
      </div>
    </article>
  );
}
