import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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

import { useCatalogWithWebSocket } from "@/hooks/useCatalogWithWebSocket";
import { useCartStore } from "@/store/cartStore";
import { CATEGORIAS, type CategoriaId, type ProductoCatalogo } from "@/types/catalog";

export default function CatalogoVentasScreen() {
  const { clienteId } = useLocalSearchParams();
  const { addItem, items } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoriaId | ''>('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Calcular total de items desde el state directamente para que React lo observe
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Hook híbrido que usa HTTP + WebSocket
  const {
    data: catalogData,
    isLoading,
    error,
    refetch
  } = useCatalogWithWebSocket({
    searchQuery,
    category: selectedCategory,
    useWebSocket: true // Habilitado para actualizaciones en tiempo real
  });

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
    router.push({
      pathname: '/pedido/carrito' as any,
      params: { clienteId }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white">
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#171717" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-neutral-900">
            Catálogo
          </Text>
          
          <View className="relative">
            <TouchableOpacity className="p-2" onPress={navigateToCart}>
              <Ionicons name="cart-outline" size={24} color="#ea2a33" />
            </TouchableOpacity>
            <View className="absolute -top-1 -right-1 bg-primary-500 rounded-full h-5 w-5 items-center justify-center">
              <Text className="text-xs font-bold text-white">{totalItems}</Text>
            </View>
          </View>
        </View>
        
        {/* Search Bar */}
        <View className="px-4 pb-4">
          <View className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Ionicons name="search" size={20} color="#737373" />
            </View>
            <TextInput
              className="w-full bg-neutral-200 rounded-full py-3 pl-10 pr-4 text-base text-neutral-900"
              placeholder="Buscar productos"
              placeholderTextColor="#737373"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Categories Section */}
        <View className="px-4 py-4">
          <Text className="text-lg font-bold text-neutral-900 mb-3">Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`px-4 py-2 rounded-full ${
                    category.active 
                      ? 'bg-primary-500' 
                      : 'bg-neutral-200'
                  }`}
                  onPress={() => setSelectedCategory(category.id as CategoriaId | '')}
                >
                  <Text className={`text-sm font-medium ${
                    category.active 
                      ? 'text-white' 
                      : 'text-neutral-800'
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
          <Text className="text-lg font-bold text-neutral-900 mb-3">
            {searchQuery ? `Resultados para "${searchQuery}"` : 
             selectedCategory ? `Categoría: ${categories.find(c => c.id === selectedCategory)?.name}` : 
             'Productos Destacados'}
          </Text>
          
          {/* Loading State */}
          {isLoading && (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#ea2a33" />
              <Text className="text-neutral-500 mt-2">Cargando productos...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View className="items-center py-8">
              <Text className="text-danger-500 mb-2">Error al cargar productos</Text>
              <TouchableOpacity 
                className="bg-primary-500 px-4 py-2 rounded-lg"
                onPress={() => refetch()}
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
                <View className="h-48 bg-neutral-200 items-center justify-center">
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
                  <Text className="text-base font-semibold text-neutral-900 mb-1">
                    {product.nombre}
                  </Text>
                  <Text className="text-sm text-neutral-500 mb-3">
                    Código: {product.codigo}
                  </Text>
                  
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-bold text-neutral-900">
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
                            className="w-8 h-8 border border-neutral-400 rounded-full items-center justify-center"
                            onPress={() => updateQuantity(product.codigo, quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            <Ionicons name="remove" size={16} color={quantity <= 1 ? "#a3a3a3" : "#737373"} />
                          </TouchableOpacity>
                          
                          <Text className="text-base font-medium text-neutral-900 min-w-[24px] text-center">
                            {quantity}
                          </Text>
                          
                          <TouchableOpacity 
                            className="w-8 h-8 border border-neutral-400 rounded-full items-center justify-center"
                            onPress={() => updateQuantity(product.codigo, quantity + 1)}
                            disabled={quantity >= (product.inventarioResumen?.cantidadTotal || 0)}
                          >
                            <Ionicons name="add" size={16} color="#737373" />
                          </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity 
                          className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center gap-1"
                          onPress={() => addToCart(product, quantity)}
                        >
                          <Ionicons name="cart" size={16} color="white" />
                          <Text className="text-white text-sm font-medium">Agregar</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <View className="flex-row items-center gap-3">
                          <TouchableOpacity 
                            className="w-8 h-8 border border-neutral-400 rounded-full items-center justify-center opacity-50"
                            disabled
                          >
                            <Ionicons name="remove" size={16} color="#a3a3a3" />
                          </TouchableOpacity>
                          
                          <Text className="text-base font-medium text-neutral-500 min-w-[24px] text-center">
                            0
                          </Text>
                          
                          <TouchableOpacity 
                            className="w-8 h-8 border border-neutral-400 rounded-full items-center justify-center opacity-50"
                            disabled
                          >
                            <Ionicons name="add" size={16} color="#a3a3a3" />
                          </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity 
                          className="bg-neutral-400 px-4 py-2 rounded-lg flex-row items-center gap-1"
                          disabled
                        >
                          <Ionicons name="cart" size={16} color="#737373" />
                          <Text className="text-neutral-800 text-sm font-medium">Sin Stock</Text>
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
              <Text className="text-neutral-500 mb-2">No se encontraron productos</Text>
              <Text className="text-neutral-400 text-sm text-center">
                {searchQuery ? 'Intenta con otros términos de búsqueda' : 
                 selectedCategory ? 'Esta categoría no tiene productos disponibles' : 
                 'No hay productos disponibles en este momento'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}