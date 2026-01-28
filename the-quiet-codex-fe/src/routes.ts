import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/root/index.tsx"),
  route("auth", "pages/auth/index.tsx"),
  route("home", "pages/home/index.tsx"),
] satisfies RouteConfig;
