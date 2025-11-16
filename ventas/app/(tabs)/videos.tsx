import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/theme';
import { useVisitas, useIniciarAnalisisVideos, useObtenerAnalisisVideos } from '@/hooks/useVisitas';
import type { VisitaListItem, VideoAnalysis } from '@/infrastructure/interfaces/visita';

export default function VisitasScreen() {
  const { data: visitas, isLoading, isError, error, refetch } = useVisitas();
  const { mutate: iniciarAnalisis, isPending: isIniciandoAnalisis } = useIniciarAnalisisVideos();
  
  const [visitaAnalisisActiva, setVisitaAnalisisActiva] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [analisisIniciados, setAnalisisIniciados] = useState<Set<number>>(new Set());
  
  // Hook para obtener análisis (solo se ejecuta cuando visitaAnalisisActiva está definida)
  const { data: analisis, isLoading: isLoadingAnalisis } = useObtenerAnalisisVideos(
    visitaAnalisisActiva || 0,
    visitaAnalisisActiva !== null && modalVisible
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'exitosa':
        return '#22c55e';
      case 'pendiente':
        return '#f59e0b';
      case 'cancelada':
        return '#ef4444';
      default:
        return Colors.light.neutral500;
    }
  };

  const getEstadoIcon = (estado: string): keyof typeof MaterialIcons.glyphMap => {
    switch (estado) {
      case 'exitosa':
        return 'check-circle';
      case 'pendiente':
        return 'schedule';
      case 'cancelada':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const handleIniciarAnalisis = (visitaId: number) => {
    iniciarAnalisis(visitaId, {
      onSuccess: () => {
        setAnalisisIniciados(prev => new Set(prev).add(visitaId));
        Alert.alert('Éxito', 'El análisis de video ha sido iniciado');
      },
      onError: (error) => {
        Alert.alert('Error', `No se pudo iniciar el análisis: ${error.message}`);
      },
    });
  };

  const handleVerRecomendacion = (visitaId: number) => {
    setVisitaAnalisisActiva(visitaId);
    setModalVisible(true);
  };

  const renderVisita = ({ item }: { item: VisitaListItem }) => {
    const tieneAnalisisIniciado = analisisIniciados.has(item.id);
    
    return (
    <View style={styles.visitaCard}>
      <View style={styles.visitaHeader}>
        <View style={[styles.estadoBadge, { backgroundColor: `${getEstadoColor(item.estado)}20` }]}>
          <MaterialIcons 
            name={getEstadoIcon(item.estado)} 
            size={16} 
            color={getEstadoColor(item.estado)} 
          />
          <Text style={[styles.estadoText, { color: getEstadoColor(item.estado) }]}>
            {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
          </Text>
        </View>
        <Text style={styles.visitaId}>#{item.id}</Text>
      </View>

      <View style={styles.visitaContent}>
        <Text style={styles.contactoNombre}>{item.nombre_contacto}</Text>
        <Text style={styles.observaciones} numberOfLines={2}>
          {item.observaciones}
        </Text>

        <View style={styles.visitaDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="event" size={14} color={Colors.light.neutral500} />
            <Text style={styles.detailText}>{formatDate(item.fecha_visita)}</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="business" size={14} color={Colors.light.neutral500} />
            <Text style={styles.detailText}>Cliente #{item.cliente_id}</Text>
          </View>
        </View>

        <View style={styles.mediaInfo}>
          {item.cantidad_hallazgos > 0 && (
            <View style={styles.mediaTag}>
              <MaterialIcons name="image" size={14} color={Colors.light.primary500} />
              <Text style={styles.mediaTagText}>{item.cantidad_hallazgos} foto{item.cantidad_hallazgos !== 1 ? 's' : ''}</Text>
            </View>
          )}
          {item.cantidad_videos > 0 && (
            <View style={styles.mediaTag}>
              <MaterialIcons name="videocam" size={14} color={Colors.light.primary500} />
              <Text style={styles.mediaTagText}>{item.cantidad_videos} video{item.cantidad_videos !== 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>

        {/* Botón de análisis de video */}
        {item.cantidad_videos > 0 && (
          <TouchableOpacity
            style={[
              styles.analisisButton,
              tieneAnalisisIniciado && styles.analisisButtonIniciado
            ]}
            onPress={() => tieneAnalisisIniciado ? handleVerRecomendacion(item.id) : handleIniciarAnalisis(item.id)}
            disabled={isIniciandoAnalisis}
          >
            {isIniciandoAnalisis ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <MaterialIcons 
                  name={tieneAnalisisIniciado ? "visibility" : "play-circle-outline"} 
                  size={18} 
                  color="white" 
                />
                <Text style={styles.analisisButtonText}>
                  {tieneAnalisisIniciado ? "Ver Recomendación" : "Iniciar Procesamiento"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Visitas</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.light.primary500} />
          <Text style={styles.loadingText}>Cargando visitas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Visitas</Text>
        </View>
        <View style={styles.centerContent}>
          <MaterialIcons name="error-outline" size={64} color="#ef4444" />
          <Text style={styles.errorTitle}>Error al cargar visitas</Text>
          <Text style={styles.errorMessage}>
            {(error as any)?.message || 'Ha ocurrido un error inesperado'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitas</Text>
        {visitas && visitas.length > 0 && (
          <Text style={styles.headerSubtitle}>{visitas.length} visita{visitas.length !== 1 ? 's' : ''} registrada{visitas.length !== 1 ? 's' : ''}</Text>
        )}
      </View>
      
      {!visitas || visitas.length === 0 ? (
        <View style={styles.centerContent}>
          <MaterialIcons name="assignment" size={64} color={Colors.light.neutral400} />
          <Text style={styles.emptyTitle}>No hay visitas registradas</Text>
          <Text style={styles.emptySubtitle}>
            Las visitas que registres aparecerán aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={visitas}
          renderItem={renderVisita}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[Colors.light.primary500]}
              tintColor={Colors.light.primary500}
            />
          }
        />
      )}

      {/* Modal de recomendaciones */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Recomendaciones del Análisis</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color={Colors.light.neutral900} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {isLoadingAnalisis ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color={Colors.light.primary500} />
                <Text style={styles.modalLoadingText}>Cargando análisis...</Text>
              </View>
            ) : analisis && analisis.length > 0 ? (
              <>
                {analisis.map((item: VideoAnalysis, index: number) => (
                  <View key={index} style={styles.analisisItem}>
                    {/* Estado */}
                    <View style={styles.analisisStatus}>
                      <MaterialIcons 
                        name={item.status === 'completed' ? 'check-circle' : item.status === 'processing' ? 'hourglass-empty' : 'pending'} 
                        size={20} 
                        color={item.status === 'completed' ? '#22c55e' : '#f59e0b'} 
                      />
                      <Text style={styles.analisisStatusText}>
                        Estado: {item.status === 'completed' ? 'Completado' : item.status === 'processing' ? 'Procesando' : 'Pendiente'}
                      </Text>
                    </View>

                    {/* Resumen */}
                    {item.summary && (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📝 Resumen</Text>
                        <Text style={styles.sectionText}>{item.summary}</Text>
                      </View>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🏷️ Etiquetas</Text>
                        <View style={styles.tagsContainer}>
                          {item.tags.map((tag, idx) => (
                            <View key={idx} style={styles.tag}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Recomendaciones */}
                    {item.recommendations && item.recommendations.length > 0 && (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>💡 Recomendaciones de Productos</Text>
                        {item.recommendations.map((rec, idx) => (
                          <View key={idx} style={styles.recommendation}>
                            <MaterialIcons name="check-circle" size={16} color={Colors.light.primary500} />
                            <Text style={styles.recommendationText}>{rec}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Fechas */}
                    <View style={styles.dateInfo}>
                      <Text style={styles.dateText}>Iniciado: {formatDate(item.created_at)}</Text>
                      {item.completed_at && (
                        <Text style={styles.dateText}>Completado: {formatDate(item.completed_at)}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.modalEmpty}>
                <MaterialIcons name="info-outline" size={48} color={Colors.light.neutral400} />
                <Text style={styles.modalEmptyText}>No hay análisis disponibles aún</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.neutral100,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.neutral500,
    textAlign: 'center',
    marginTop: 4,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.neutral500,
    marginTop: 16,
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
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.neutral500,
    textAlign: 'center',
    lineHeight: 24,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  visitaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  visitaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  visitaId: {
    fontSize: 12,
    color: Colors.light.neutral400,
    fontWeight: '500',
  },
  visitaContent: {
    gap: 8,
  },
  contactoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.neutral900,
  },
  observaciones: {
    fontSize: 14,
    color: Colors.light.neutral500,
    lineHeight: 20,
  },
  visitaDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: Colors.light.neutral500,
  },
  mediaInfo: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  mediaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.light.primary500}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  mediaTagText: {
    fontSize: 11,
    color: Colors.light.primary500,
    fontWeight: '500',
  },
  analisisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary500,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  analisisButtonIniciado: {
    backgroundColor: '#22c55e',
  },
  analisisButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.neutral100,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  modalLoadingText: {
    fontSize: 16,
    color: Colors.light.neutral500,
    marginTop: 16,
  },
  modalEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  modalEmptyText: {
    fontSize: 16,
    color: Colors.light.neutral500,
    marginTop: 16,
  },
  analisisItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  analisisStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral200,
  },
  analisisStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.neutral900,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.light.neutral500,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.light.neutral200,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: Colors.light.neutral800,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
    paddingLeft: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.neutral800,
    lineHeight: 20,
  },
  dateInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.neutral200,
  },
  dateText: {
    fontSize: 12,
    color: Colors.light.neutral400,
    marginBottom: 4,
  },
});
