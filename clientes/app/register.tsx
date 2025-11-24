import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerComplete } from '@/services/authApi';
import type { RegisterData } from '@/types/auth';

export default function RegisterScreen() {
  const [formData, setFormData] = useState<RegisterData>({
    nit: '',
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'CO',
    activo: true,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field: keyof RegisterData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    // Validar campos requeridos con reglas específicas del backend
    if (!formData.nit.trim()) {
      Alert.alert('Error', 'El NIT es requerido');
      return false;
    }
    if (formData.nit.trim().length < 5) {
      Alert.alert('Error', 'El NIT debe tener al menos 5 caracteres');
      return false;
    }
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre de la institución es requerido');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Ingrese un email válido');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (formData.password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    if (!formData.telefono.trim()) {
      Alert.alert('Error', 'El teléfono es requerido');
      return false;
    }
    if (!formData.direccion.trim()) {
      Alert.alert('Error', 'La dirección es requerida');
      return false;
    }
    if (!formData.ciudad.trim()) {
      Alert.alert('Error', 'La ciudad es requerida');
      return false;
    }
    if (!formData.pais.trim()) {
      Alert.alert('Error', 'El país es requerido');
      return false;
    }
    if (formData.pais.trim().length !== 2) {
      Alert.alert('Error', 'El código de país debe tener 2 caracteres (ej: CO)');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    console.log('🎯 [REGISTER SCREEN] Iniciando registro de cliente...');
    console.log('📋 [REGISTER SCREEN] Form Data:', JSON.stringify(formData, null, 2));

    setIsLoading(true);

    try {
      // Proceso completo de registro (cliente + usuario)
      console.log('🔄 [REGISTER SCREEN] Llamando a registerComplete...');
      await registerComplete(formData);

      console.log('✅ [REGISTER SCREEN] Registro completado exitosamente');

      // Mostrar mensaje de éxito
      Alert.alert(
        '¡Registro exitoso!',
        'Su cuenta ha sido creada correctamente. Por favor inicie sesión.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login' as any),
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ [REGISTER SCREEN] Register error:', error);
      console.error('❌ [REGISTER SCREEN] Error response:', JSON.stringify(error.response?.data, null, 2));

      let errorMessage = 'No se pudo completar el registro. Intente nuevamente.';

      if (error.response?.status === 400) {
        errorMessage = 'Los datos ingresados no son válidos';
      } else if (error.response?.status === 409) {
        errorMessage = 'El email o NIT ya están registrados';
      } else if (error.response?.status === 422) {
        // Error de validación - extraer mensajes amigables
        const details = error.response?.data?.details?.detail || error.response?.data?.detail;
        if (details && Array.isArray(details) && details.length > 0) {
          // Extraer el primer mensaje de error
          const firstError = details[0];
          const fieldName = firstError.loc?.[firstError.loc.length - 1] || 'campo';
          const fieldNameES: { [key: string]: string } = {
            nit: 'NIT',
            nombre: 'Nombre',
            email: 'Email',
            password: 'Contraseña',
            telefono: 'Teléfono',
            direccion: 'Dirección',
            ciudad: 'Ciudad',
            pais: 'País',
          };
          const fieldTranslated = fieldNameES[fieldName] || fieldName;
          errorMessage = `${fieldTranslated}: ${firstError.msg}`;
          
          console.error('❌ [REGISTER SCREEN] Validation details:', JSON.stringify(details, null, 2));
        } else {
          errorMessage = 'Error de validación. Verifique que todos los campos sean correctos.';
        }
      } else if (error.message === 'Network Error') {
        errorMessage = 'Error de conexión. Verifique su internet.';
      }

      Alert.alert('Error de registro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <StatusBar style="dark" />

        {/* Header */}
        <View className="bg-white shadow-sm">
          <View className="flex-row items-center px-4 py-3">
            <TouchableOpacity
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-bold text-gray-800 pr-8">
              Registro de Institución
            </Text>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 p-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Información de la Institución */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-700 mb-4">
                Información de la Institución
              </Text>
              
              <View className="space-y-4">
                <View className="mb-3">
                  <TextInput
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                    placeholder="NIT (mínimo 5 caracteres) *"
                    placeholderTextColor="#9ca3af"
                    value={formData.nit}
                    onChangeText={(text) => updateField('nit', text)}
                    editable={!isLoading}
                  />
                </View>

                <View className="mb-3">
                  <TextInput
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                    placeholder="Nombre de la Institución *"
                    placeholderTextColor="#9ca3af"
                    value={formData.nombre}
                    onChangeText={(text) => updateField('nombre', text)}
                    editable={!isLoading}
                  />
                </View>

                <View className="mb-3">
                  <TextInput
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                    placeholder="Dirección *"
                    placeholderTextColor="#9ca3af"
                    value={formData.direccion}
                    onChangeText={(text) => updateField('direccion', text)}
                    editable={!isLoading}
                  />
                </View>

                <View className="mb-3">
                  <TextInput
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                    placeholder="Ciudad *"
                    placeholderTextColor="#9ca3af"
                    value={formData.ciudad}
                    onChangeText={(text) => updateField('ciudad', text)}
                    editable={!isLoading}
                  />
                </View>

                <View className="mb-3">
                  <TextInput
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                    placeholder="País (ej: CO) *"
                    placeholderTextColor="#9ca3af"
                    value={formData.pais}
                    onChangeText={(text) => updateField('pais', text.toUpperCase())}
                    editable={!isLoading}
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                </View>
              </View>
            </View>

            {/* Información de Contacto */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-700 mb-4">
                Información de Contacto
              </Text>

              <View className="space-y-4">
                <View className="mb-3">
                  <TextInput
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                    placeholder="Teléfono *"
                    placeholderTextColor="#9ca3af"
                    value={formData.telefono}
                    onChangeText={(text) => updateField('telefono', text)}
                    keyboardType="phone-pad"
                    editable={!isLoading}
                  />
                </View>

                <View className="mb-3">
                  <TextInput
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-base text-gray-900"
                    placeholder="Correo Electrónico *"
                    placeholderTextColor="#9ca3af"
                    value={formData.email}
                    onChangeText={(text) => updateField('email', text.toLowerCase())}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!isLoading}
                  />
                </View>
              </View>
            </View>

            {/* Seguridad */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-700 mb-4">
                Seguridad
              </Text>

              <View className="space-y-4">
                {/* Password Input */}
                <View className="relative mb-3">
                  <TextInput
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pr-12 text-base text-gray-900"
                    placeholder="Contraseña (mínimo 8 caracteres) *"
                    placeholderTextColor="#9ca3af"
                    value={formData.password}
                    onChangeText={(text) => updateField('password', text)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View className="relative mb-3">
                  <TextInput
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pr-12 text-base text-gray-900"
                    placeholder="Confirmar Contraseña *"
                    placeholderTextColor="#9ca3af"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Espacio para el botón fijo */}
            <View className="h-24" />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer - Botón de registro */}
        <View className="sticky bottom-0 bg-white p-4 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
          <TouchableOpacity
            className="w-full rounded-xl bg-[#1193d4] py-4 items-center justify-center shadow-lg"
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-bold">
                Enviar Solicitud
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
