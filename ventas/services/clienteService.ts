// services/clienteService.ts
import { getCurrentEnvironment } from '../config/baseUrl';
import type {
  Cliente,
  HealthStatus,
  HistoricoCliente,
  MetricasServicio,
  ParamsBuscarCliente,
  ParamsHistoricoCliente,
  ParamsListarClientes
} from '../infrastructure/interfaces/cliente';
import { clienteApi } from './api';

// Función helper para obtener el path correcto según el ambiente
function getClientePath(endpoint: string = ''): string {
  const environment = getCurrentEnvironment();
  
  if (environment === 'local') {
    // En local, usamos el path de Docker Compose
    return `/api/cliente${endpoint}`;
  } else {
    // En AWS/Production, usamos el path del BFF
    return `${endpoint}`;
  }
}

export class ClienteService {
  /**
   * Health check del servicio de clientes
   */
  static async healthCheck(): Promise<HealthStatus> {
    const response = await clienteApi.get('/api/cliente/health');
    return response.data;
  }

  /**
   * Obtiene la lista de todos los clientes con filtros opcionales
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await clienteApi.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene la lista de todos los clientes con filtros opcionales
   */
  static async listarClientes(params?: ParamsListarClientes): Promise<Cliente[]> {
    const response = await clienteApi.get(getClientePath('/'), { params });
    return response.data;
  }

  /**
   * Busca clientes por query (requiere vendedor_id)
   */
  static async buscarClientes(params: ParamsBuscarCliente): Promise<Cliente[]> {
    const response = await clienteApi.get(getClientePath('/search'), { params });
    
    // Asegurar que siempre devolvemos un array
    const data = response.data || [];
    return Array.isArray(data) ? data : [];
  }

  /**
   * Obtiene el detalle de un cliente específico
   */
  static async obtenerCliente(clienteId: string): Promise<Cliente> {
    const response = await clienteApi.get(getClientePath(`/${clienteId}`));
    return response.data;
  }

  /**
   * Obtiene el histórico completo de un cliente (requiere vendedor_id)
   */
  static async obtenerHistoricoCliente(
    clienteId: string, 
    params: ParamsHistoricoCliente
  ): Promise<HistoricoCliente> {
    const response = await clienteApi.get(`/api/cliente/${clienteId}/historico`, { params });
    return response.data;
  }

  /**
   * Obtiene métricas del servicio de clientes
   */
  static async obtenerMetricas(): Promise<MetricasServicio> {
    const response = await clienteApi.get('/api/cliente/metrics');
    return response.data;
  }
}