// services/api.ts
import axios from "axios";
import { apiHost } from "../config/baseUrl";

const BASE = apiHost();

export const rutaApi = axios.create({
  baseURL: `${BASE}:3002`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

rutaApi.interceptors.request.use((config) => {
  console.log(
    "📤 Ruta:",
    config.method?.toUpperCase(),
    `${config.baseURL ?? ""}${config.url ?? ""}`
  );
  return config;
});

rutaApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("❌ Ruta Error:", err?.response?.status, err?.response?.data ?? err.message);
    return Promise.reject(err);
  }
);

export const clienteApi = axios.create({
  baseURL: `${BASE}:3003`,
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
