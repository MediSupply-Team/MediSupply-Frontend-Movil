// src/services/api.ts
import axios from "axios";
import { getServiceUrl, logEnvironmentInfo } from "../config/baseUrl";

// Log de configuración al inicializar
logEnvironmentInfo();

export const ordersApi = axios.create({
  baseURL: getServiceUrl('orders'),
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

ordersApi.interceptors.request.use((config) => {
  const url = new URL((config.baseURL ?? "") + (config.url ?? ""));
  const p = (config.params ?? {}) as Record<string, string>;
  Object.entries(p).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  console.log("📤 Orders:", (config.method ?? "get").toUpperCase(), url.toString());
  return config;
});

ordersApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(
      "❌ Orders Error",
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
