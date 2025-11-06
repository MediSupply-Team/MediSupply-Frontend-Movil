// services/visitaService.ts
import axios from "axios";
import type { RegistrarVisitaRequest, VisitaResponse } from "../infrastructure/interfaces/visita";

export class VisitaService {
  /**
   * Registra una nueva visita usando multipart/form-data para archivos
   */
  static async registrarVisita(data: RegistrarVisitaRequest): Promise<VisitaResponse> {
    console.log("📦 [VisitaService] Datos que se enviarán al backend:");
    console.log(JSON.stringify(data, null, 2));
    
    try {
      // Crear FormData para multipart/form-data
      const formData = new FormData();
      
      // Agregar campos básicos
      formData.append('vendedor_id', data.vendedor_id.toString());
      formData.append('cliente_id', data.cliente_id.toString());
      formData.append('nombre_contacto', data.nombre_contacto);
      formData.append('observaciones', data.observaciones);
      formData.append('estado', data.estado);
      
      // Agregar fotos como archivos
      if (data.fotos && data.fotos.length > 0) {
        for (let i = 0; i < data.fotos.length; i++) {
          const fotoUri = data.fotos[i];
          const fileName = `foto_${Date.now()}_${i}.jpg`;
          
          // Crear objeto File para React Native
          const fileObject = {
            uri: fotoUri,
            type: 'image/jpeg',
            name: fileName,
          } as any;
          
          formData.append('fotos', fileObject);
        }
      }
      
      // Agregar videos como archivos
      if (data.videos && data.videos.length > 0) {
        for (let i = 0; i < data.videos.length; i++) {
          const videoUri = data.videos[i];
          const fileName = `video_${Date.now()}_${i}.mp4`;
          
          // Crear objeto File para React Native
          const fileObject = {
            uri: videoUri,
            type: 'video/mp4',
            name: fileName,
          } as any;
          
          formData.append('videos', fileObject);
        }
      }
      
      console.log("📦 [VisitaService] Enviando FormData con archivos...");
      
      // Enviar como multipart/form-data
      const response = await axios.post('https://medisupply-backend.duckdns.org/cliente/api/visitas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("✅ [VisitaService] Respuesta exitosa:", response.data);
      return response.data;
      
    } catch (error: any) {
      console.error("❌ [VisitaService] Error en la petición:", error);
      
      // Log más detallado del error
      if (error.response) {
        console.error("📡 Response status:", error.response.status);
        console.error("📡 Response data:", error.response.data);
        console.error("📡 Response headers:", error.response.headers);
      }
      
      throw error;
    }
  }

  /**
   * Convierte un archivo a base64 para envío (si fuera necesario)
   */
  static async convertFileToBase64(uri: string): Promise<string> {
    try {
      // En React Native, usaríamos expo-file-system para esto
      // Por ahora retornamos el URI tal como está
      return uri;
    } catch (error) {
      console.error('Error converting file to base64:', error);
      throw error;
    }
  }
}