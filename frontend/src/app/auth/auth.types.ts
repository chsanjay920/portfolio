export interface AuthUser {
  id: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

