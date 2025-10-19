// hooks/useRutas.ts
import { useQuery } from "@tanstack/react-query";
import { rutaApi } from "../services/api";

export type Visita = {
  id: number;
  vendedor_id: number;
  cliente: string;
  direccion: string;
  fecha: string;
  hora: string;
  lat: number;
  lng: number;
  tiempo_desde_anterior: string | null;
};

export type RutaResponse = { fecha: string; visitas: Visita[] };

export function useRutas(fecha: string, vendedorId: number, enabled = true) {
  return useQuery<RutaResponse>({
    queryKey: ["rutas", fecha, vendedorId],
    queryFn: ({ signal }) =>
      rutaApi
        .get("/api/ruta", { params: { fecha, vendedor_id: vendedorId }, signal })
        .then((r) => r.data),
    enabled: enabled && !!fecha && !!vendedorId,
    staleTime: 5 * 60 * 1000,
    retry: (count, err: any) => {
      const status = err?.response?.status;
      return count < 1 && status >= 500; // 1 reintento sólo si es 5xx
    },
  });
}
