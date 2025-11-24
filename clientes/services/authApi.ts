import axios from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ClientData,
  RegisterUserData,
} from '@/types/auth';

// Cliente API para autenticación (backend de venta)
export const authApi = axios.create({
  baseURL: 'https://medisupply-backend.duckdns.org/venta',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente API para gestión de clientes
export const clienteApi = axios.create({
  baseURL: 'https://medisupply-backend.duckdns.org/cliente',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para logging (desarrollo)
if (__DEV__) {
  authApi.interceptors.request.use((config) => {
    console.log(`[AUTH API] ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('[AUTH API] Request Body:', JSON.stringify(config.data, null, 2));
    }
    return config;
  });

  authApi.interceptors.response.use(
    (response) => {
      console.log(`[AUTH API] Response:`, response.status);
      console.log('[AUTH API] Response Data:', JSON.stringify(response.data, null, 2));
      return response;
    },
    (error) => {
      console.error('❌ [AUTH API] Error details:');
      console.error('  - Message:', error.message);
      console.error('  - Code:', error.code);
      console.error('  - Status:', error.response?.status);
      console.error('  - Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('  - URL:', error.config?.url);
      console.error('  - BaseURL:', error.config?.baseURL);
      
      if (error.message === 'Network Error') {
        console.error('⚠️ [AUTH API] Network Error detectado - Posibles causas:');
        console.error('  1. El backend no está accesible');
        console.error('  2. Problema de CORS');
        console.error('  3. URL incorrecta:', `${error.config?.baseURL}${error.config?.url}`);
        console.error('  4. Timeout de conexión');
      }
      
      return Promise.reject(error);
    }
  );

  clienteApi.interceptors.request.use((config) => {
    console.log(`[CLIENTE API] ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('[CLIENTE API] Request Body:', JSON.stringify(config.data, null, 2));
    }
    return config;
  });

  clienteApi.interceptors.response.use(
    (response) => {
      console.log(`[CLIENTE API] Response:`, response.status);
      console.log('[CLIENTE API] Response Data:', JSON.stringify(response.data, null, 2));
      return response;
    },
    (error) => {
      console.error(`[CLIENTE API] Error:`, JSON.stringify(error.response?.data || error.message, null, 2));
      return Promise.reject(error);
    }
  );
}

/**
 * Inicia sesión con email y contraseña
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

/**
 * Registra un nuevo cliente en la plataforma (paso 1)
 */
export const registerClient = async (data: RegisterData): Promise<ClientData> => {
  console.log('🚀 [REGISTER CLIENT] Iniciando creación de cliente...');
  console.log('📋 [REGISTER CLIENT] Datos a enviar:', JSON.stringify(data, null, 2));
  console.log('🔍 [REGISTER CLIENT] Validación de campos:');
  console.log('  - NIT:', data.nit);
  console.log('  - Nombre:', data.nombre);
  console.log('  - Email:', data.email);
  console.log('  - Password:', data.password ? '***' : 'VACÍO');
  console.log('  - Teléfono:', data.telefono);
  console.log('  - Dirección:', data.direccion);
  console.log('  - Ciudad:', data.ciudad);
  console.log('  - País:', data.pais);
  console.log('  - Activo:', data.activo);
  
  const response = await clienteApi.post<ClientData>('/api/v1/client/', data);
  
  console.log('✅ [REGISTER CLIENT] Cliente creado exitosamente');
  console.log('📄 [REGISTER CLIENT] Response:', JSON.stringify(response.data, null, 2));
  
  return response.data;
};

/**
 * Registra el usuario asociado al cliente (paso 2)
 */
export const registerUser = async (data: RegisterUserData): Promise<AuthResponse> => {
  console.log('🚀 [REGISTER USER] Iniciando registro de usuario en auth...');
  console.log('📋 [REGISTER USER] Datos a enviar:', JSON.stringify(data, null, 2));
  console.log('🔍 [REGISTER USER] Validación de campos:');
  console.log('  - Email:', data.email);
  console.log('  - Password:', data.password ? '***' : 'VACÍO');
  console.log('  - Name:', data.name);
  console.log('  - Role ID:', data.role_id);
  console.log('  - Cliente ID:', data.cliente_id);
  console.log('🌐 [REGISTER USER] URL completa:', `${authApi.defaults.baseURL}/auth/register`);
  
  try {
    const response = await authApi.post<AuthResponse>('/auth/register', data);
    
    console.log('✅ [REGISTER USER] Usuario registrado exitosamente');
    console.log('📄 [REGISTER USER] Response:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error: any) {
    console.error('❌ [REGISTER USER] Error al registrar usuario');
    console.error('❌ [REGISTER USER] Error type:', error.constructor.name);
    console.error('❌ [REGISTER USER] Error message:', error.message);
    console.error('❌ [REGISTER USER] Error code:', error.code);
    console.error('❌ [REGISTER USER] Response status:', error.response?.status);
    console.error('❌ [REGISTER USER] Response data:', JSON.stringify(error.response?.data, null, 2));
    console.error('❌ [REGISTER USER] Request config:', JSON.stringify({
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      headers: error.config?.headers,
    }, null, 2));
    throw error;
  }
};

/**
 * Proceso completo de registro: crea cliente y luego usuario
 */
export const registerComplete = async (
  registerData: RegisterData
): Promise<AuthResponse> => {
  // Paso 1: Crear el cliente
  const clientData = await registerClient(registerData);

  console.log('🔄 [REGISTER COMPLETE] Cliente creado, procediendo a registrar usuario...');
  console.log('🔄 [REGISTER COMPLETE] Cliente ID obtenido:', clientData.id);

  // Paso 2: Registrar el usuario asociado
  const userData: RegisterUserData = {
    email: registerData.email,
    password: registerData.password,
    name: registerData.nombre,
    role_id: 6, // Role ID para CUSTOMER
    cliente_id: clientData.id,
  };

  console.log('🔄 [REGISTER COMPLETE] Llamando a registerUser con datos:', {
    email: userData.email,
    name: userData.name,
    role_id: userData.role_id,
    cliente_id: userData.cliente_id,
    password: '***'
  });

  try {
    const authResponse = await registerUser(userData);
    console.log('✅ [REGISTER COMPLETE] Proceso completo exitoso');
    return authResponse;
  } catch (error: any) {
    console.error('❌ [REGISTER COMPLETE] Error en paso 2 (registro de usuario)');
    console.error('❌ [REGISTER COMPLETE] Cliente fue creado con ID:', clientData.id);
    console.error('❌ [REGISTER COMPLETE] Pero falló el registro del usuario en auth');
    throw error;
  }
};

/**
 * Actualiza el token de autorización en los interceptores
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    clienteApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete authApi.defaults.headers.common['Authorization'];
    delete clienteApi.defaults.headers.common['Authorization'];
  }
};

/**
 * Diagnóstico de conectividad con los endpoints
 */
export const testEndpointsConnectivity = async () => {
  console.log('🔍 [DIAGNOSTICS] Probando conectividad...');
  
  // Test authApi
  console.log('🔍 [DIAGNOSTICS] Auth API BaseURL:', authApi.defaults.baseURL);
  console.log('🔍 [DIAGNOSTICS] Auth API Timeout:', authApi.defaults.timeout);
  
  // Test clienteApi
  console.log('🔍 [DIAGNOSTICS] Cliente API BaseURL:', clienteApi.defaults.baseURL);
  console.log('🔍 [DIAGNOSTICS] Cliente API Timeout:', clienteApi.defaults.timeout);
  
  try {
    console.log('🔍 [DIAGNOSTICS] Intentando ping a auth API...');
    // Puedes descomentar esto si hay un endpoint de health check
    // await authApi.get('/health');
    console.log('✅ [DIAGNOSTICS] Auth API accesible');
  } catch (error: any) {
    console.error('❌ [DIAGNOSTICS] Auth API no accesible:', error.message);
  }
};
