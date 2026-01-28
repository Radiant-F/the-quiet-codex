import { Elysia } from "elysia";
import { AppError } from "../lib/errors";

export const errorHandler = new Elysia({ name: "errorHandler" }).onError(
  { as: "global" },
  ({ error, set, code }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return { message: error.message };
    }

    // Handle Elysia validation errors (code is "VALIDATION")
    if (code === "VALIDATION") {
      set.status = 422;
      return { message: "Validation failed" };
    }

    // Handle other Error types
    if (error instanceof Error) {
      // Log unexpected errors
      console.error("Unexpected error:", error);
    }

    set.status = 500;
    return { message: "Internal server error" };
  },
);
