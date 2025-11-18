// components/WebSocketIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WebSocketIndicatorProps {
  isConnected: boolean;
  showWhenConnected?: boolean;
}

export function WebSocketIndicator({ isConnected, showWhenConnected = true }: WebSocketIndicatorProps) {
  if (isConnected && !showWhenConnected) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: isConnected ? '#4CAF50' : '#FF9800' }
    ]}>
      <Text style={styles.text}>
        {isConnected ? '🟢 Stock en Tiempo Real' : '🟡 Reconectando...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
  },
});
