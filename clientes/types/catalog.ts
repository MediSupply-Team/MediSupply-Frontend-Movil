// Tipos para el catálogo de productos según la API del backend

export interface InventarioResumen {
  cantidadTotal: number;
  paises: string[];
}

export interface ProductoCatalogo {
  id: string;
  nombre: string;
  codigo: string;
  categoria: string;
  presentacion: string;
  precioUnitario: number;
  requisitosAlmacenamiento: string;
  inventarioResumen: InventarioResumen | null;
}

export interface CatalogoResponse {
  items: ProductoCatalogo[];
  meta: {
    page: number;
    size: number;
    total: number;
    tookMs: number;
  };
}

export interface CatalogoParams {
  q?: string; // Búsqueda por nombre
  categoriaId?: string; // Filtro por categoría
  page?: number; // Página (default: 1)
  size?: number; // Tamaño de página (default: 20)
}

export interface InventarioDetalle {
  pais: string;
  bodegaId: string;
  lote: string;
  cantidad: number;
  vence: string;
  condiciones: string;
}

export interface InventarioResponse {
  items: InventarioDetalle[];
  meta: {
    page: number;
    size: number;
    total: number;
    tookMs: number;
  };
}

// Mapeo de categorías para el frontend
export const CATEGORIAS = {
  ANTIBIOTICS: "Antibióticos",
  ANALGESICS: "Analgésicos", 
  CARDIOVASCULAR: "Cardiovascular",
  RESPIRATORY: "Respiratorio",
  GASTROINTESTINAL: "Gastrointestinal"
} as const;

export type CategoriaId = keyof typeof CATEGORIAS;