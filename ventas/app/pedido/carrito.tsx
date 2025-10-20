import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCreateOrder } from "@/hooks/useCreateOrder";
import { useCartStore } from "@/store/cartStore";

export default function CarritoVentasScreen() {
  const { clienteId } = useLocalSearchParams();
  const { 
    items: cartItems, 
    updateQuantity, 
    clearCart, 
    getSubtotal, 
    getShipping, 
    getTotalPrice 
  } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotalPrice();

  const { mutateAsync, isPending } = useCreateOrder();

  const confirmOrder = async () => {
    console.log("🛒 [CARRITO] Iniciando confirmación de pedido...");
    console.log("👤 [CARRITO] Cliente ID:", clienteId);
    console.log("📦 [CARRITO] Items en carrito:", cartItems.length);
    console.log("🧾 [CARRITO] Cart items:", JSON.stringify(cartItems, null, 2));
    
    if (cartItems.length === 0) {
      console.warn("⚠️ [CARRITO] Carrito vacío, cancelando operación");
      Alert.alert("Carrito vacío", "Agrega productos antes de confirmar.");
      return;
    }

    // Mapea tus items al formato del backend según el esquema del orders-service
    const payload = {
      customer_id: (clienteId as string) || "cliente-default",
      created_by_role: "vendedor" as const,
      source: "mobile-ventas" as const,
      items: cartItems.map((i) => ({
        sku: i.code,               // SKU del producto (código)
        qty: i.quantity,           // Backend espera 'qty' no 'quantity'
      })),
    };

    console.log("📋 [CARRITO] Payload preparado:", JSON.stringify(payload, null, 2));
    console.log("💰 [CARRITO] Totales - Subtotal:", subtotal, "Envío:", shipping, "Total:", total);

    try {
      console.log("🚀 [CARRITO] Ejecutando mutateAsync...");
      const res = await mutateAsync(payload);
      console.log("✅ [CARRITO] Orden creada exitosamente:", JSON.stringify(res, null, 2));
      
      // Limpiar el carrito después de la orden exitosa
      clearCart();
      console.log("🧹 [CARRITO] Carrito limpiado");
      
      Alert.alert("Pedido confirmado", `Orden #${res?.id ?? "—"} creada con éxito`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      console.error("❌ [CARRITO] Error completo:", e);
      console.error("❌ [CARRITO] Error name:", e.name);
      console.error("❌ [CARRITO] Error message:", e.message);
      console.error("❌ [CARRITO] Error stack:", e.stack);
      
      if (e.response) {
        console.error("📡 [CARRITO] Response status:", e.response.status);
        console.error("📡 [CARRITO] Response data:", JSON.stringify(e.response.data, null, 2));
        console.error("📡 [CARRITO] Response headers:", e.response.headers);
      } else if (e.request) {
        console.error("📡 [CARRITO] Request sin respuesta:", e.request);
      } else {
        console.error("⚙️ [CARRITO] Error de configuración:", e.message);
      }
      
      let errorMessage = "Error de red desconocido";
      
      if (e.code === 'NETWORK_ERROR') {
        errorMessage = "Error de conectividad. Verifica tu conexión a internet.";
      } else if (e.message?.includes('Network Error')) {
        errorMessage = "No se pudo conectar al servidor. Verifica que el servidor esté ejecutándose.";
      } else if (e.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e.response?.data?.detail) {
        errorMessage = e.response.data.detail;
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      console.error("💬 [CARRITO] Mensaje final para usuario:", errorMessage);
      Alert.alert("Error", errorMessage);
    }
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
          
          <Text className="text-xl font-bold text-neutral-900 flex-1 text-center">
            Resumen del pedido
          </Text>
          
          <View className="w-5" />
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 space-y-6">
          {/* Products Section */}
          <View>
            <Text className="text-lg font-bold text-neutral-900 mb-4">
              Productos
            </Text>
            
            <View className="space-y-4">
              {cartItems.map((item) => (
                <View key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <View className="flex-row items-center gap-4">
                    <Image
                      source={{ uri: item.image }}
                      className="w-16 h-16 rounded-lg bg-neutral-200"
                      resizeMode="cover"
                    />
                    
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-neutral-900 mb-1">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-neutral-500 mb-3">
                        ${item.price.toFixed(2)}
                      </Text>
                      
                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity 
                          className="w-6 h-6 border border-neutral-400 rounded-full items-center justify-center"
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Ionicons name="remove" size={12} color="#737373" />
                        </TouchableOpacity>
                        
                        <Text className="text-sm font-normal text-neutral-500 mx-2">
                          Cantidad: {item.quantity}
                        </Text>
                        
                        <TouchableOpacity 
                          className="w-6 h-6 border border-neutral-400 rounded-full items-center justify-center"
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Ionicons name="add" size={12} color="#737373" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <Text className="text-lg font-bold text-neutral-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Order Details Section */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold text-neutral-900 mb-4">
              Detalles del pedido
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-normal text-neutral-500">
                  Subtotal
                </Text>
                <Text className="text-base font-medium text-neutral-900">
                  ${subtotal.toFixed(2)}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-normal text-neutral-500">
                  Envío
                </Text>
                <Text className="text-base font-medium text-neutral-900">
                  ${shipping.toFixed(2)}
                </Text>
              </View>
              
              <View className="border-t border-neutral-200 pt-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-bold text-neutral-900">
                    Total
                  </Text>
                  <Text className="text-lg font-bold text-neutral-900">
                    ${total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Cliente Info Section */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold text-neutral-900 mb-3">
              Cliente
            </Text>
            <View className="bg-neutral-100 p-4 rounded-lg border border-neutral-200">
              <Text className="text-base font-semibold text-neutral-900 mb-1">
                Cliente ID: {clienteId}
              </Text>
              <Text className="text-base font-normal text-neutral-500">
                El pedido será asignado a este cliente
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer with Confirm Button */}
      <View className="bg-white p-4">
          <TouchableOpacity
            className={`w-full bg-primary-500 rounded-lg h-14 items-center justify-center ${isPending ? "opacity-70" : ""}`}
            onPress={confirmOrder}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">Confirmar pedido</Text>
            )}
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}