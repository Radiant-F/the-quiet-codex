export interface TokenResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SigninRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface SigninResponse {
  accessToken: string;
  user: User;
}

export interface SignupResponse {
  accessToken: string;
  user: User;
}
