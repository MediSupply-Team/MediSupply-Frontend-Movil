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
      console.log("🚀 [HOOK] Starting catalog request with params:", params);
      try {
        const response = await catalogApi.get("/items", { params });
        console.log("🎉 [HOOK] Catalog response received:", response.status);
        console.log("🎉 [HOOK] Response data keys:", Object.keys(response.data || {}));
        return response.data;
      } catch (error) {
        console.error("💥 [HOOK] Catalog request failed:", error);
        throw error;
      }
    },
    placeholderData: keepPreviousData, // Mantener datos previos mientras carga
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1, // Solo 1 reintento para evitar spam en problemas de red
    retryDelay: 2000, // Esperar 2 segundos entre reintentos
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
    retry: 1, // Solo 1 reintento
    retryDelay: 2000,
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
    retry: 1, // Solo 1 reintento
    retryDelay: 2000,
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