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

export interface VisitaListItem {
  id: number;
  vendedor_id: number;
  cliente_id: number;
  nombre_contacto: string;
  observaciones: string;
  estado: 'exitosa' | 'pendiente' | 'cancelada';
  fecha_visita: string;
  created_at: string;
  cantidad_hallazgos: number;
  cantidad_videos: number;
}

export interface MediaFile {
  uri: string;
  type: 'image' | 'video';
  name: string;
  size?: number;
}

export interface VideoAnalysis {
  id: number;
  video_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  summary?: string;
  tags?: string[];
  recommendations?: string[];
  error_message?: string | null;
  created_at: string;
  completed_at?: string;
}

export interface IniciarAnalisisResponse {
  visita_id: number;
  total_videos: number;
  analyses_iniciados: number;
  analyses: {
    id: number;
    video_url: string;
    status: string;
    created_at: string;
  }[];
  message: string;
}