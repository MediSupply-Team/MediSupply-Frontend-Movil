// Tipos para autenticación

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  permissions: string[];
  cliente_id: string | null;
  venta_id: string | null;
  hospital_id?: string | null;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nit: string;
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  activo: boolean;
}

export interface ClientData {
  id: string;
  nit: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  activo: boolean;
  codigo_unico: string;
  rol: string;
  vendedor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegisterUserData {
  email: string;
  password: string;
  name: string;
  role_id: number;
  cliente_id: string;
}
