// services/api.ts
import axios from "axios";
import { getServiceUrl, logEnvironmentInfo } from "../config/baseUrl";

// Log de configuración al inicializar
logEnvironmentInfo();

export const rutaApi = axios.create({
  baseURL: getServiceUrl('rutas'),
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

rutaApi.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;
  console.log("📤 [RUTAS API] Sending request:");
  console.log("   Method:", config.method?.toUpperCase());
  console.log("   BaseURL:", config.baseURL);
  console.log("   Endpoint:", config.url);
  console.log("   Full URL:", fullUrl);
  console.log("   Expected URL: https://d3f7r5jd3xated.cloudfront.net/api/v1/rutas/visita/YYYY-MM-DD");
  return config;
});

rutaApi.interceptors.response.use(
  (res) => {
    console.log("✅ [RUTAS API] Success response:");
    console.log("   Status:", res.status, res.statusText);
    console.log("   Data sample:", JSON.stringify(res.data).substring(0, 200) + "...");
    return res;
  },
  (err) => {
    console.log("❌ [RUTAS API] Error response:");
    console.log("   Status:", err?.response?.status);
    console.log("   Status Text:", err?.response?.statusText);
    console.log("   URL:", err?.config?.url);
    console.log("   BaseURL:", err?.config?.baseURL);
    console.log("   Full URL:", (err?.config?.baseURL || '') + (err?.config?.url || ''));
    console.log("   Error Data:", JSON.stringify(err?.response?.data || err.message));
    
    if (err?.response?.status === 404) {
      console.log("🔍 [404 ANALYSIS] The endpoint doesn't exist.");
      console.log("   Check if the URL construction is correct.");
      console.log("   Expected format: /api/v1/rutas/visita/YYYY-MM-DD");
    }
    
    return Promise.reject(err);
  }
);

export const clienteApi = axios.create({
  baseURL: getServiceUrl('cliente'),
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

clienteApi.interceptors.request.use((config) => {
  console.log(
    "📤 Cliente:",
    config.method?.toUpperCase(),
    `${config.baseURL ?? ""}${config.url ?? ""}`
  );
  return config;
});

clienteApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("❌ Cliente Error:", err?.response?.status, err?.response?.data ?? err.message);
    return Promise.reject(err);
  }
);
