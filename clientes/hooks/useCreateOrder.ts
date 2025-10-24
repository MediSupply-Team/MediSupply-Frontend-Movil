// src/hooks/useCreateOrder.ts
import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "../services/api";
// IMPORTANT: add this polyfill ONCE in your app (see step 4)
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type CreateOrderPayload = {
  customer_id: string;
  created_by_role: "cliente";
  source: "mobile-clientes";
  items: {
    sku: string;
    qty: number;
  }[];
};

export type CreateOrderResponse = {
  id: string;
  status: string;
  // ...lo que devuelva tu backend
};

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
      const idempotencyKey = uuidv4();
      
      // Formatear payload según el esquema del orders-service
      const formattedPayload = {
        customer_id: payload.customer_id,
        created_by_role: "cliente",
        source: "mobile-clientes",
        items: payload.items.map(item => ({
          sku: item.sku,
          qty: item.qty
        }))
      };
      
      const res = await ordersApi.post("/orders", formattedPayload, {
        headers: { "Idempotency-Key": idempotencyKey },
      });
      return res.data;
    },
  });
}
