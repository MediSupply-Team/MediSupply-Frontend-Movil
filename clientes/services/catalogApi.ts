import axios from "axios";
import { apiHost } from "../config/baseUrl";

const BASE = apiHost();

export const catalogApi = axios.create({
  baseURL: `${BASE}:3001/api/catalog`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

catalogApi.interceptors.request.use((config) => {
  const url = new URL((config.baseURL ?? "") + (config.url ?? ""));
  const p = (config.params ?? {}) as Record<string, string>;
  Object.entries(p).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  console.log("📤 Catalog:", (config.method ?? "get").toUpperCase(), url.toString());
  return config;
});

catalogApi.interceptors.response.use(
  (res) => res,
  (err) => {
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