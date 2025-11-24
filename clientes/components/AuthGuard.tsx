import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * Si el usuario no está autenticado, redirige a /login
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirigir a login si no está autenticado
      router.replace('/login' as any);
    }
  }, [isAuthenticated, isLoading]);

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1193d4" />
      </View>
    );
  }

  // Si no está autenticado, mostrar loading (el useEffect redirigirá)
  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1193d4" />
      </View>
    );
  }

  // Usuario autenticado, mostrar contenido
  return <>{children}</>;
}
