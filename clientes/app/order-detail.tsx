import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOrderById } from '@/hooks/useOrders';
import { getOrderStatusInfo } from '@/types/orders';

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useOrderById(orderId || '');

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-light">
        <StatusBar style="dark" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1193d4" />
          <Text className="text-gray-500 mt-4">Cargando detalles del pedido...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 bg-background-light" edges={['top']}>
        <StatusBar style="dark" />
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text className="text-red-500 text-lg font-semibold mt-4">Error al cargar el pedido</Text>
          <Text className="text-gray-500 text-center mt-2">
            No se pudo cargar la información del pedido
          </Text>
          <TouchableOpacity
            className="bg-primary mt-6 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getOrderStatusInfo(order.status);
  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-background-light" edges={['top']}>
        <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-gray-800">
            Detalle del Pedido
          </Text>
          
          <View className="w-6" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Order ID Section */}
        <View className="bg-white p-4 mb-2">
          <Text className="text-sm text-gray-500 mb-1">Número de pedido</Text>
          <Text className="text-lg font-bold text-gray-900">#{order.id.slice(0, 8)}</Text>
          <Text className="text-sm text-gray-500 mt-2">{formattedDate}</Text>
        </View>

        {/* Status Section */}
        <View className="bg-white p-4 mb-2">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Estado del pedido</Text>
          <View 
            className="flex-row items-center gap-3 p-3 rounded-lg"
            style={{ backgroundColor: statusInfo.bgColor }}
          >
            <Ionicons name={statusInfo.icon as any} size={24} color={statusInfo.color} />
            <Text className="font-semibold" style={{ color: statusInfo.color }}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View className="bg-white p-4 mb-2">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Información del cliente</Text>
          <View className="space-y-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="business-outline" size={20} color="#6b7280" />
              <Text className="text-gray-900">{order.customer_id}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <Text className="text-gray-900">{order.user_name}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View className="bg-white p-4 mb-2">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Dirección de entrega</Text>
          <View className="flex-row gap-2">
            <Ionicons name="location-outline" size={20} color="#6b7280" className="mt-1" />
            <View className="flex-1">
              <Text className="text-gray-900">{order.address.street}</Text>
              <Text className="text-gray-600">{order.address.city}, {order.address.state}</Text>
              <Text className="text-gray-600">{order.address.country} - {order.address.zip_code}</Text>
            </View>
          </View>
        </View>

        {/* Items */}
        <View className="bg-white p-4 mb-2">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Productos ({order.items.length})</Text>
          <View className="space-y-3">
            {order.items.map((item, index) => (
              <View 
                key={index}
                className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">{item.sku}</Text>
                  <Text className="text-sm text-gray-500">Código: {item.sku}</Text>
                </View>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-700 font-medium">x{item.qty}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Order Info */}
        <View className="bg-white p-4 mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Información adicional</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Origen:</Text>
              <Text className="text-gray-900 font-medium">{order.source}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Creado por:</Text>
              <Text className="text-gray-900 font-medium capitalize">{order.created_by_role}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </>
  );
}
