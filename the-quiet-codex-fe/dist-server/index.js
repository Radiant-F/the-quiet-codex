// server/index.ts
import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// server/inject-meta.ts
var API_URL = process.env.VITE_BASE_API_URL || process.env.API_URL || "";
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
async function injectArticleMeta(html, slug) {
  try {
    const res = await fetch(`${API_URL}/articles/slug/${slug}/meta`);
    if (!res.ok) return html;
    const meta = await res.json();
    const tags = [
      // Open Graph
      `<meta property="og:type" content="article" />`,
      `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
      `<meta property="og:url" content="${escapeHtml(meta.url)}" />`,
      meta.image ? `<meta property="og:image" content="${escapeHtml(meta.image)}" />` : "",
      `<meta property="article:author" content="${escapeHtml(meta.author)}" />`,
      `<meta property="article:published_time" content="${escapeHtml(meta.publishedAt)}" />`,
      // Twitter Card
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
      meta.image ? `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />` : "",
      // Standard
      `<meta name="description" content="${escapeHtml(meta.description)}" />`,
      `<title>${escapeHtml(meta.title)} \u2014 The Quiet Codex</title>`,
      // JSON-LD
      `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: meta.title,
        description: meta.description,
        image: meta.image || void 0,
        author: {
          "@type": "Person",
          name: meta.author
        },
        datePublished: meta.publishedAt,
        publisher: {
          "@type": "Organization",
          name: "The Quiet Codex"
        }
      })}</script>`
    ].filter(Boolean).join("\n    ");
    return html.replace(/<title>[^<]*<\/title>/, "").replace("</head>", `    ${tags}
  </head>`);
  } catch {
    return html;
  }
}

// server/index.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var DIST = path.resolve(__dirname, "../dist");
var PORT = Number(process.env.PORT) || 3e3;
var app = express();
var indexHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");
app.use(
  "/assets",
  express.static(path.join(DIST, "assets"), {
    maxAge: "1y",
    immutable: true
  })
);
app.use(express.static(DIST, { index: false }));
app.get("/articles/:slug", async (req, res) => {
  try {
    const html = await injectArticleMeta(indexHtml, req.params.slug);
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch {
    res.setHeader("Content-Type", "text/html");
    res.send(indexHtml);
  }
});
app.use((_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(indexHtml);
});
app.listen(PORT, () => {
  console.log(`\u{1F33F} The Quiet Codex is running on port ${PORT}`);
});
