import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../../global.css';
import { useBuscarClientes, useClientes } from '../../hooks/useClientes';
import type { Cliente } from '../../infrastructure/interfaces/cliente';
import { APKDebugger } from '@/components/APKDebugger';
import { useAuthStore } from '@/store/authStore';

export default function ClientesScreen() {
  const [searchText, setSearchText] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const { user, logout } = useAuthStore();

  // Obtener el ID del vendedor desde el store de autenticación
  const VENDEDOR_ID = user?.venta_id || 'VEN001';

  // Hook para listar todos los clientes
  const { 
    data: clientes = [], 
    isLoading, 
    isError, 
    error, 
    refetch,
    isRefetching 
  } = useClientes(); // Sin parámetros - el backend devuelve todos los clientes por defecto

  // Hook para búsqueda de clientes
  const { 
    data: clientesBusqueda, 
    isLoading: isBuscando,
    isError: isErrorBusqueda
  } = useBuscarClientes(
    { q: searchText, vendedor_id: VENDEDOR_ID },
    searchText.length >= 2 // Solo buscar si hay al menos 2 caracteres
  );

  // Manejar logout
  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Está seguro que desea cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  // Determinar qué datos mostrar
  const datosAMostrar = useMemo(() => {
    if (!searchText.trim()) {
      // Sin búsqueda: aplicar filtro de activos del lado del cliente
      const clientesBase = clientes || [];
      return showActiveOnly 
        ? clientesBase.filter(cliente => cliente.activo)
        : clientesBase;
    }

    const resultadosBusqueda = clientesBusqueda || [];

    // Si hay resultados de búsqueda remota y no hay error, usarlos
    if (resultadosBusqueda && resultadosBusqueda.length > 0 && !isErrorBusqueda) {
      return showActiveOnly 
        ? resultadosBusqueda.filter(cliente => cliente.activo)
        : resultadosBusqueda;
    }

    // Si la búsqueda remota no devolvió resultados o falló, usar búsqueda local
    const clientesBase = clientes || [];
    const filtrados = clientesBase.filter(cliente => {
      const texto = searchText.toLowerCase();
      const matchesSearch = (
        cliente.nombre?.toLowerCase().includes(texto) ||
        cliente.nit?.toLowerCase().includes(texto) ||
        cliente.codigo_unico?.toLowerCase().includes(texto) ||
        cliente.email?.toLowerCase().includes(texto) ||
        cliente.ciudad?.toLowerCase().includes(texto)
      );
      
      // Aplicar también el filtro de activos
      return matchesSearch && (showActiveOnly ? cliente.activo : true);
    });
    
    return filtrados;
  }, [searchText, clientesBusqueda, isErrorBusqueda, clientes, showActiveOnly]);

  const getInitials = (nombre: string): string => {
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (nombre: string): string => {
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    const index = nombre.length % colors.length;
    return colors[index];
  };

  const renderClient = ({ item }: { item: Cliente }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-4 bg-white active:bg-neutral-50"
      onPress={() => router.push({
        pathname: `/cliente/[id]`,
        params: { 
          id: item.id,
          clienteData: JSON.stringify(item)
        }
      })}
      activeOpacity={0.7}
    >
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: getAvatarColor(item.nombre) }}
      >
        <Text className="text-white text-base font-public-bold">
          {getInitials(item.nombre)}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-public-medium text-neutral-900 mb-1">
          {item.nombre}
        </Text>
        <Text className="text-sm text-neutral-500">
          {item.ciudad} • {item.codigo_unico}
        </Text>
        {!item.activo && (
          <Text className="text-xs text-red-500 mt-1">
            Inactivo
          </Text>
        )}
      </View>
      <View className="items-end">
        <MaterialIcons name="arrow-forward-ios" size={16} color="#a3a3a3" />
        <Text className="text-xs text-neutral-400 mt-1">
          {item.nit}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSeparator = () => (
    <View className="h-px bg-neutral-100 ml-20" />
  );

  const renderEmptyState = () => {
    if (isLoading || (isBuscando && searchText.length >= 2)) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-neutral-500 text-center">
            {searchText.length >= 2 ? 'Buscando clientes...' : 'Cargando clientes...'}
          </Text>
        </View>
      );
    }

    if (isError && searchText.length < 2) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text className="text-red-500 text-center mt-4 text-base">
            Error al cargar clientes
          </Text>
          <Text className="text-neutral-500 text-center mt-2 px-8">
            {(error as any)?.message || 'Ha ocurrido un error inesperado'}
          </Text>
          <TouchableOpacity 
            className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
            onPress={() => refetch()}
          >
            <Text className="text-white font-medium">Intentar nuevamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center py-20">
        <MaterialIcons name="person-search" size={48} color="#a3a3a3" />
        <Text className="text-neutral-500 text-center mt-4 text-base">
          {searchText.length >= 2 ? 'No se encontraron clientes' : 'No hay clientes disponibles'}
        </Text>
        {searchText.length >= 2 && (
          <View>
            <Text className="text-neutral-400 text-center mt-2 px-8">
              Intenta con otros términos de búsqueda
            </Text>
            {isErrorBusqueda && (
              <Text className="text-orange-500 text-center mt-2 px-8 text-sm">
                (Búsqueda realizada localmente)
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100" edges={['top']}>
      <View className="flex-1 bg-neutral-100">
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        
        {/* Header */}
        <View className="bg-white shadow-sm" style={{ 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 3,
        }}>
          {/* Header Top */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="w-8" />
            <Text className="text-xl font-public-bold text-neutral-900 flex-1 text-center">
              Clientes
            </Text>
            <TouchableOpacity 
              className="w-8 h-8 rounded-full bg-red-500 items-center justify-center"
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View className="px-4 pb-4">
            <View className="relative">
              <MaterialIcons 
                name="search" 
                size={20} 
                color="#737373" 
                className="absolute left-3 top-3 z-10"
                style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
              />
              <TextInput
                className="bg-neutral-100 rounded-3xl py-2 pl-10 pr-4 text-base text-neutral-900"
                placeholder="Buscar por nombre, NIT o código"
                placeholderTextColor="#737373"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>
          
          {/* Filter Buttons */}
          <View className="ml-4 flex-row gap-2 pb-3">
            <TouchableOpacity 
              className={`flex-row items-center px-4 py-2 rounded-2xl gap-2 ${showActiveOnly ? 'bg-primary-500' : 'bg-neutral-100'}`}
              onPress={() => setShowActiveOnly(!showActiveOnly)}
            >
              <Text className={`text-sm font-public-medium ${showActiveOnly ? 'text-white' : 'text-neutral-900'}`}>
                {showActiveOnly ? 'Solo activos' : 'Todos'}
              </Text>
            </TouchableOpacity>
            <View className="flex-row items-center bg-neutral-100 px-4 py-2 rounded-2xl gap-2">
              <Text className="text-sm font-public-medium text-neutral-900">
                {datosAMostrar.length} cliente{datosAMostrar.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Client List */}
        <FlatList
          data={datosAMostrar}
          renderItem={renderClient}
          keyExtractor={item => item.id}
          className="flex-1 bg-white"
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl 
              refreshing={isRefetching} 
              onRefresh={refetch}
              colors={['#ea2a33']}
              tintColor="#ea2a33"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
       {/* APK Debugger */}
      <APKDebugger />
    </SafeAreaView>
  );
}