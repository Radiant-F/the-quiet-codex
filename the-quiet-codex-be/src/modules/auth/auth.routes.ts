import { Elysia } from "elysia";
import {
  signupBody,
  signinBody,
  authResponse,
  errorResponse,
  messageResponse,
} from "./auth.schema";
import { authService } from "./auth.service";
import { jwtPlugin } from "./jwt.plugin";
import { authGuard } from "./auth.guard";
import { ConflictError, UnauthorizedError } from "../../lib/errors";
import { env } from "../../lib/env";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(jwtPlugin)
  .post(
    "/signup",
    async ({ body, accessJwt, refreshJwt, cookie, set }) => {
      try {
        const result = await authService.signup(body);

        const accessToken = await accessJwt.sign({
          sub: result.user.id,
          tokenVersion: result.user.tokenVersion,
        });

        const refreshToken = await refreshJwt.sign({
          sub: result.user.id,
          tokenVersion: result.user.tokenVersion,
        });

        cookie.refreshToken.set({
          value: refreshToken,
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        return { accessToken, user: result.user };
      } catch (err) {
        if (err instanceof ConflictError) {
          set.status = 409;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      body: signupBody,
      response: {
        200: authResponse,
        409: errorResponse,
        422: errorResponse,
      },
      detail: {
        summary: "Register a new user",
        description: "Creates a new user account and returns access token",
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/signin",
    async ({ body, accessJwt, refreshJwt, cookie, set }) => {
      try {
        const result = await authService.signin(body);

        const accessToken = await accessJwt.sign({
          sub: result.user.id,
          tokenVersion: result.user.tokenVersion,
        });

        const refreshToken = await refreshJwt.sign({
          sub: result.user.id,
          tokenVersion: result.user.tokenVersion,
        });

        cookie.refreshToken.set({
          value: refreshToken,
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        return { accessToken, user: result.user };
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          set.status = 401;
          return { message: err.message };
        }
        throw err;
      }
    },
    {
      body: signinBody,
      response: {
        200: authResponse,
        401: errorResponse,
        422: errorResponse,
      },
      detail: {
        summary: "Sign in user",
        description: "Authenticates user and returns access token",
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/refresh",
    async ({ cookie, accessJwt, refreshJwt, set }) => {
      const refreshTokenValue = cookie.refreshToken.value;

      if (!refreshTokenValue || typeof refreshTokenValue !== "string") {
        set.status = 401;
        return { message: "No refresh token provided" };
      }

      const payload = await refreshJwt.verify(refreshTokenValue);

      if (!payload || typeof payload === "boolean") {
        set.status = 401;
        return { message: "Invalid or expired refresh token" };
      }

      const sub = payload.sub as string;
      const tokenVersion = payload.tokenVersion as number;

      const user = await authService.getUserById(sub);

      if (!user || user.tokenVersion !== tokenVersion) {
        set.status = 401;
        return { message: "Token revoked" };
      }

      const accessToken = await accessJwt.sign({
        sub: user.id,
        tokenVersion: user.tokenVersion,
      });

      const newRefreshToken = await refreshJwt.sign({
        sub: user.id,
        tokenVersion: user.tokenVersion,
      });

      cookie.refreshToken.set({
        value: newRefreshToken,
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return { accessToken, user };
    },
    {
      response: {
        200: authResponse,
        401: errorResponse,
      },
      detail: {
        summary: "Refresh access token",
        description: "Uses refresh token cookie to issue new access token",
        tags: ["Auth"],
      },
    },
  )
  .use(authGuard)
  .post(
    "/logout",
    async ({ user, cookie }) => {
      await authService.logout(user.id);

      cookie.refreshToken.remove();

      return { message: "Logged out successfully" };
    },
    {
      response: {
        200: messageResponse,
        401: errorResponse,
      },
      detail: {
        summary: "Logout user",
        description: "Invalidates all user tokens and clears refresh cookie",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
      },
    },
  );
