// hooks/useClientes.ts
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type {
    Cliente,
    HistoricoCliente,
    MetricasServicio,
    ParamsBuscarCliente,
    ParamsHistoricoCliente,
    ParamsListarClientes
} from "../infrastructure/interfaces/cliente";
import { ClienteService } from "../services/clienteService";

/**
 * Hook para obtener la lista de clientes con paginación
 */
export function useClientes(params?: ParamsListarClientes, enabled = true) {
  return useQuery<Cliente[]>({
    queryKey: ["clientes", params],
    queryFn: ({ signal }) => {
      const abortPromise = ClienteService.listarClientes(params);
      
      // Configurar abortController si está disponible
      if (signal) {
        signal.addEventListener('abort', () => {
          // Axios ya maneja la cancelación automáticamente
        });
      }
      
      return abortPromise;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (count, err: any) => {
      const status = err?.response?.status;
      return count < 2 && status >= 500; // 2 reintentos sólo si es 5xx
    },
  });
}

/**
 * Hook para búsqueda de clientes
 */
export function useBuscarClientes(params: ParamsBuscarCliente, enabled = true) {
  return useQuery<Cliente[]>({
    queryKey: ["buscar-clientes", params.q, params.vendedor_id],
    queryFn: ({ signal }) => ClienteService.buscarClientes(params),
    enabled: enabled && !!params.q && !!params.vendedor_id,
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
    retry: (count, err: any) => {
      const status = err?.response?.status;
      return count < 1 && status >= 500; // 1 reintento sólo si es 5xx
    },
  });
}

/**
 * Hook para obtener el detalle de un cliente específico
 */
export function useCliente(clienteId: string, enabled = true) {
  return useQuery<Cliente>({
    queryKey: ["cliente", clienteId],
    queryFn: ({ signal }) => ClienteService.obtenerCliente(clienteId),
    enabled: enabled && !!clienteId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: (count, err: any) => {
      const status = err?.response?.status;
      return count < 2 && status >= 500;
    },
  });
}

/**
 * Hook para obtener el histórico completo de un cliente
 */
export function useHistoricoCliente(
  clienteId: string, 
  params: ParamsHistoricoCliente, 
  enabled = true
) {
  return useQuery<HistoricoCliente>({
    queryKey: ["historico-cliente", clienteId, params.vendedor_id],
    queryFn: ({ signal }) => ClienteService.obtenerHistoricoCliente(clienteId, params),
    enabled: enabled && !!clienteId && !!params.vendedor_id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (count, err: any) => {
      const status = err?.response?.status;
      return count < 2 && status >= 500;
    },
  });
}

/**
 * Hook para obtener métricas del servicio
 */
export function useMetricasCliente(enabled = true) {
  return useQuery<MetricasServicio>({
    queryKey: ["metricas-cliente"],
    queryFn: ({ signal }) => ClienteService.obtenerMetricas(),
    enabled,
    staleTime: 30 * 1000, // 30 segundos para métricas
    refetchInterval: 60 * 1000, // Refrescar cada minuto
    retry: (count, err: any) => {
      const status = err?.response?.status;
      return count < 1 && status >= 500;
    },
  });
}

/**
 * Hook para paginación infinita de clientes
 */
export function useClientesInfinite(baseParams?: Omit<ParamsListarClientes, 'offset'>) {
  const limite = baseParams?.limite || 10;
  
  return useInfiniteQuery<Cliente[]>({
    queryKey: ["clientes-infinite", baseParams],
    queryFn: ({ pageParam = 0, signal }) => {
      const params: ParamsListarClientes = {
        ...baseParams,
        limite,
        offset: pageParam as number,
      };
      return ClienteService.listarClientes(params);
    },
    getNextPageParam: (lastPage, allPages) => {
      // Si la última página tiene menos elementos que el límite, no hay más páginas
      if (lastPage.length < limite) {
        return undefined;
      }
      // El offset para la siguiente página
      return allPages.length * limite;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    retry: (count, err: any) => {
      const status = err?.response?.status;
      return count < 2 && status >= 500;
    },
  });
}