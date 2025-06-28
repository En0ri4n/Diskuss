export interface AuthResponse {
  user: {
    _id: string;
    username: string;
    email: string;
  }
  token: string;
}
