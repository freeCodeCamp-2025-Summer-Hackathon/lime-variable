// export interface RegisterPayload {
//   name: string;
//   email: string;
//   password: string;
// }

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
