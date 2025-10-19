import { catalogApi } from "@/services/catalogApi";
import type {
    CatalogoParams,
    CatalogoResponse,
    InventarioResponse,
    ProductoCatalogo
} from "@/types/catalog";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Hook para listar productos del catálogo
export function useCatalogProducts(params: CatalogoParams = {}) {
  return useQuery({
    queryKey: ["catalog", "items", params],
    queryFn: async (): Promise<CatalogoResponse> => {
      const response = await catalogApi.get("/items", { params });
      return response.data;
    },
    placeholderData: keepPreviousData, // Mantener datos previos mientras carga
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para buscar productos por nombre
export function useSearchProducts(searchQuery: string, enabled = true) {
  return useQuery({
    queryKey: ["catalog", "search", searchQuery],
    queryFn: async (): Promise<CatalogoResponse> => {
      const response = await catalogApi.get("/items", { 
        params: { q: searchQuery } 
      });
      return response.data;
    },
    enabled: enabled && searchQuery.length > 2, // Solo buscar si hay más de 2 caracteres
    staleTime: 1000 * 30, // 30 segundos para búsquedas
  });
}

// Hook para obtener productos por categoría
export function useProductsByCategory(categoriaId: string, enabled = true) {
  return useQuery({
    queryKey: ["catalog", "category", categoriaId],
    queryFn: async (): Promise<CatalogoResponse> => {
      const response = await catalogApi.get("/items", { 
        params: { categoriaId } 
      });
      return response.data;
    },
    enabled: enabled && !!categoriaId,
    staleTime: 1000 * 60 * 10, // 10 minutos para categorías
  });
}

// Hook para obtener un producto específico
export function useProduct(productId: string, enabled = true) {
  return useQuery({
    queryKey: ["catalog", "product", productId],
    queryFn: async (): Promise<ProductoCatalogo> => {
      const response = await catalogApi.get(`/items/${productId}`);
      return response.data;
    },
    enabled: enabled && !!productId,
    staleTime: 1000 * 60 * 15, // 15 minutos para productos individuales
  });
}

// Hook para obtener inventario de un producto
export function useProductInventory(productId: string, enabled = true) {
  return useQuery({
    queryKey: ["catalog", "inventory", productId],
    queryFn: async (): Promise<InventarioResponse> => {
      const response = await catalogApi.get(`/items/${productId}/inventario`);
      return response.data;
    },
    enabled: enabled && !!productId,
    staleTime: 1000 * 60 * 2, // 2 minutos para inventario (más dinámico)
  });
}

// Hook para productos con paginación
export function useCatalogPaginated(page = 1, size = 10) {
  return useQuery({
    queryKey: ["catalog", "paginated", page, size],
    queryFn: async (): Promise<CatalogoResponse> => {
      const response = await catalogApi.get("/items", { 
        params: { page, size } 
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}