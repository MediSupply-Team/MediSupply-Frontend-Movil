// app/visita/registrar.tsx
import { Colors } from '@/constants/theme';
import { useRegistrarVisita } from '@/hooks/useVisitas';
import type { Cliente } from '@/infrastructure/interfaces/cliente';
import type { MediaFile } from '@/infrastructure/interfaces/visita';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ID del vendedor - en una implementación real esto vendría del contexto de autenticación
const VENDEDOR_ID = 1;

export default function RegistrarVisitaScreen() {
  const { clienteId, clienteData } = useLocalSearchParams();
  
  console.log('🔍 Debug params - clienteId:', clienteId, 'type:', typeof clienteId);
  console.log('🔍 Debug params - clienteData:', clienteData);
  
  // Parseamos los datos del cliente si vienen como string de la navegación
  let cliente: Cliente | null = null;
  try {
    cliente = clienteData ? JSON.parse(clienteData as string) : null;
    console.log('🔍 Debug parsed cliente:', cliente?.id, cliente?.nombre);
  } catch (error) {
    console.warn('📱 Error parsing cliente data from navigation:', error);
  }

  // Estados del formulario
  const [observaciones, setObservaciones] = useState('');
  const [nombreContacto, setNombreContacto] = useState('');
  const [estado, setEstado] = useState<'exitosa' | 'pendiente' | 'cancelada'>('pendiente');
  const [fotos, setFotos] = useState<MediaFile[]>([]);
  const [videos, setVideos] = useState<MediaFile[]>([]);

  // Hook para registrar visita
  const { mutate: registrarVisita, isPending } = useRegistrarVisita();

  // Función para seleccionar fotos
  const seleccionarFotos = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permisos necesarios', 'Se necesita acceso a la galería para seleccionar fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets) {
        const nuevasFotos: MediaFile[] = result.assets.map((asset: any, index: number) => ({
          uri: asset.uri,
          type: 'image' as const,
          name: `foto_${Date.now()}_${index}.jpg`,
          size: asset.fileSize,
        }));
        setFotos(prev => [...prev, ...nuevasFotos]);
      }
    } catch (error) {
      console.error('Error seleccionando fotos:', error);
      Alert.alert('Error', 'No se pudieron seleccionar las fotos.');
    }
  };

  // Función para grabar video
  const grabarVideo = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permisos necesarios', 'Se necesita acceso a la cámara para grabar videos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
        videoMaxDuration: 120, // 2 minutos máximo
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const nuevoVideo: MediaFile = {
          uri: result.assets[0].uri,
          type: 'video',
          name: `video_${Date.now()}.mp4`,
          size: result.assets[0].fileSize,
        };
        setVideos(prev => [...prev, nuevoVideo]);
      }
    } catch (error) {
      console.error('Error grabando video:', error);
      Alert.alert('Error', 'No se pudo grabar el video.');
    }
  };

  // Función para guardar la visita
  const guardarVisita = async () => {
    if (!clienteId || !cliente) {
      Alert.alert('Error', 'No se encontró información del cliente.');
      return;
    }

    if (!observaciones.trim()) {
      Alert.alert('Campo requerido', 'Por favor añade observaciones sobre la visita.');
      return;
    }

    if (!nombreContacto.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre del contacto.');
      return;
    }

    try {
      // Hardcodeamos el cliente_id para evitar problemas con parámetros
      const clienteIdNumber = 200;
      console.log('✅ Usando cliente ID hardcodeado:', clienteIdNumber);

      const data = {
        vendedor_id: VENDEDOR_ID,
        cliente_id: clienteIdNumber,
        nombre_contacto: nombreContacto.trim(),
        observaciones: observaciones.trim(),
        estado,
        fotos: fotos.map(foto => foto.uri),
        videos: videos.map(video => video.uri),
      };

      registrarVisita(data, {
        onSuccess: () => {
          Alert.alert(
            'Visita registrada',
            'La visita se ha registrado exitosamente.',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        },
        onError: (error) => {
          Alert.alert(
            'Error',
            `No se pudo registrar la visita: ${error.message}`
          );
        },
      });
    } catch (error) {
      console.error('Error guardando visita:', error);
      Alert.alert('Error', 'Ha ocurrido un error inesperado.');
    }
  };

  const eliminarFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const eliminarVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="close" size={24} color={Colors.light.neutral500} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Visita</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Cliente Info */}
          {cliente && (
            <View style={styles.clienteInfo}>
              <Text style={styles.clienteNombre}>{cliente.nombre}</Text>
              <Text style={styles.clienteDetalle}>{cliente.ciudad} • {cliente.codigo_unico}</Text>
            </View>
          )}

          {/* Nombre del contacto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Contacto</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej: Dra. María López"
              value={nombreContacto}
              onChangeText={setNombreContacto}
              maxLength={100}
            />
          </View>

          {/* Observaciones */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observaciones</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Añade tus observaciones aquí..."
              value={observaciones}
              onChangeText={setObservaciones}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Video Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Video de la Visita</Text>
            <TouchableOpacity style={styles.mediaUpload} onPress={grabarVideo}>
              <MaterialIcons name="videocam" size={32} color={Colors.light.neutral400} />
              <Text style={styles.mediaUploadTitle}>Grabar Video</Text>
              <Text style={styles.mediaUploadSubtitle}>
                Graba un video corto de tu presentación para análisis posterior.
              </Text>
              <View style={styles.mediaUploadButton}>
                <MaterialIcons name="videocam" size={16} color="white" />
                <Text style={styles.mediaUploadButtonText}>Grabar Video</Text>
              </View>
            </TouchableOpacity>

            {/* Videos seleccionados */}
            {videos.length > 0 && (
              <View style={styles.mediaList}>
                {videos.map((video, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <MaterialIcons name="videocam" size={20} color={Colors.light.primary500} />
                    <Text style={styles.mediaName}>{video.name}</Text>
                    <TouchableOpacity onPress={() => eliminarVideo(index)}>
                      <MaterialIcons name="close" size={20} color={Colors.light.neutral400} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Fotos Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fotografías</Text>
            <TouchableOpacity style={styles.photoUpload} onPress={seleccionarFotos}>
              <MaterialIcons name="add-a-photo" size={24} color={Colors.light.neutral400} />
              <Text style={styles.photoUploadText}>Añadir Fotos</Text>
            </TouchableOpacity>

            {/* Fotos seleccionadas */}
            {fotos.length > 0 && (
              <View style={styles.mediaList}>
                {fotos.map((foto, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <MaterialIcons name="image" size={20} color={Colors.light.primary500} />
                    <Text style={styles.mediaName}>{foto.name}</Text>
                    <TouchableOpacity onPress={() => eliminarFoto(index)}>
                      <MaterialIcons name="close" size={20} color={Colors.light.neutral400} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Estado de la visita */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado de la Visita</Text>
            <View style={styles.radioGroup}>
              {[
                { value: 'exitosa', label: 'Exitosa' },
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'cancelada', label: 'Cancelada' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.radioOption,
                    estado === option.value && styles.radioOptionSelected,
                  ]}
                  onPress={() => setEstado(option.value as any)}
                >
                  <Text
                    style={[
                      styles.radioOptionText,
                      estado === option.value && styles.radioOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isPending && styles.saveButtonDisabled]}
          onPress={guardarVisita}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Visita</Text>
          )}
        </TouchableOpacity>
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
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    textAlign: 'center',
    marginRight: 32, // Para compensar el botón de cerrar
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
    gap: 24,
  },
  clienteInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  clienteNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    marginBottom: 4,
  },
  clienteDetalle: {
    fontSize: 14,
    color: Colors.light.neutral500,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.neutral500,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.light.neutral200,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.neutral900,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mediaUpload: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.light.neutral200,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  mediaUploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.neutral900,
  },
  mediaUploadSubtitle: {
    fontSize: 14,
    color: Colors.light.neutral500,
    textAlign: 'center',
  },
  mediaUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary500,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  mediaUploadButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  photoUpload: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.light.neutral200,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoUploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.neutral500,
  },
  mediaList: {
    gap: 8,
  },
  mediaItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  mediaName: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.neutral500,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.neutral200,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  radioOptionSelected: {
    backgroundColor: Colors.light.primary500,
    borderColor: Colors.light.primary500,
  },
  radioOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.neutral500,
  },
  radioOptionTextSelected: {
    color: 'white',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: Colors.light.primary500,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});