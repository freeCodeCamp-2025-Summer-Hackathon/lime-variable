export interface RegisterResponse {
  data?: {
    id: string;
    name: string | null;
    email: string;
    access_token: string;
  };
  message?: string[] | string;
  error?: string;
  statusCode?: number;
}

export type UserType = 'parent' | 'child';
export interface LoginResponse {
  access_token?: string;
}
