/**
 * Production server for The Quiet Codex frontend.
 *
 * Serves the Vite-built SPA from /dist and intercepts
 * /articles/:slug requests to inject Open Graph metadata
 * so social platforms render rich embeds.
 */

import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { injectArticleMeta } from "./inject-meta.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const PORT = Number(process.env.PORT) || 3000;

const app = express();

// Read the built index.html once at startup
const indexHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

// Serve static assets with long cache
app.use(
  "/assets",
  express.static(path.join(DIST, "assets"), {
    maxAge: "1y",
    immutable: true,
  }),
);

// Serve other static files (favicon, etc.)
app.use(express.static(DIST, { index: false }));

// Intercept article routes → inject OG meta
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

// All other routes → SPA fallback
app.use((_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(indexHtml);
});

app.listen(PORT, () => {
  console.log(`🌿 The Quiet Codex is running on port ${PORT}`);
});
