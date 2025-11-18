import { useCatalogProducts, useSearchProducts, useProductsByCategory } from './useCatalog';
import { useCatalogWebSocket } from './useCatalogWebSocket';
import type { CategoriaId } from '@/types/catalog';

interface UseCatalogWithWebSocketParams {
  searchQuery?: string;
  category?: CategoriaId | '';
  useWebSocket?: boolean;
}

/**
 * Hook híbrido que combina React Query (HTTP) con WebSocket
 * 
 * - Usa React Query para la carga inicial y como caché
 * - Usa WebSocket para actualizaciones en tiempo real cuando está conectado
 * - Fallback automático a HTTP si WebSocket no está disponible
 */
export function useCatalogWithWebSocket({
  searchQuery = '',
  category = '',
  useWebSocket: enableWebSocket = true, // Habilitado por defecto
}: UseCatalogWithWebSocketParams = {}) {
  // Hooks de React Query (siempre se ejecutan para caché)
  const catalogQuery = useCatalogProducts();
  const searchQuery_result = useSearchProducts(searchQuery, !!searchQuery);
  const categoryQuery = useProductsByCategory(category || 'ANTIBIOTICS', !!category);

  // Determinamos qué query HTTP usar
  const activeHttpQuery = searchQuery 
    ? searchQuery_result 
    : category 
    ? categoryQuery 
    : catalogQuery;

  // WebSocket hook
  const {
    productos: wsProductos,
    pagination: wsPagination,
    isConnected: wsConnected,
    error: wsError,
    refresh: wsRefresh,
  } = useCatalogWebSocket({
    searchQuery,
    category: category || undefined,
    enabled: enableWebSocket,
  });

  // Decidir qué datos usar
  // Usamos WebSocket si está habilitado, conectado y tiene datos
  // De lo contrario, usamos datos HTTP
  const shouldUseWebSocket = enableWebSocket && wsConnected && wsProductos.length > 0;

  const data = shouldUseWebSocket
    ? { items: wsProductos, pagination: wsPagination }
    : activeHttpQuery.data;

  const isLoading = shouldUseWebSocket
    ? !wsConnected && wsProductos.length === 0
    : activeHttpQuery.isLoading;

  const error = shouldUseWebSocket
    ? wsError
    : activeHttpQuery.error as Error | null;

  const refetch = shouldUseWebSocket
    ? wsRefresh
    : activeHttpQuery.refetch;

  return {
    data,
    isLoading,
    error,
    refetch,
    isConnected: wsConnected,
    isUsingWebSocket: shouldUseWebSocket,
  };
}
