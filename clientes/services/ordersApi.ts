import axios from "axios";

const ORDERS_BASE_URL = "https://medisupply-backend.duckdns.org/venta";

export const ordersApi = axios.create({
  baseURL: ORDERS_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para logging de requests
ordersApi.interceptors.request.use((config) => {
  const url = new URL((config.baseURL ?? "") + (config.url ?? ""));
  const p = (config.params ?? {}) as Record<string, string>;
  Object.entries(p).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  console.log("📤 Orders API:", (config.method ?? "get").toUpperCase(), url.toString());
  
  // Log auth header si existe
  if (config.headers.Authorization) {
    console.log("🔐 Auth header presente");
  }
  
  return config;
});

// Interceptor para logging de errores
ordersApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(
      "❌ Orders API Error",
      JSON.stringify(
        {
          message: err?.message,
          code: err?.code,
          status: err?.response?.status,
          data: err?.response?.data,
        },
        null,
        2
      )
    );
    return Promise.reject(err);
  }
);
