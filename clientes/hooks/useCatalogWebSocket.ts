// hooks/useCatalogWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { ProductoCatalogo } from '@/types/catalog';

const WS_URL = 'wss://medisupply-backend.duckdns.org/venta/api/v1/catalog/items/ws';

interface WebSocketMessage {
  items: ProductoCatalogo[];
  meta: {
    total: number;
    page: number;
    size: number;
    tookMs: number;
  };
}

interface UseCatalogWebSocketOptions {
  enabled?: boolean;
  searchQuery?: string;
  category?: string;
  page?: number;
  size?: number;
}

export function useCatalogWebSocket(options: UseCatalogWebSocketOptions = {}) {
  const {
    enabled = true,
    searchQuery = '',
    category = '',
    page = 1,
    size = 50
  } = options;

  const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, size: 50, tookMs: 0 });
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const sendMessage = useCallback((params: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = {
        q: searchQuery || null,
        category: category || null,
        page,
        size,
        ...params
      };
      
      wsRef.current.send(JSON.stringify(message));
    }
  }, [searchQuery, category, page, size]);

  const connect = useCallback(() => {
    if (!enabled) {
      return;
    }

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('✅ [WS] Stock en tiempo real conectado');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
        // Enviar parámetros iniciales
        sendMessage({});
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          if (data.items) {
            setProductos(data.items);
          }
          
          if (data.meta) {
            setMetadata(data.meta);
          }
        } catch (error) {
          console.error('❌ [WS] Error parseando datos:', error);
        }
      };

      ws.onerror = (error) => {
        // Solo loguear si no es el primer intento (error común al inicio)
        if (reconnectAttemptsRef.current > 0) {
          console.error('❌ [WS] Error en reconexión:', error);
        }
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        // Solo loguear si no es el primer intento o si es un cierre anormal
        if (reconnectAttemptsRef.current > 0 || event.code !== 1006) {
          console.log('🔌 [WS] Reconectando stock en tiempo real...');
        }
        setIsConnected(false);
        
        // Reconectar con backoff exponencial (silencioso)
        if (enabled && reconnectAttemptsRef.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, delay);
        }
      };

      wsRef.current = ws;
    } catch {
      // Error silencioso - solo loguear en desarrollo
      if (__DEV__) {
        console.log('⚠️ [WS] Error temporal de conexión');
      }
      setIsConnected(false);
    }
  }, [enabled, sendMessage]);

  // Conectar/desconectar según enabled
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [enabled, connect]);

  // Actualizar búsqueda/filtros cuando cambien
  useEffect(() => {
    if (isConnected) {
      sendMessage({});
    }
  }, [searchQuery, category, page, size, isConnected, sendMessage]);

  const refresh = useCallback(() => {
    if (isConnected) {
      sendMessage({});
    } else {
      connect();
    }
  }, [isConnected, sendMessage, connect]);

  return {
    productos,
    metadata,
    isConnected,
    refresh,
    sendMessage
  };
}
