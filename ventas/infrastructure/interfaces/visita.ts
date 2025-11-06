// infrastructure/interfaces/visita.ts
export interface RegistrarVisitaRequest {
  vendedor_id: number;
  cliente_id: number;
  nombre_contacto: string;
  observaciones: string;
  estado: 'exitosa' | 'pendiente' | 'cancelada';
  fotos: string[]; // Base64 encoded images o URLs
  videos: string[]; // Base64 encoded videos o URLs
}

export interface VisitaResponse {
  id: number;
  vendedor_id: number;
  cliente_id: number;
  nombre_contacto: string;
  observaciones: string;
  estado: 'exitosa' | 'pendiente' | 'cancelada';
  fecha_creacion: string;
  fotos: string[];
  videos: string[];
}

export interface MediaFile {
  uri: string;
  type: 'image' | 'video';
  name: string;
  size?: number;
}