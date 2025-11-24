import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string | null;
    role: 'SELLER';
    permissions: string[];
    cliente_id: null;
    venta_id: string;
  };
}

// Cliente API para autenticación
export const authApi = axios.create({
  baseURL: 'https://medisupply-backend.duckdns.org/venta/auth',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para logging (desarrollo)
if (__DEV__) {
  authApi.interceptors.request.use((config) => {
    console.log(`[VENTAS AUTH] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });

  authApi.interceptors.response.use(
    (response) => {
      console.log(`[VENTAS AUTH] Success:`, response.status);
      return response;
    },
    (error) => {
      console.error('❌ [VENTAS AUTH] Error:', error.response?.status || error.message);
      return Promise.reject(error);
    }
  );
}

/**
 * Iniciar sesión
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await authApi.post<AuthResponse>('/login', credentials);
  return response.data;
}
