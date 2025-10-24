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
  
  console.log("📤 [ORDERS API] Sending request:");
  console.log("   Method:", (config.method ?? "get").toUpperCase());
  console.log("   URL:", url.toString());
  console.log("   BaseURL:", config.baseURL);
  console.log("   Endpoint:", config.url);
  console.log("   Headers:", JSON.stringify(config.headers, null, 2));
  console.log("   Data:", config.data ? JSON.stringify(config.data, null, 2) : 'No data');
  
  return config;
});

ordersApi.interceptors.response.use(
  (res) => {
    console.log("✅ [ORDERS API] Success response:");
    console.log("   Status:", res.status, res.statusText);
    console.log("   Data:", JSON.stringify(res.data, null, 2));
    return res;
  },
  (err) => {
    console.log("❌ [ORDERS API] Error response:");
    console.log("   Message:", err?.message);
    console.log("   Code:", err?.code);
    console.log("   Status:", err?.response?.status);
    console.log("   Status Text:", err?.response?.statusText);
    console.log("   URL:", err?.config?.url);
    console.log("   BaseURL:", err?.config?.baseURL);
    console.log("   Full URL:", (err?.config?.baseURL || '') + (err?.config?.url || ''));
    console.log("   Response Data:", JSON.stringify(err?.response?.data || 'No response data', null, 2));
    console.log("   Response Headers:", JSON.stringify(err?.response?.headers || 'No headers', null, 2));
    
    if (err?.response?.status === 404) {
      console.log("🔍 [404 ANALYSIS] Possible causes:");
      console.log("   • Endpoint path doesn't exist on the server");
      console.log("   • BFF routing configuration issue");
      console.log("   • CloudFront cache or configuration problem");
      console.log("   • Base URL construction error");
    }
    
    return Promise.reject(err);
  }
);
