import { CalendarDrawer } from '@/components/CalendarDrawer';
import { Colors } from '@/constants/theme';
import { useRutas } from '@/hooks/useRutas';
import { PermissionStatus } from '@/infrastructure/interfaces/location';
import { usePermissionsStore } from '@/store/usePermissions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const VISITAS = [
  { id: '1', nombre: 'Clínica San Lucas', hora: '10:00 AM' },
  { id: '2', nombre: 'Hospital Santa María', hora: '11:30 AM' },
  { id: '3', nombre: 'Consultorio Dr. Ramírez', hora: '1:00 PM' },
];

export default function RutaScreen() {
  const { locationStatus, requestLocationPermission, checkLocationPermission } = usePermissionsStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const VENDEDOR_ID = 1;
  const fechaISO = selectedDate.toISOString().slice(0, 10);
  const { data, isLoading, isError, error, refetch, isRefetching } = useRutas(fechaISO, VENDEDOR_ID);

  useEffect(() => {
    console.log('Location status:', locationStatus);
  }, [locationStatus]);

  useEffect(() => {
    refetch();
  }, [selectedDate]);

  const formatSelectedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return selectedDate.toLocaleDateString('es-ES', options);
  };

  const getPermissionStatusText = () => {
    switch (locationStatus) {
      case PermissionStatus.GRANTED:
        return '✅ Ubicación autorizada';
      case PermissionStatus.DENIED:
        return '❌ Ubicación denegada';
      case PermissionStatus.BLOCKED:
        return '🚫 Ubicación bloqueada';
      case PermissionStatus.LIMITED:
        return '⚠️ Ubicación limitada';
      case PermissionStatus.UNAVAILABLE:
        return '❓ Ubicación no disponible';
      case PermissionStatus.UNDETERMINED:
        return '❓ Estado indeterminado';
      case PermissionStatus.CHECKING:
        return '⏳ Verificando permisos...';
      default:
        return '❓ Estado desconocido';
    }
  };

  const getPermissionStatusColor = () => {
    switch (locationStatus) {
      case PermissionStatus.GRANTED:
        return Colors.light.success500;
      case PermissionStatus.DENIED:
      case PermissionStatus.BLOCKED:
        return Colors.light.danger500;
      case PermissionStatus.LIMITED:
      case PermissionStatus.CHECKING:
        return Colors.light.warning500;
      case PermissionStatus.UNAVAILABLE:
      case PermissionStatus.UNDETERMINED:
      default:
        return Colors.light.neutral500;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm z-[2]" style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
      }}>
        <View className="flex-row items-center justify-between">
          <View className="w-8" />
          <Text className="text-xl font-bold text-neutral-900 text-center flex-1">Ruta</Text>
          <TouchableOpacity 
            onPress={() => setShowCalendar(true)}
            className="w-8 h-8 items-center justify-center"
          >
            <MaterialIcons name="event" size={24} color={Colors.light.primary500} />
          </TouchableOpacity>
        </View>
        
        {/* Fecha seleccionada */}
        <Text className="text-sm text-neutral-500 text-center mt-1">
          {formatSelectedDate()}
        </Text>
      </View>

      {/* Contenido principal: mapa + hoja inferior */}
      <View className="flex-1 relative">
        {/* Mapa */}
        {locationStatus === PermissionStatus.GRANTED ? (
          <View className="flex-1 mb-[280px]">
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 4.7110,
                longitude: -74.0721,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
              provider="google"
              onMapReady={() => console.log('Mapa listo')}
            >
              {/* Marcadores para las visitas */}
              {/* <Marker
                coordinate={{ latitude: 4.7110, longitude: -74.0721 }}
                title="Clínica San Lucas"
                description="10:00 AM"
              />
              <Marker
                coordinate={{ latitude: 4.7130, longitude: -74.0741 }}
                title="Hospital Santa María"
                description="11:30 AM"
              />
              <Marker
                coordinate={{ latitude: 4.7090, longitude: -74.0701 }}
                title="Consultorio Dr. Ramírez"
                description="1:00 PM"
              /> */}
              {data?.visitas?.map((v) => (
                <Marker
                  key={v.id}
                  coordinate={{ latitude: v.lat, longitude: v.lng }}
                  title={v.cliente}
                  description={`${v.hora} — ${v.direccion}`}
                  pinColor="#E53935"
                />
              ))}
            </MapView>
          </View>
        ) : (
          <View className="flex-1 bg-blue-100 mb-[280px]">
            <View className="flex-1 justify-center items-center px-8 gap-4">
              <MaterialIcons 
                name="location-on" 
                size={48} 
                color={getPermissionStatusColor()} 
              />
              
              <Text 
                className="text-lg font-public-bold text-center"
                style={{ color: getPermissionStatusColor() }}
              >
                {getPermissionStatusText()}
              </Text>
              
              <TouchableOpacity 
                className="bg-primary-500 px-6 py-3 rounded-lg mt-2"
                onPress={requestLocationPermission}
              >
                <Text className="text-white font-public-medium text-center">
                  Habilitar ubicación
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center gap-2 p-2"
                onPress={checkLocationPermission}
              >
                <MaterialIcons name="refresh" size={20} color="#737373" />
                <Text className="text-neutral-500 text-sm">
                  Verificar estado
                </Text>
              </TouchableOpacity>
              
              <Text className="text-sm text-neutral-400 mt-4 text-center">
                🗺️ Aquí se mostrará el mapa
              </Text>
            </View>
          </View>
        )}
        
        {/* Hoja inferior */}
        <View className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl pt-3 px-4" style={{
          height: 280,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 10,
        }}>
          <Text className="text-base font-semibold text-neutral-900 mb-2">Visitas de hoy</Text>

          {isLoading && (
            <Text className="text-neutral-400 text-center mb-2">Cargando visitas...</Text>
          )}
          {isError && (
            <Text className="text-red-500 text-center mb-2">
              Error al cargar: {(error as any)?.message ?? 'Desconocido'}
            </Text>
          )}
          <FlatList
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            data={data?.visitas ?? []}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View className="h-px bg-neutral-200 ml-9" />}
            renderItem={({ item }) => (
              <TouchableOpacity className="py-3.5 flex-row items-center justify-between" activeOpacity={0.7}>
                <View className="flex-row items-center gap-3 flex-1">
                  <MaterialIcons name="location-on" size={20} color="#E53935" />
                  <View className="flex-shrink">
                    <Text className="text-[15px] font-semibold text-neutral-900">{item.cliente}</Text>
                    <Text className="mt-0.5 text-xs text-neutral-500">{item.hora}</Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color={Colors.light.neutral400}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Calendar Drawer */}
      <CalendarDrawer
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </SafeAreaView>
  );
}
