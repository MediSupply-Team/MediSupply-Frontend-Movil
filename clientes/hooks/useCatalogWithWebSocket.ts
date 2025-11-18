// hooks/useCatalogWithWebSocket.ts
import { useEffect, useMemo } from 'react';
import { useCatalogProducts, useSearchProducts, useProductsByCategory } from './useCatalog';
import { useCatalogWebSocket } from './useCatalogWebSocket';
import type { CategoriaId } from '@/types/catalog';

interface UseCatalogWithWebSocketOptions {
  searchQuery?: string;
  category?: CategoriaId | '';
  useWebSocket?: boolean;
}

/**
 * Hook híbrido que combina:
 * - Carga inicial con HTTP (React Query con cache)
 * - Actualizaciones en tiempo real con WebSocket
 */
export function useCatalogWithWebSocket(options: UseCatalogWithWebSocketOptions = {}) {
  const {
    searchQuery = '',
    category = '',
    useWebSocket = true // Habilitado por defecto
  } = options;

  // Hooks HTTP (React Query) - para carga inicial y cache
  const catalogQuery = useCatalogProducts();
  const searchQueryResult = useSearchProducts(searchQuery, !!searchQuery);
  const categoryQuery = useProductsByCategory(category as CategoriaId, !!category);

  // Hook WebSocket - para actualizaciones en tiempo real
  const {
    productos: wsProductos,
    metadata: wsMetadata,
    isConnected: wsConnected,
    refresh: wsRefresh
  } = useCatalogWebSocket({
    enabled: useWebSocket,
    searchQuery,
    category,
    size: 50
  });

  // Determinar qué query HTTP usar basado en los filtros
  const activeHttpQuery = useMemo(() => {
    if (searchQuery) return searchQueryResult;
    if (category) return categoryQuery;
    return catalogQuery;
  }, [searchQuery, category, searchQueryResult, categoryQuery, catalogQuery]);

  // Decidir qué datos mostrar:
  // 1. Si WebSocket está conectado y tiene datos, usar WebSocket
  // 2. Si no, usar datos HTTP (con cache de React Query)
  const shouldUseWebSocket = useWebSocket && wsConnected && wsProductos.length > 0;
  
  const data = shouldUseWebSocket 
    ? { items: wsProductos, meta: wsMetadata }
    : activeHttpQuery.data;

  const isLoading = !shouldUseWebSocket && activeHttpQuery.isLoading;
  const error = !shouldUseWebSocket ? activeHttpQuery.error : null;

  // Refrescar datos
  const refetch = () => {
    if (shouldUseWebSocket) {
      wsRefresh();
    } else {
      activeHttpQuery.refetch();
    }
  };

  // Log para debugging
  useEffect(() => {
    console.log('🔄 [CATALOG HYBRID] Estado:', {
      useWebSocket,
      wsConnected,
      wsProductosCount: wsProductos.length,
      httpProductosCount: activeHttpQuery.data?.items?.length || 0,
      usingWebSocket: shouldUseWebSocket,
      searchQuery,
      category
    });
  }, [useWebSocket, wsConnected, wsProductos.length, activeHttpQuery.data, shouldUseWebSocket, searchQuery, category]);

  return {
    data,
    isLoading,
    error,
    refetch,
    isConnected: wsConnected,
    isUsingWebSocket: shouldUseWebSocket
  };
}
