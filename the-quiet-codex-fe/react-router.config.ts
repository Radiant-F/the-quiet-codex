import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  basename: process.env.VITE_BASE_PATH || "/",
  ssr: true,
} satisfies Config;
