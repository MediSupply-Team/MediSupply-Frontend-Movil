import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas autenticadas
 * Si el usuario no está autenticado, redirige al login
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, initialize } = useAuthStore();

  useEffect(() => {
    // Inicializar el estado de autenticación desde AsyncStorage
    initialize().finally(() => {
      setIsInitialized(true);
    });
  }, [initialize]);

  // Mostrar loading mientras se inicializa
  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#ea2a33" />
      </View>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Usuario autenticado, mostrar contenido protegido
  return <>{children}</>;
}
