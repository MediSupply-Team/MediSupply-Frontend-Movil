import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1193d4', // Color primary del diseño
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 12,
          paddingTop: 8,
          height: 68,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="entregas"
        options={{
          title: 'Entregas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
