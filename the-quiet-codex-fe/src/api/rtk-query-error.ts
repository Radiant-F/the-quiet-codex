import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type QueryErrorInfo =
  | {
      kind: "fetch";
      status: FetchBaseQueryError["status"];
      data?: FetchBaseQueryError["data"];
      raw: FetchBaseQueryError;
    }
  | {
      kind: "serialized";
      message?: string;
      raw: SerializedError;
    }
  | {
      kind: "unknown";
      raw: unknown;
    };

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === "object" && error !== null && "status" in error;

const isSerializedError = (error: unknown): error is SerializedError =>
  typeof error === "object" && error !== null && "message" in error;

const unwrapError = (error: unknown): unknown => {
  if (typeof error === "object" && error !== null && "error" in error) {
    return (error as { error?: unknown }).error;
  }

  return error;
};

const getRtkQueryErrorInfo = (error: unknown): QueryErrorInfo => {
  const unwrapped = unwrapError(error);

  if (isFetchBaseQueryError(unwrapped)) {
    return {
      kind: "fetch",
      status: unwrapped.status,
      data: unwrapped.data,
      raw: unwrapped,
    };
  }

  if (isSerializedError(unwrapped)) {
    return {
      kind: "serialized",
      message: unwrapped.message,
      raw: unwrapped,
    };
  }

  return { kind: "unknown", raw: unwrapped };
};

export { getRtkQueryErrorInfo, isFetchBaseQueryError, isSerializedError };
export type { QueryErrorInfo };
