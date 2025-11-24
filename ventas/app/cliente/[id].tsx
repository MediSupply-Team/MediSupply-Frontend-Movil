import { Colors } from '@/constants/theme';
import { useCliente, useHistoricoCliente } from '@/hooks/useClientes';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ID del vendedor - en una implementación real esto vendría del contexto de autenticación
const VENDEDOR_ID = 'VEN001';

export default function ClienteDetalleScreen() {
  const { id, clienteData } = useLocalSearchParams();
  const clienteId = id as string;
  
  // Parseamos los datos del cliente si vienen como string de la navegación
  let clienteFromNavigation = null;
  try {
    clienteFromNavigation = clienteData ? JSON.parse(clienteData as string) : null;
  } catch (error) {
    console.warn('📱 Error parsing cliente data from navigation:', error);
  }

  console.log('📱 Cliente Detail - ID:', clienteId);
  console.log('📱 Cliente Detail - Data from navigation:', !!clienteFromNavigation);

  // Hook para obtener datos básicos del cliente (solo si no vienen de navegación)
  const { 
    data: clienteFromApi, 
    isLoading: isLoadingCliente, 
    isError: isErrorCliente, 
    error: errorCliente,
    refetch: refetchCliente 
  } = useCliente(clienteId, !clienteFromNavigation); // Solo hacer request si no tenemos datos

  // Usar datos de navegación si están disponibles, sino usar los de la API
  const cliente = clienteFromNavigation || clienteFromApi;

  // Hook para obtener histórico del cliente
  const { 
    data: historico, 
    isLoading: isLoadingHistorico, 
    isError: isErrorHistorico,
    error: errorHistorico,
    refetch: refetchHistorico 
  } = useHistoricoCliente(clienteId, { vendedor_id: VENDEDOR_ID }, !!cliente);

  console.log('📱 Cliente Detail - Loading histórico:', isLoadingHistorico);
  console.log('📱 Cliente Detail - Error histórico:', isErrorHistorico, errorHistorico);

  const isLoading = (!cliente && isLoadingCliente) || isLoadingHistorico;
  const isError = (!cliente && isErrorCliente) || isErrorHistorico;
  const error = errorCliente || errorHistorico;

  const handleRefresh = () => {
    if (!clienteFromNavigation) {
      refetchCliente();
    }
    refetchHistorico();
  };

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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const goBackOrHome = () => {
    console.log('📱 Navegando atrás o a home desde Cliente Detalle');
    if (router.canGoBack()) {
      console.log('📱 Volviendo a la pantalla anterior');
      router.back();
    } else {
      console.log('📱 No hay pantalla anterior, yendo al home');
      // a qué tab quieres volver por defecto:
      router.replace('/');         // primer tab (index.tsx)
      // o: router.replace('/pedidos'); router.replace('/ruta'); router.replace('/videos');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/')}
            hitSlop={{ top: 12, bottom: 22, left: 12, right: 12 }}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color={Colors.light.neutral900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles del Cliente</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando información del cliente...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !cliente) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/')}
            hitSlop={{ top: 12, bottom: 22, left: 12, right: 12 }}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color={Colors.light.neutral900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles del Cliente</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Error al cargar cliente</Text>
          <Text style={styles.errorMessage}>
            {(error as any)?.message || 'Ha ocurrido un error inesperado'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRefresh}
          >
            <Text style={styles.retryButtonText}>Intentar nuevamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/" replace asChild>
          <TouchableOpacity 
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 22, left: 12, right: 12 }}
            >
            <MaterialIcons name="arrow-back-ios" size={20} color={Colors.light.neutral900} />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>Detalles del Cliente</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={handleRefresh}
            colors={['#ea2a33']}
            tintColor="#ea2a33"
          />
        }
      >
        {/* Client Profile */}
        <View style={styles.profileSection}>
          <View 
            style={[styles.profileImage, { backgroundColor: getAvatarColor(cliente.nombre) }]}
          >
            <Text style={styles.profileInitials}>
              {getInitials(cliente.nombre)}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.clientName}>{cliente.nombre}</Text>
            <Text style={styles.clientInstitution}>{cliente.ciudad}, {cliente.pais}</Text>
            <Text style={styles.clientId}>{cliente.codigo_unico}</Text>
            {!cliente.activo && (
              <View style={styles.inactiveTag}>
                <Text style={styles.inactiveText}>Inactivo</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.contactItem}>
            <MaterialIcons name="location-on" size={20} color={Colors.light.neutral500} style={styles.contactIcon} />
            <View>
              <Text style={styles.contactLabel}>Dirección</Text>
              <Text style={styles.contactValue}>{cliente.direccion}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialIcons name="phone" size={20} color={Colors.light.neutral500} style={styles.contactIcon} />
            <View>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>{cliente.telefono}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialIcons name="email" size={20} color={Colors.light.neutral500} style={styles.contactIcon} />
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{cliente.email}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialIcons name="business" size={20} color={Colors.light.neutral500} style={styles.contactIcon} />
            <View>
              <Text style={styles.contactLabel}>NIT</Text>
              <Text style={styles.contactValue}>{cliente.nit}</Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        {historico?.estadisticas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estadísticas</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{historico.estadisticas.total_compras}</Text>
                <Text style={styles.statLabel}>Compras</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatCurrency(historico.estadisticas.valor_total_compras)}</Text>
                <Text style={styles.statLabel}>Total Comprado</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatCurrency(historico.estadisticas.promedio_orden)}</Text>
                <Text style={styles.statLabel}>Promedio por Orden</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{historico.estadisticas.total_devoluciones}</Text>
                <Text style={styles.statLabel}>Devoluciones</Text>
              </View>
            </View>
          </View>
        )}

        {/* Purchase History */}
        {historico?.historico_compras && historico.historico_compras.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico de Compras</Text>
            
            {historico.historico_compras.map((compra, index) => (
              <TouchableOpacity key={compra.id || index} style={styles.historyItem}>
                <View style={[styles.historyIcon, { backgroundColor: '#22c55e20' }]}>
                  <MaterialIcons name="shopping-cart" size={20} color="#22c55e" />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>Compra #{compra.id}</Text>
                  <Text style={styles.historyDate}>{formatDate(compra.fecha)}</Text>
                  <Text style={styles.historyAmount}>{formatCurrency(compra.total)}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={16} color={Colors.light.neutral400} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Returns */}
        {historico?.devoluciones && historico.devoluciones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Devoluciones</Text>
            
            {historico.devoluciones.map((devolucion, index) => (
              <TouchableOpacity key={devolucion.id || index} style={styles.historyItem}>
                <View style={[styles.historyIcon, { backgroundColor: '#ef444420' }]}>
                  <MaterialIcons name="assignment-return" size={20} color="#ef4444" />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>Devolución #{devolucion.id}</Text>
                  <Text style={styles.historyDate}>{formatDate(devolucion.fecha)}</Text>
                  <Text style={styles.historyAmount}>{formatCurrency(devolucion.valor)}</Text>
                  <Text style={styles.returnReason}>{devolucion.motivo}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={16} color={Colors.light.neutral400} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Preferred Products */}
        {historico?.productos_preferidos && historico.productos_preferidos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos Preferidos</Text>
            
            {historico.productos_preferidos.map((producto, index) => (
              <View key={producto.producto_id || index} style={styles.productItem}>
                <View style={[styles.historyIcon, { backgroundColor: '#3b82f620' }]}>
                  <MaterialIcons name="favorite" size={20} color="#3b82f6" />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{producto.nombre}</Text>
                  <Text style={styles.historyDate}>Frecuencia: {producto.frecuencia} veces</Text>
                  <Text style={styles.historyDate}>Última compra: {formatDate(producto.ultima_compra)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.footerActions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push({
              pathname: '/visita/registrar' as any,
              params: { 
                clienteId: cliente?.id?.toString() || clienteId, // Usar el ID numérico del cliente
                clienteData: JSON.stringify(cliente)
              }
            })}
          >
            <MaterialIcons name="add-comment" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Registrar Visita</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push({
              pathname: '/pedido/catalogo' as any,
              params: { clienteId: clienteId }
            })}
          >
            <MaterialIcons name="add-shopping-cart" size={20} color={Colors.light.neutral800} />
            <Text style={styles.secondaryButtonText}>Crear Pedido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.neutral100,
  },
  header: {
    position: 'relative',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    position: 'absolute',
  left: 0,
  right: 0,
  textAlign: 'center',
  fontSize: 20,
  fontWeight: 'bold',
  color: Colors.light.neutral900,
  // clave:
  pointerEvents: 'none',
  },
  headerSpacer: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.neutral500,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.light.neutral500,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.light.primary500,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    alignItems: 'center',
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    marginBottom: 4,
  },
  clientInstitution: {
    fontSize: 18,
    color: Colors.light.neutral500,
    marginBottom: 4,
  },
  clientId: {
    fontSize: 14,
    color: Colors.light.neutral500,
  },
  inactiveTag: {
    backgroundColor: '#ef444420',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  inactiveText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.neutral900,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.neutral500,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: Colors.light.neutral800,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.light.neutral100,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.neutral500,
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.neutral100,
    borderRadius: 8,
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.neutral100,
    borderRadius: 8,
    marginBottom: 16,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.neutral900,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 14,
    color: Colors.light.neutral500,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.neutral800,
    marginTop: 2,
  },
  returnReason: {
    fontSize: 12,
    color: Colors.light.neutral400,
    marginTop: 2,
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: Colors.light.neutral200,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary500,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.neutral200,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: Colors.light.neutral800,
    fontSize: 16,
    fontWeight: 'bold',
  },
});