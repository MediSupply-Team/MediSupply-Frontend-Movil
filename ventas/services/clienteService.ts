// services/clienteService.ts
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
  static async listarClientes(params?: ParamsListarClientes): Promise<Cliente[]> {
    const response = await clienteApi.get('/api/cliente/', { params });
    return response.data;
  }

  /**
   * Busca clientes por query (requiere vendedor_id)
   */
  static async buscarClientes(params: ParamsBuscarCliente): Promise<Cliente[]> {
    const response = await clienteApi.get('/api/cliente/search', { params });
    
    // Asegurar que siempre devolvemos un array
    const data = response.data || [];
    return Array.isArray(data) ? data : [];
  }

  /**
   * Obtiene el detalle de un cliente específico
   */
  static async obtenerCliente(clienteId: string): Promise<Cliente> {
    const response = await clienteApi.get(`/api/cliente/${clienteId}`);
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