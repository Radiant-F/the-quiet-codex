export interface User {
  username: string;
  id: string;
}

export interface UserProfile {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  accessToken: string;
  user: User;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface SignInRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface UpdateMeRequest {
  username?: string;
  password?: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ProfilePictureResponse {
  message: string;
  profilePictureUrl: string;
}

export interface MessageResponse {
  message: string;
}
