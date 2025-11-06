import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOrders } from '@/hooks/useOrders';
import { getOrderStatusInfo, type Order } from '@/types/orders';

export default function PedidosScreen() {
  const { data: orders, isLoading, error, refetch, isRefetching } = useOrders();

  const handleOrderPress = (orderId: string) => {
    router.push(`/order-detail?orderId=${orderId}` as any);
  };

  const renderOrderItem = ({ item: order }: { item: Order }) => {
    const statusInfo = getOrderStatusInfo(order.status);
    const orderDate = new Date(order.created_at);
    const formattedDate = orderDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    return (
      <TouchableOpacity
        className="flex-row items-center gap-4 bg-white p-4 mb-3 rounded-lg border border-gray-200 shadow-sm active:opacity-70"
        onPress={() => handleOrderPress(order.id)}
      >
        {/* Status Icon */}
        <View 
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: statusInfo.bgColor }}
        >
          <Ionicons name={statusInfo.icon as any} size={24} color={statusInfo.color} />
        </View>

        {/* Order Info */}
        <View className="flex-1">
          <Text className="font-semibold text-gray-800">
            Pedido #{order.id.slice(0, 8)}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">{formattedDate}</Text>
          <Text className="text-xs text-gray-400 mt-1">{order.customer_id}</Text>
        </View>

        {/* Status Badge */}
        <View className="shrink-0">
          <View 
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: statusInfo.bgColor }}
          >
            <Text 
              className="text-sm font-medium"
              style={{ color: statusInfo.color }}
            >
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
      <Text className="text-gray-500 text-lg font-semibold mt-4">No hay pedidos</Text>
      <Text className="text-gray-400 text-center mt-2">
        Tus pedidos aparecerán aquí una vez que realices una compra
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
      <Text className="text-red-500 text-lg font-semibold mt-4">Error al cargar pedidos</Text>
      <Text className="text-gray-500 text-center mt-2">
        No se pudieron cargar tus pedidos
      </Text>
      <TouchableOpacity
        className="bg-primary mt-6 px-6 py-3 rounded-lg"
        onPress={() => refetch()}
      >
        <Text className="text-white font-semibold">Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={20} color="#1f2937" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-gray-800">
            Pedidos
          </Text>
          
          <View className="w-5" />
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1193d4" />
          <Text className="text-gray-500 mt-4">Cargando pedidos...</Text>
        </View>
      ) : error ? (
        renderErrorState()
      ) : (
        <View className="flex-1">
          <View className="px-4 pt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Historial de pedidos
            </Text>
          </View>
          
          <FlatList
            data={orders || []}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor="#1193d4"
                colors={['#1193d4']}
              />
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}
