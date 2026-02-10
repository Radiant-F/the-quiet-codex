import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../redux/store";
import { clearSession, setUserSession } from "../features/auth";
import type { AuthResponse } from "../features/auth";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, api) => {
    const accessToken = (api.getState() as RootState).auth.accessToken;
    if (accessToken) headers.append("Authorization", `Bearer ${accessToken}`);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await rawBaseQuery(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions,
        );
        if (
          refreshResult.data &&
          typeof refreshResult.data === "object" &&
          "accessToken" in refreshResult.data
        ) {
          api.dispatch(setUserSession(refreshResult.data as AuthResponse));
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearSession());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Article", "ArticleList", "MyArticleList", "UserProfile"],
  endpoints: () => ({}),
});
