import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';

export default function PerfilScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro que desea cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login' as any);
          },
        },
      ]
    );
  };

  // Esta verificación ya no debería ser necesaria por el AuthGuard,
  // pero la dejamos por seguridad
  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView className="flex-1 bg-background-light">
        <View className="flex-1 items-center justify-center p-6">
          <View className="bg-gray-100 w-24 h-24 rounded-full items-center justify-center mb-6">
            <Ionicons name="person-outline" size={48} color="#9ca3af" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">
            No ha iniciado sesión
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Inicie sesión para acceder a su perfil y gestionar sus pedidos
          </Text>
          
          <TouchableOpacity
            className="bg-[#1193d4] px-8 py-4 rounded-xl w-full max-w-sm"
            onPress={() => router.push('/login' as any)}
          >
            <Text className="text-white text-center font-bold text-lg">
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push('/register' as any)}
          >
            <Text className="text-[#1193d4] font-medium">
              ¿No tiene cuenta? Regístrese aquí
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 p-4">
        <Text className="text-2xl font-bold text-gray-800">Mi Perfil</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View className="bg-white p-6 mb-2">
          <View className="items-center mb-6">
            <View className="bg-[#1193d4] w-24 h-24 rounded-full items-center justify-center mb-4 shadow-lg">
              <Ionicons name="person" size={48} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">{user.name}</Text>
            <Text className="text-gray-500 mt-1 text-base">{user.email}</Text>
            <View className="bg-blue-50 px-4 py-2 rounded-full mt-3">
              <Text className="text-[#1193d4] font-semibold capitalize text-sm">
                {user.role === 'CUSTOMER' ? 'Cliente' : user.role.toLowerCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Información del Usuario */}
        <View className="bg-white p-6 mb-2">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Información de la Cuenta
          </Text>
          <View className="space-y-4">
            <View className="flex-row items-start gap-3 pb-3 border-b border-gray-100">
              <Ionicons name="mail-outline" size={22} color="#6b7280" />
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-1">Correo Electrónico</Text>
                <Text className="text-gray-900 font-medium">{user.email}</Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3 pb-3 border-b border-gray-100">
              <Ionicons name="shield-checkmark-outline" size={22} color="#6b7280" />
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-1">Rol</Text>
                <Text className="text-gray-900 font-medium capitalize">
                  {user.role === 'CUSTOMER' ? 'Cliente' : user.role.toLowerCase()}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3 pb-3 border-b border-gray-100">
              <Ionicons name="id-card-outline" size={22} color="#6b7280" />
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-1">ID de Usuario</Text>
                <Text className="text-gray-900 font-mono text-sm">
                  #{user.id}
                </Text>
              </View>
            </View>

            {user.cliente_id && (
              <View className="flex-row items-start gap-3">
                <Ionicons name="business-outline" size={22} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs mb-1">ID de Cliente</Text>
                  <Text className="text-gray-900 font-mono text-sm">
                    {user.cliente_id}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Permissions */}
        {user.permissions && user.permissions.length > 0 && (
          <View className="bg-white p-6 mb-2">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Permisos de Acceso
            </Text>
            <View className="space-y-3">
              {user.permissions.map((permission, index) => (
                <View key={index} className="flex-row items-center gap-3 bg-green-50 p-3 rounded-lg">
                  <View className="bg-green-100 p-2 rounded-full">
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  </View>
                  <Text className="text-gray-800 font-medium flex-1">
                    {permission.replace(':', ' · ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Additional IDs Info */}
        {(user.venta_id || user.hospital_id) && (
          <View className="bg-white p-6 mb-2">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Información Adicional
            </Text>
            <View className="space-y-3">
              {user.venta_id && (
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-gray-600">ID Venta:</Text>
                  <Text className="text-gray-900 font-mono text-sm">{user.venta_id}</Text>
                </View>
              )}
              {user.hospital_id && (
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-gray-600">ID Hospital:</Text>
                  <Text className="text-gray-900 font-mono text-sm">{user.hospital_id}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Options */}
        <View className="bg-white mb-2">
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-gray-100 p-2 rounded-full">
                <Ionicons name="settings-outline" size={22} color="#6b7280" />
              </View>
              <Text className="text-gray-900 text-base font-medium">Configuración</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-gray-100 p-2 rounded-full">
                <Ionicons name="notifications-outline" size={22} color="#6b7280" />
              </View>
              <Text className="text-gray-900 text-base font-medium">Notificaciones</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-gray-100 p-2 rounded-full">
                <Ionicons name="help-circle-outline" size={22} color="#6b7280" />
              </View>
              <Text className="text-gray-900 text-base font-medium">Ayuda y Soporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-gray-100 p-2 rounded-full">
                <Ionicons name="information-circle-outline" size={22} color="#6b7280" />
              </View>
              <Text className="text-gray-900 text-base font-medium">Acerca de</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View className="p-4 pb-8">
          <TouchableOpacity
            className="bg-red-500 py-4 rounded-xl flex-row items-center justify-center gap-3 shadow-md"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={22} color="white" />
            <Text className="text-white font-bold text-base">Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}