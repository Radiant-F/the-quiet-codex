/**
 * inject-meta.ts
 *
 * Fetches article metadata from the backend API and injects
 * Open Graph + Twitter Card + JSON-LD into the SPA's index.html
 * so that social platforms (Discord, Twitter, Facebook, etc.)
 * render rich embeds when a user shares an article URL.
 */

interface ArticleMeta {
  title: string;
  description: string;
  image: string | null;
  url: string;
  author: string;
  publishedAt: string;
  type: string;
}

const API_URL = process.env.VITE_BASE_API_URL || process.env.API_URL || "";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function injectArticleMeta(
  html: string,
  slug: string,
): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/articles/slug/${slug}/meta`);
    if (!res.ok) return html;

    const meta = (await res.json()) as ArticleMeta;

    const tags = [
      // Open Graph
      `<meta property="og:type" content="article" />`,
      `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
      `<meta property="og:url" content="${escapeHtml(meta.url)}" />`,
      meta.image
        ? `<meta property="og:image" content="${escapeHtml(meta.image)}" />`
        : "",
      `<meta property="article:author" content="${escapeHtml(meta.author)}" />`,
      `<meta property="article:published_time" content="${escapeHtml(meta.publishedAt)}" />`,

      // Twitter Card
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
      meta.image
        ? `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`
        : "",

      // Standard
      `<meta name="description" content="${escapeHtml(meta.description)}" />`,
      `<title>${escapeHtml(meta.title)} — The Quiet Codex</title>`,

      // JSON-LD
      `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: meta.title,
        description: meta.description,
        image: meta.image || undefined,
        author: {
          "@type": "Person",
          name: meta.author,
        },
        datePublished: meta.publishedAt,
        publisher: {
          "@type": "Organization",
          name: "The Quiet Codex",
        },
      })}</script>`,
    ]
      .filter(Boolean)
      .join("\n    ");

    // Replace the <title> in the original HTML and inject OG tags before </head>
    return html
      .replace(/<title>[^<]*<\/title>/, "")
      .replace("</head>", `    ${tags}\n  </head>`);
  } catch {
    // If the API is unreachable, serve the SPA as-is
    return html;
  }
}
