import { apiSlice } from "../../../api/api.slice";
import type {
  AuthResponse,
  SignInRequest,
  SignUpRequest,
  UpdateMeRequest,
  LogoutResponse,
  UserProfile,
  ProfilePictureResponse,
  MessageResponse,
} from "../auth.domain";
import { clearSession, setUser, setUserSession } from "./auth.reducer";
import { getRtkQueryErrorInfo } from "../../../api/rtk-query-error";

const logQueryError = (error: unknown) => {
  const errorInfo = getRtkQueryErrorInfo(error);
  switch (errorInfo.kind) {
    case "fetch":
      console.log("RESPONSE ERROR QUERY:", errorInfo.status, errorInfo.data);
      break;
    case "serialized":
      console.log("RESPONSE ERROR SERIALIZED:", errorInfo.message);
      break;
    default:
      console.log("RESPONSE ERROR ANY:", errorInfo.raw);
      break;
  }
};

export const authApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserSession(data));
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    signIn: builder.mutation<AuthResponse, SignInRequest>({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserSession(data));
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserSession(data));
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(clearSession());
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    me: builder.query<UserProfile, void>({
      query: () => "/users/me",
      providesTags: ["UserProfile"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    updateMe: builder.mutation<UserProfile, UpdateMeRequest>({
      query: (payload) => ({
        url: "/users/me",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["UserProfile"],
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser({ id: data.id, username: data.username }));
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    deleteMe: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(clearSession());
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    uploadProfilePicture: builder.mutation<ProfilePictureResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/users/me/profile-picture",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["UserProfile"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
    deleteProfilePicture: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/users/me/profile-picture",
        method: "DELETE",
      }),
      invalidatesTags: ["UserProfile"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("RESPONSE SUCCESS:", data);
        } catch (error) {
          logQueryError(error);
        }
      },
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useRefreshMutation,
  useLogoutMutation,
  useMeQuery,
  useUpdateMeMutation,
  useDeleteMeMutation,
  useUploadProfilePictureMutation,
  useDeleteProfilePictureMutation,
} = authApiSlice;
