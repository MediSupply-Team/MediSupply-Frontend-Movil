import { useEffect, useRef, useState, useCallback } from 'react';
import type { ProductoCatalogo, CatalogoResponse } from '@/types/catalog';

interface WebSocketMessage {
  type: 'catalog_update' | 'product_update' | 'error';
  data?: CatalogoResponse;
  product?: ProductoCatalogo;
  error?: string;
}

interface UseCatalogWebSocketParams {
  searchQuery?: string;
  category?: string;
  enabled?: boolean;
}

interface UseCatalogWebSocketResult {
  productos: ProductoCatalogo[];
  pagination?: CatalogoResponse['pagination'];
  isConnected: boolean;
  error: Error | null;
  refresh: () => void;
}

const WS_URL = 'wss://medisupply-backend.duckdns.org/venta/api/v1/catalog/items/ws';
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

export function useCatalogWebSocket({
  searchQuery = '',
  category = '',
  enabled = true,
}: UseCatalogWebSocketParams = {}): UseCatalogWebSocketResult {
  const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
  const [pagination, setPagination] = useState<CatalogoResponse['pagination']>();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastParamsRef = useRef({ searchQuery, category });

  // Función para construir la URL del WebSocket con parámetros
  const buildWebSocketUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    return queryString ? `${WS_URL}?${queryString}` : WS_URL;
  }, [searchQuery, category]);

  // Función para conectar al WebSocket
  const connect = useCallback(() => {
    if (!enabled) return;

    try {
      const url = buildWebSocketUrl();
      
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('✅ [WS] Stock en tiempo real conectado');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case 'catalog_update':
              if (message.data) {
                setProductos(message.data.items);
                setPagination(message.data.pagination);
              }
              break;

            case 'product_update':
              if (message.product) {
                setProductos((prev) =>
                  prev.map((p) =>
                    p.id === message.product!.id ? message.product! : p
                  )
                );
              }
              break;

            case 'error':
              console.error('❌ [WebSocket] Error del servidor:', message.error);
              setError(new Error(message.error || 'Error desconocido'));
              break;
          }
        } catch (err) {
          console.error('❌ [WebSocket] Error al procesar mensaje:', err);
          setError(err as Error);
        }
      };

      wsRef.current.onerror = (event) => {
        // Solo loguear si no es el primer intento (error común al inicio)
        if (reconnectAttemptsRef.current > 0) {
          console.error('❌ [WebSocket] Error en reconexión:', event);
          setError(new Error('Error de conexión WebSocket'));
        }
      };

      wsRef.current.onclose = (event) => {
        // Solo loguear si no es el primer intento o si es un cierre anormal
        if (reconnectAttemptsRef.current > 0 || event.code !== 1006) {
          console.log('🔌 [WS] Reconectando stock en tiempo real...');
        }
        setIsConnected(false);

        // Intentar reconectar si no fue un cierre limpio (silencioso)
        if (event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(
            INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current),
            MAX_RECONNECT_DELAY
          );
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        }
      };
    } catch (err) {
      console.error('❌ [WebSocket] Error al crear conexión:', err);
      setError(err as Error);
    }
  }, [enabled, buildWebSocketUrl]);

  // Función para refrescar la conexión (reconectar con nuevos parámetros)
  const refresh = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Refresh requested');
    }
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  // Efecto para gestionar la conexión
  useEffect(() => {
    if (!enabled) return;

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, [enabled, connect]);

  // Efecto para manejar cambios en los parámetros de búsqueda
  useEffect(() => {
    if (!enabled || !isConnected) return;

    const paramsChanged =
      lastParamsRef.current.searchQuery !== searchQuery ||
      lastParamsRef.current.category !== category;

    if (paramsChanged) {
      lastParamsRef.current = { searchQuery, category };
      refresh();
    }
  }, [searchQuery, category, isConnected, enabled, refresh]);

  return {
    productos,
    pagination,
    isConnected,
    error,
    refresh,
  };
}
