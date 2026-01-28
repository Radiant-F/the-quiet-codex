import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { errorHandler } from "./plugins/error-handler";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";

export const app = new Elysia()
  .use(
    openapi({
      path: "/docs",
      documentation: {
        info: {
          title: "The Quiet Codex API",
          version: "1.0.0",
          description: "Production-ready ElysiaJS API",
        },
        tags: [
          { name: "Health", description: "Health check endpoints" },
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Users", description: "User management endpoints" },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    }),
  )
  .use(errorHandler)
  .get(
    "/health",
    () => ({ status: "ok", timestamp: new Date().toISOString() }),
    {
      response: {
        200: t.Object({
          status: t.String({ examples: ["ok"] }),
          timestamp: t.String({ examples: ["2024-01-01T00:00:00.000Z"] }),
        }),
      },
      detail: {
        summary: "Health check",
        description: "Returns the health status of the API",
        tags: ["Health"],
      },
    },
  )
  .use(authRoutes)
  .use(userRoutes);

export type App = typeof app;
