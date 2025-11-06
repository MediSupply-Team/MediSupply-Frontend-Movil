import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../services/ordersApi";
import type { Order } from "../types/orders";

interface OrdersParams {
  limit?: number;
  offset?: number;
}

// Hook para obtener todas las órdenes
export function useOrders(params: OrdersParams = { limit: 100, offset: 0 }) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async (): Promise<Order[]> => {
      const response = await ordersApi.get("/api/v1/orders", { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

// Hook para obtener una orden específica por ID
export function useOrderById(orderId: string, enabled = true) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async (): Promise<Order | null> => {
      // Como el backend no tiene endpoint específico para una orden,
      // obtenemos todas y filtramos por ID
      const response = await ordersApi.get("/api/v1/orders", { 
        params: { limit: 100, offset: 0 } 
      });
      const orders: Order[] = response.data;
      return orders.find(order => order.id === orderId) || null;
    },
    enabled: enabled && !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
