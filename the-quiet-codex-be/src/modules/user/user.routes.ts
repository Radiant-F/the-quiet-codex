import { Elysia, t } from "elysia";
import {
  userResponse,
  updateUserBody,
  errorResponse,
  messageResponse,
  uploadProfilePictureResponse,
  deleteProfilePictureResponse,
} from "./user.schema";
import { userService } from "./user.service";
import { authGuard } from "../auth/auth.guard";
import { ConflictError, NotFoundError } from "../../lib/errors";

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
  .post(
    "/me/profile-picture",
    async ({ user, body, set }) => {
      try {
        const { file } = body;
        return await userService.uploadProfilePicture(user.id, file);
      } catch (err) {
        if (err instanceof ConflictError) {
          set.status = 400;
          return { message: err.message };
        }
        if (err instanceof NotFoundError) {
          set.status = 404;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      body: t.Object({
        file: t.File({
          type: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/avif",
          ],
          maxSize: "5m",
        }),
      }),
      response: {
        200: uploadProfilePictureResponse,
        400: errorResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Upload profile picture",
        description:
          "Upload a profile picture for the authenticated user. Image will be automatically optimized (resized to 512x512, compressed, and converted to optimal format).",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/me/profile-picture",
    async ({ user, set }) => {
      try {
        return await userService.deleteProfilePicture(user.id);
      } catch (err) {
        if (err instanceof NotFoundError) {
          set.status = 404;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      response: {
        200: deleteProfilePictureResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Delete profile picture",
        description: "Deletes the authenticated user's profile picture",
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
