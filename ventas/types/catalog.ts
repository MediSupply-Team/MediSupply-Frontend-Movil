// Tipos para el catálogo de productos

export type CategoriaId = 'ANTIBIOTICS' | 'ANTISEPTICS' | 'MEDICAL_EQUIPMENT' | 'SUPPLIES';

export interface ProductoCatalogo {
  id: string;
  codigo: string;
  nombre: string;
  precioUnitario: number;
  categoria: CategoriaId;
  inventarioResumen?: {
    cantidadTotal: number;
    cantidadDisponible: number;
  };
}

export interface CatalogoResponse {
  items: ProductoCatalogo[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CatalogoParams {
  q?: string;
  categoriaId?: CategoriaId;
  page?: number;
  limit?: number;
}

export interface InventarioResponse {
  cantidadTotal: number;
  cantidadDisponible: number;
  cantidadReservada: number;
  ubicaciones: {
    almacen: string;
    cantidad: number;
  }[];
}

// Mapeo de categorías para la UI
export const CATEGORIAS: Record<CategoriaId, string> = {
  ANTIBIOTICS: 'Antibióticos',
  ANTISEPTICS: 'Antisépticos',
  MEDICAL_EQUIPMENT: 'Equipos Médicos',
  SUPPLIES: 'Suministros',
};