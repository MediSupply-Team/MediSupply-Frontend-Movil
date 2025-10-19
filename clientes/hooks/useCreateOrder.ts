// src/hooks/useCreateOrder.ts
import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "../services/api";
// IMPORTANT: add this polyfill ONCE in your app (see step 4)
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type CreateOrderPayload = {
  // Ajusta estos campos al schema del backend (mira /docs en :3000)
  customer_id: string;
  shippingAddress?: string;
  items: {
    sku: string;
    name: string;
    unitPrice: number;
    qty: number;
  }[];
  totals?: {
    subtotal: number;
    shipping: number;
    total: number;
  };
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
      const res = await ordersApi.post("/orders", payload, {
        headers: { "Idempotency-Key": idempotencyKey },
      });
      return res.data;
    },
  });
}
