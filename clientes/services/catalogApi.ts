import axios from "axios";
import { getServiceUrl } from "../config/baseUrl";
import { getAPKHeaders, getAPKTimeout } from "../config/apkSimulation";
import { apkLogger } from "../utils/apkLogger";

// Inicializar logger al cargar el módulo
console.log('🚀 [CATALOG API] Initializing with APK Logger support');

export const catalogApi = axios.create({
  baseURL: getServiceUrl('catalog'), // Ya incluye el path correcto /api/v1/catalog
  timeout: getAPKTimeout(),
  headers: getAPKHeaders(),
});

catalogApi.interceptors.request.use((config) => {
  const url = new URL((config.baseURL ?? "") + (config.url ?? ""));
  const p = (config.params ?? {}) as Record<string, string>;
  Object.entries(p).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  
  const fullUrl = url.toString();
  console.log("📤 Catalog:", (config.method ?? "get").toUpperCase(), fullUrl);
  apkLogger.logNetworkAttempt(fullUrl, config.method?.toUpperCase());
  
  return config;
});

catalogApi.interceptors.response.use(
  (response) => {
    const url = `${response.config.baseURL}${response.config.url}`;
    console.log("✅ [CATALOG] Response SUCCESS:", response.status, response.config.url);
    apkLogger.logNetworkSuccess(url, response.status, response.data);
    
    if (response.data) {
      if (Array.isArray(response.data.items)) {
        console.log(`✅ [CATALOG] Got ${response.data.items.length} items`);
      } else {
        console.log("✅ [CATALOG] Response data:", JSON.stringify(response.data).substring(0, 200));
      }
    }
    return response;
  },
  (err) => {
    const url = `${err.config?.baseURL || ''}${err.config?.url || ''}`;
    console.log("❌ [CATALOG] Request FAILED");
    console.log("❌ [CATALOG] URL:", err.config?.url);
    console.log("❌ [CATALOG] Base URL:", err.config?.baseURL);
    console.log("❌ [CATALOG] Full URL:", url);
    
    apkLogger.logNetworkError(url, err);
    
    console.log(
      "❌ Catalog Error",
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