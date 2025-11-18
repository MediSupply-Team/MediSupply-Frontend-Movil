import React from 'react';
import { View, Text } from 'react-native';

interface WebSocketIndicatorProps {
  isConnected: boolean;
}

export function WebSocketIndicator({ isConnected }: WebSocketIndicatorProps) {
  if (!isConnected) {
    return (
      <View className="bg-orange-500 px-2 py-1 rounded-full">
        <Text className="text-xs text-white font-medium">Reconectando...</Text>
      </View>
    );
  }

  return (
    <View className="bg-green-500 px-2 py-1 rounded-full">
      <Text className="text-xs text-white font-medium">Stock en Tiempo Real</Text>
    </View>
  );
}
