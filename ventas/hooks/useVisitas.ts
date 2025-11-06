// hooks/useVisitas.ts
import { useMutation } from "@tanstack/react-query";
import { VisitaService } from "../services/visitaService";
import type { RegistrarVisitaRequest, VisitaResponse } from "../infrastructure/interfaces/visita";

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