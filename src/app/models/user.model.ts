export interface User {
  userId?: number;
  fullName: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

