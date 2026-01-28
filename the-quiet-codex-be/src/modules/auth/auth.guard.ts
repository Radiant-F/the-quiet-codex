import { Elysia } from "elysia";
import { jwtPlugin } from "./jwt.plugin";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { UnauthorizedError } from "../../lib/errors";

export const authGuard = new Elysia({ name: "authGuard" })
  .use(jwtPlugin)
  .derive({ as: "global" }, async ({ accessJwt, headers, set }) => {
    const authorization = headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      set.status = 401;
      throw new UnauthorizedError("Missing authorization header");
    }

    const token = authorization.slice(7);
    const payload = await accessJwt.verify(token);

    if (!payload || typeof payload === "boolean") {
      set.status = 401;
      throw new UnauthorizedError("Invalid or expired token");
    }

    const sub = payload.sub as string;
    const tokenVersion = payload.tokenVersion as number;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, sub))
      .limit(1);

    if (user.tokenVersion !== tokenVersion) {
      set.status = 401;
      throw new UnauthorizedError("Token revoked");
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        tokenVersion: user.tokenVersion,
      },
    };
  });
