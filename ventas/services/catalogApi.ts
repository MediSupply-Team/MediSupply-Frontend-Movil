import axios from 'axios';
import { getServiceUrl } from '@/config/baseUrl';

// Instancia específica para el catálogo de productos
export const catalogApi = axios.create({
  baseURL: getServiceUrl('catalog'),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instancia para órdenes/pedidos
export const ordersApi = axios.create({
  baseURL: getServiceUrl('orders'),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para logging detallado
catalogApi.interceptors.request.use(
  (config) => {
    console.log('🔄 [CATALOG API] Request:', config.method?.toUpperCase(), config.url);
    console.log('🔄 [CATALOG API] Base URL:', config.baseURL);
    console.log('🔄 [CATALOG API] Full URL:', `${config.baseURL}${config.url}`);
    if (config.data) {
      console.log('� [CATALOG API] Request data:', JSON.stringify(config.data, null, 2));
    }
    return config;
  },
  (error) => {
    console.error('🔄 [CATALOG API] Request Error:', error);
    return Promise.reject(error);
  }
);

catalogApi.interceptors.response.use(
  (response) => {
    console.log('✅ [CATALOG API] Response:', response.status, response.statusText, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ [CATALOG API] Response Error:', error.response?.status, error.config?.url);
    console.error('❌ [CATALOG API] Error details:', error.message);
    if (error.response?.data) {
      console.error('❌ [CATALOG API] Error data:', JSON.stringify(error.response.data, null, 2));
    }
    return Promise.reject(error);
  }
);

ordersApi.interceptors.request.use(
  (config) => {
    console.log('🔄 [ORDERS API] Request:', config.method?.toUpperCase(), config.url);
    console.log('🔄 [ORDERS API] Base URL:', config.baseURL);
    console.log('🔄 [ORDERS API] Full URL:', `${config.baseURL}${config.url}`);
    console.log('🔄 [ORDERS API] Headers:', JSON.stringify(config.headers, null, 2));
    if (config.data) {
      console.log('� [ORDERS API] Request data:', JSON.stringify(config.data, null, 2));
    }
    return config;
  },
  (error) => {
    console.error('🔄 [ORDERS API] Request Error:', error);
    return Promise.reject(error);
  }
);

ordersApi.interceptors.response.use(
  (response) => {
    console.log('✅ [ORDERS API] Response:', response.status, response.statusText, response.config.url);
    console.log('✅ [ORDERS API] Response data:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error('❌ [ORDERS API] Response Error:', error.response?.status, error.config?.url);
    console.error('❌ [ORDERS API] Error message:', error.message);
    console.error('❌ [ORDERS API] Error code:', error.code);
    if (error.response?.data) {
      console.error('❌ [ORDERS API] Error data:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.request) {
      console.error('❌ [ORDERS API] Request que falló:', error.request);
    }
    return Promise.reject(error);
  }
);