import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Landing page
  index("pages/root/index.tsx"),

  // Auth
  route("auth", "pages/auth/index.tsx"),

  // User dashboard (protected)
  route("home", "pages/home/index.tsx"),

  // Articles (public)
  route("articles", "pages/articles/index.tsx"),
  route("article/:slug", "pages/article/index.tsx"),

  // Article management (protected)
  route("write", "pages/write/index.tsx", { id: "write-new" }),
  route("write/:id", "pages/write/index.tsx", { id: "write-edit" }),
  route("my-articles", "pages/my-articles/index.tsx"),
] satisfies RouteConfig;
