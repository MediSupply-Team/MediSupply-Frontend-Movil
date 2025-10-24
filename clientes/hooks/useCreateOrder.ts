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
      
      // Formatear payload según el esquema del BFF (con wrapper "body")
      const bffPayload = {
        body: {
          customer_id: payload.customer_id,
          items: payload.items.map(item => ({
            sku: item.sku,
            qty: item.qty
          }))
        }
      };
      
      console.log("🚀 [CREATE ORDER CLIENTES] Iniciando petición...");
      console.log("📦 [CREATE ORDER CLIENTES] Payload original:", JSON.stringify(payload, null, 2));
      console.log("📋 [CREATE ORDER CLIENTES] BFF Payload (con body wrapper):", JSON.stringify(bffPayload, null, 2));
      console.log("🔑 [CREATE ORDER CLIENTES] Idempotency Key:", idempotencyKey);
      console.log("🌐 [CREATE ORDER CLIENTES] URL base:", ordersApi.defaults.baseURL);
      console.log("🎯 [CREATE ORDER CLIENTES] URL completa:", `${ordersApi.defaults.baseURL}`);
      console.log("📋 [CREATE ORDER CLIENTES] Headers:", JSON.stringify({
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey
      }, null, 2));
      
      const res = await ordersApi.post("", bffPayload, {
        headers: { 
          "Idempotency-Key": idempotencyKey,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });
      
      console.log("✅ [CREATE ORDER CLIENTES] Respuesta exitosa:", res.status, res.statusText);
      console.log("📄 [CREATE ORDER CLIENTES] Data recibida:", JSON.stringify(res.data, null, 2));
      
      return res.data;
    },
  });
}
