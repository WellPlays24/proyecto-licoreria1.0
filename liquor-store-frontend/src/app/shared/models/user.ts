// ============================================
// MODELO DE USUARIO
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'cliente';
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}