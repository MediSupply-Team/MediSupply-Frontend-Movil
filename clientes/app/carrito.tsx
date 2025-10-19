import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

export default function CarritoScreen() {
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
    if (cartItems.length === 0) {
      Alert.alert("Carrito vacío", "Agrega productos antes de confirmar.");
      return;
    }

    // Mapea tus items al formato del backend
    const payload = {
      customer_id: "hospital-central-001", // ID del cliente según el backend
      shippingAddress: "Calle Principal 123, Ciudad, Estado",
      items: cartItems.map((i) => ({
        sku: i.code,               // SKU del producto (código)
        name: i.name,
        unitPrice: i.price,
        qty: i.quantity,           // Backend espera 'qty' no 'quantity'
      })),
      totals: { subtotal, shipping, total },
    };

    try {
      const res = await mutateAsync(payload);
      console.log("✅ Orden creada:", res);
      
      // Limpiar el carrito después de la orden exitosa
      clearCart();
      
      Alert.alert("Pedido confirmado", `Orden #${res?.id ?? "—"} creada con éxito`, [
        { text: "OK", onPress: () => router.push("/(tabs)") }, // ajusta la ruta
      ]);
    } catch (e: any) {
      console.log("❌ Error creando orden", e?.response?.data ?? e?.message);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        e?.message ||
        "Error desconocido";
      Alert.alert("Error", msg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white">
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#1f2937" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-gray-800 flex-1 text-center">
            Resumen del pedido
          </Text>
          
          <View className="w-5" />
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 space-y-6">
          {/* Products Section */}
          <View>
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Productos
            </Text>
            
            <View className="space-y-4">
              {cartItems.map((item) => (
                <View key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <View className="flex-row items-center gap-4">
                    <Image
                      source={{ uri: item.image }}
                      className="w-16 h-16 rounded-lg bg-gray-100"
                      resizeMode="cover"
                    />
                    
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-800 mb-1">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-gray-500 mb-3">
                        ${item.price.toFixed(2)}
                      </Text>
                      
                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity 
                          className="w-6 h-6 border border-gray-300 rounded-full items-center justify-center"
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Ionicons name="remove" size={12} color="#6b7280" />
                        </TouchableOpacity>
                        
                        <Text className="text-sm font-normal text-gray-500 mx-2">
                          Cantidad: {item.quantity}
                        </Text>
                        
                        <TouchableOpacity 
                          className="w-6 h-6 border border-gray-300 rounded-full items-center justify-center"
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Ionicons name="add" size={12} color="#6b7280" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <Text className="text-lg font-bold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Order Details Section */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Detalles del pedido
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-normal text-gray-500">
                  Subtotal
                </Text>
                <Text className="text-base font-medium text-gray-800">
                  ${subtotal.toFixed(2)}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-normal text-gray-500">
                  Envío
                </Text>
                <Text className="text-base font-medium text-gray-800">
                  ${shipping.toFixed(2)}
                </Text>
              </View>
              
              <View className="border-t border-gray-200 pt-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-bold text-gray-800">
                    Total
                  </Text>
                  <Text className="text-lg font-bold text-gray-800">
                    ${total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Delivery Address Section */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Dirección de entrega
            </Text>
            <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Text className="text-base font-semibold text-gray-800 mb-1">
                Hospital Central
              </Text>
              <Text className="text-base font-normal text-gray-500">
                Calle Principal 123, Ciudad, Estado, Código Postal
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer with Confirm Button */}
      <View className="bg-white p-4">
          <TouchableOpacity
            className={`w-full bg-primary rounded-lg h-14 items-center justify-center ${isPending ? "opacity-70" : ""}`}
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