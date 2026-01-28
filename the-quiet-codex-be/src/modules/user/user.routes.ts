import { Elysia } from "elysia";
import {
  userResponse,
  updateUserBody,
  errorResponse,
  messageResponse,
} from "./user.schema";
import { userService } from "./user.service";
import { authGuard } from "../auth/auth.guard";
import { ConflictError } from "../../lib/errors";

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(authGuard)
  .get(
    "/me",
    async ({ user }) => {
      return await userService.getProfile(user.id);
    },
    {
      response: {
        200: userResponse,
        401: errorResponse,
      },
      detail: {
        summary: "Get current user profile",
        description: "Returns the authenticated user's profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .put(
    "/me",
    async ({ user, body, set }) => {
      try {
        return await userService.updateProfile(user.id, body);
      } catch (err) {
        if (err instanceof ConflictError) {
          set.status = 409;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      body: updateUserBody,
      response: {
        200: userResponse,
        401: errorResponse,
        409: errorResponse,
        422: errorResponse,
      },
      detail: {
        summary: "Update current user profile",
        description: "Updates the authenticated user's profile",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/me",
    async ({ user, cookie }) => {
      await userService.deleteAccount(user.id);

      cookie.refreshToken.remove();

      return { message: "Account deleted successfully" };
    },
    {
      response: {
        200: messageResponse,
        401: errorResponse,
      },
      detail: {
        summary: "Delete current user account",
        description: "Permanently deletes the authenticated user's account",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      },
    },
  );
