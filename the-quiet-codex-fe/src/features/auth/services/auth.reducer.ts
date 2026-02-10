import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../auth.domain";

const initialState: AuthState = {
  accessToken: "",
  user: {
    id: "",
    username: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserSession(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearSession(state) {
      state.accessToken = "";
      state.user = { id: "", username: "" };
    },
  },
});

export const { setUserSession, setAccessToken, setUser, clearSession } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
