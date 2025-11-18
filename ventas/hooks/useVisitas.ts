// hooks/useVisitas.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IniciarAnalisisResponse, RegistrarVisitaRequest, VideoAnalysis, VisitaListItem, VisitaResponse } from "../infrastructure/interfaces/visita";
import { VisitaService } from "../services/visitaService";

/**
 * Hook para obtener la lista de visitas
 */
export function useVisitas() {
  return useQuery<VisitaListItem[], Error>({
    queryKey: ['visitas'],
    queryFn: () => VisitaService.obtenerVisitas(),
  });
}

/**
 * Hook para registrar una nueva visita
 */
export function useRegistrarVisita() {
  return useMutation<VisitaResponse, Error, RegistrarVisitaRequest>({
    mutationFn: (data: RegistrarVisitaRequest) => VisitaService.registrarVisita(data),
    onSuccess: (data) => {
      console.log('✅ Visita registrada exitosamente:', data.id);
    },
    onError: (error) => {
      console.error('❌ Error registrando visita:', error);
    },
  });
}

/**
 * Hook para iniciar análisis de videos
 */
export function useIniciarAnalisisVideos() {
  const queryClient = useQueryClient();
  
  return useMutation<IniciarAnalisisResponse, Error, number>({
    mutationFn: (visitaId: number) => VisitaService.iniciarAnalisisVideos(visitaId),
    onSuccess: (data) => {
      console.log('✅ Análisis iniciado exitosamente:', data.analyses_iniciados);
      // Invalidar la query de análisis para que se actualice
      queryClient.invalidateQueries({ queryKey: ['video-analyses', data.visita_id] });
    },
    onError: (error) => {
      console.error('❌ Error iniciando análisis:', error);
    },
  });
}

/**
 * Hook para obtener análisis de videos
 */
export function useObtenerAnalisisVideos(visitaId: number, enabled: boolean = true) {
  return useQuery<VideoAnalysis[], Error>({
    queryKey: ['video-analyses', visitaId],
    queryFn: () => VisitaService.obtenerAnalisisVideos(visitaId),
    enabled,
  });
}