// src/hooks/useCreateOrder.ts
import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "../services/catalogApi";

export type CreateOrderPayload = {
  customer_id: string;
  created_by_role: "vendedor";
  source: "mobile-ventas";
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
      try {
        // Generar un ID simple para idempotencia
        const idempotencyKey = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
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
        
        console.log("🚀 [CREATE ORDER] Iniciando petición...");
        console.log("📦 [CREATE ORDER] Payload original:", JSON.stringify(payload, null, 2));
        console.log("📋 [CREATE ORDER] BFF Payload (con body wrapper):", JSON.stringify(bffPayload, null, 2));
        console.log("🔑 [CREATE ORDER] Idempotency Key:", idempotencyKey);
        console.log("🌐 [CREATE ORDER] URL base:", ordersApi.defaults.baseURL);
        
        const res = await ordersApi.post("", bffPayload, {
          headers: { "Idempotency-Key": idempotencyKey },
        });
        
        console.log("✅ [CREATE ORDER] Respuesta exitosa:", res.status, res.statusText);
        console.log("📄 [CREATE ORDER] Data recibida:", JSON.stringify(res.data, null, 2));
        
        return res.data;
      } catch (error: any) {
        console.error("❌ [CREATE ORDER] Error capturado:", error);
        console.error("❌ [CREATE ORDER] Error message:", error.message);
        console.error("❌ [CREATE ORDER] Error code:", error.code);
        console.error("❌ [CREATE ORDER] Error config:", error.config);
        
        if (error.response) {
          // El servidor respondió con un código de error
          console.error("📡 [CREATE ORDER] Response error status:", error.response.status);
          console.error("📡 [CREATE ORDER] Response error data:", JSON.stringify(error.response.data, null, 2));
          console.error("📡 [CREATE ORDER] Response headers:", error.response.headers);
        } else if (error.request) {
          // La petición se hizo pero no se recibió respuesta
          console.error("📡 [CREATE ORDER] No response received:");
          console.error("📡 [CREATE ORDER] Request config:", error.request);
        } else {
          // Error en la configuración de la petición
          console.error("⚙️ [CREATE ORDER] Request setup error:", error.message);
        }
        
        throw error;
      }
    },
  });
}