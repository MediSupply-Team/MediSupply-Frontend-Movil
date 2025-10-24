import { useCartStore } from '@/store/cartStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCatalogProducts, useProductsByCategory, useSearchProducts } from '@/hooks/useCatalog';
import { CATEGORIAS, type CategoriaId, type ProductoCatalogo } from '@/types/catalog';
import { testCatalogDirectly } from '@/utils/testCatalog';
import { APKDebugger } from '@/components/APKDebugger';

export default function CatalogoScreen() {
  const { addItem } = useCartStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoriaId | ''>('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Test directo del catálogo al abrir la pantalla
  useEffect(() => {
    console.log('🔧 [SCREEN] CatalogoScreen mounted, testing direct catalog...');
    testCatalogDirectly().then(() => {
      console.log('🎉 [SCREEN] Direct catalog test completed successfully');
    }).catch((error) => {
      console.error('💥 [SCREEN] Direct catalog test failed:', error);
    });
  }, []);

  // Hooks del catálogo (todos se ejecutan siempre)
  const catalogQuery = useCatalogProducts();
  const searchQuery_result = useSearchProducts(searchQuery, !!searchQuery);
  const categoryQuery = useProductsByCategory(selectedCategory || 'ANTIBIOTICS', !!selectedCategory);

  // Determinamos qué datos usar basado en el estado actual
  const activeQuery = useMemo(() => {
    if (searchQuery) return searchQuery_result;
    if (selectedCategory) return categoryQuery;
    return catalogQuery;
  }, [searchQuery, selectedCategory, searchQuery_result, categoryQuery, catalogQuery]);

  const { data: catalogData, isLoading, error } = activeQuery;
  const productos = catalogData?.items || [];

  // Helper para obtener cantidad de un producto específico
  const getProductQuantity = (codigo: string) => quantities[codigo] || 1;

  // Helper para actualizar cantidad de un producto
  const updateQuantity = (codigo: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantities(prev => ({
        ...prev,
        [codigo]: newQuantity
      }));
    }
  };

  // Helper para agregar al carrito - convertir ProductoCatalogo a Product del store
  const addToCart = (product: ProductoCatalogo, quantity: number) => {
    // Convertir el producto del catálogo al formato del carrito
    const cartProduct = {
      id: product.id,
      name: product.nombre,
      price: product.precioUnitario,
      code: product.codigo,
      stock: product.inventarioResumen?.cantidadTotal || 0,
      image: 'https://plus.unsplash.com/premium_photo-1668487826871-2f2cac23ad56?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1112'
    };
    
    addItem(cartProduct, quantity);
    console.log(`Agregado al carrito: ${product.nombre} x${quantity}`);
  };

  // Categorías dinámicas
  const categories = [
    { id: '', name: 'Todos', active: selectedCategory === '' },
    ...Object.entries(CATEGORIAS).map(([id, name]) => ({
      id: id as CategoriaId,
      name,
      active: selectedCategory === id
    }))
  ];

  const navigateToCart = () => {
    router.push('/carrito');
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white">
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={20} color="#1f2937" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-gray-800">
            Catálogo
          </Text>
          
          <View className="relative">
            <TouchableOpacity className="p-2" onPress={navigateToCart}>
              <Ionicons name="cart-outline" size={24} color="#1193d4" />
            </TouchableOpacity>
            {totalItems > 0 && (
              <View className="absolute -top-1 -right-1 bg-primary rounded-full h-5 w-5 items-center justify-center">
                <Text className="text-xs font-bold text-white">{totalItems}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Search Bar */}
        <View className="px-4 pb-4">
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Ionicons name="search" size={20} color="#6b7280" />
            </View>
            <TextInput
              className="w-full bg-gray-100 rounded-full py-3 pl-10 pr-4 text-base text-gray-800"
              placeholder="Buscar productos"
              placeholderTextColor="#6b7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Categories Section */}
        <View className="px-4 py-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`px-4 py-2 rounded-full ${
                    category.active 
                      ? 'bg-primary' 
                      : 'bg-gray-200'
                  }`}
                  onPress={() => setSelectedCategory(category.id as CategoriaId | '')}
                >
                  <Text className={`text-sm font-medium ${
                    category.active 
                      ? 'text-white' 
                      : 'text-gray-700'
                  }`}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Products Section */}
        <View className="px-4 pb-20">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-800">
              {searchQuery ? `Resultados para "${searchQuery}"` : 
               selectedCategory ? `Categoría: ${categories.find(c => c.id === selectedCategory)?.name}` : 
               'Productos Destacados'}
            </Text>
            <TouchableOpacity 
              className="bg-green-500 px-3 py-1 rounded"
              onPress={() => testCatalogDirectly()}
            >
              <Text className="text-white text-xs">Test API</Text>
            </TouchableOpacity>
          </View>
          
          {/* Loading State */}
          {isLoading && (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#1193d4" />
              <Text className="text-gray-500 mt-2">Cargando productos...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View className="items-center py-8">
              <Text className="text-red-500 mb-2">Error al cargar productos</Text>
              <TouchableOpacity 
                className="bg-primary px-4 py-2 rounded-lg"
                onPress={() => activeQuery.refetch()}
              >
                <Text className="text-white font-medium">Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Products List */}
          {!isLoading && !error && productos.map((product) => {
            const quantity = getProductQuantity(product.codigo);
            const hasStock = (product.inventarioResumen?.cantidadTotal || 0) > 0;
            
            return (
              <View key={product.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                {/* Product Image */}
                <View className="h-48 bg-gray-100 items-center justify-center">
                  <Image
                    source={{
                      uri: 'https://plus.unsplash.com/premium_photo-1668487826871-2f2cac23ad56?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1112'
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                
                {/* Product Info */}
                <View className="p-4">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    {product.nombre}
                  </Text>
                  <Text className="text-sm text-gray-500 mb-3">
                    Código: {product.codigo}
                  </Text>
                  
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-bold text-gray-800">
                      ${product.precioUnitario.toFixed(2)}
                    </Text>
                    <View className={`px-2 py-1 rounded-md ${
                      hasStock ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        hasStock ? 'text-green-700' : 'text-red-700'
                      }`}>
                        Stock: {product.inventarioResumen?.cantidadTotal || 0}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Quantity and Add to Cart */}
                  <View className="flex-row items-center justify-between">
                    {hasStock ? (
                      <>
                        <View className="flex-row items-center gap-3">
                          <TouchableOpacity 
                            className="w-8 h-8 border border-gray-300 rounded-full items-center justify-center"
                            onPress={() => updateQuantity(product.codigo, quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            <Ionicons name="remove" size={16} color={quantity <= 1 ? "#9ca3af" : "#6b7280"} />
                          </TouchableOpacity>
                          
                          <Text className="text-base font-medium text-gray-800 min-w-[24px] text-center">
                            {quantity}
                          </Text>
                          
                          <TouchableOpacity 
                            className="w-8 h-8 border border-gray-300 rounded-full items-center justify-center"
                            onPress={() => updateQuantity(product.codigo, quantity + 1)}
                            disabled={quantity >= (product.inventarioResumen?.cantidadTotal || 0)}
                          >
                            <Ionicons name="add" size={16} color={quantity >= (product.inventarioResumen?.cantidadTotal || 0) ? "#9ca3af" : "#6b7280"} />
                          </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity 
                          className="bg-primary px-4 py-2 rounded-lg flex-row items-center gap-1"
                          onPress={() => addToCart(product, quantity)}
                        >
                          <Ionicons name="cart" size={16} color="white" />
                          <Text className="text-white font-semibold text-sm">Agregar</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <View className="flex-row items-center gap-3">
                          <TouchableOpacity 
                            className="w-8 h-8 border border-gray-300 rounded-full items-center justify-center bg-gray-200"
                            disabled
                          >
                            <Ionicons name="remove" size={16} color="#9ca3af" />
                          </TouchableOpacity>
                          
                          <Text className="text-base font-medium text-gray-400 min-w-[24px] text-center">
                            0
                          </Text>
                          
                          <TouchableOpacity 
                            className="w-8 h-8 border border-gray-300 rounded-full items-center justify-center bg-gray-200"
                            disabled
                          >
                            <Ionicons name="add" size={16} color="#9ca3af" />
                          </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity 
                          className="bg-gray-300 px-4 py-2 rounded-lg flex-row items-center gap-1"
                          disabled
                        >
                          <Ionicons name="cart" size={16} color="#6b7280" />
                          <Text className="text-gray-500 font-semibold text-sm">Sin Stock</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            );
          })}

          {/* Empty State */}
          {!isLoading && !error && productos.length === 0 && (
            <View className="items-center py-8">
              <Text className="text-gray-500 mb-2">No se encontraron productos</Text>
              <Text className="text-gray-400 text-sm text-center">
                {searchQuery ? 'Intenta con otros términos de búsqueda' : 
                 selectedCategory ? 'Esta categoría no tiene productos disponibles' : 
                 'No hay productos disponibles en este momento'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* APK Debugger */}
      <APKDebugger />
    </SafeAreaView>
  );
}