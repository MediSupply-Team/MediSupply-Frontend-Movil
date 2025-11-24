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
import { login } from '@/services/authApi';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingrese su email y contraseña');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Por favor ingrese un email válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ email: email.trim(), password });
      
      // Guardar en el store
      setAuth(response.user, response.token, response.refresh_token);

      // Navegar a la pantalla principal
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'No se pudo iniciar sesión. Verifique sus credenciales.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuario no encontrado';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Error de conexión. Verifique su internet.';
      }

      Alert.alert('Error de inicio de sesión', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <StatusBar style="dark" />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="flex-grow"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-6 py-8">
              {/* Contenido centrado */}
              <View className="flex-1 justify-center">
                {/* Logo y título */}
                <View className="items-center mb-12">
                  <View className="bg-[#ea2a33] w-20 h-20 rounded-full items-center justify-center mb-6">
                    <Ionicons name="medical" size={48} color="white" />
                  </View>
                  <Text className="text-gray-900 text-3xl font-bold tracking-tight">
                    MediSupply
                  </Text>
                  <Text className="text-gray-500 mt-2">
                    Portal de vendedores
                  </Text>
                </View>

                {/* Formulario */}
                <View className="space-y-6">
                  {/* Email Input */}
                  <View className="relative mb-4">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Ionicons name="person" size={20} color="#617c89" />
                    </View>
                    <TextInput
                      className="w-full rounded-xl bg-[#f0f3f4] h-14 pl-12 pr-4 text-gray-900"
                      placeholder="Correo electrónico"
                      placeholderTextColor="#617c89"
                      value={email}
                      onChangeText={(text) => setEmail(text.toLowerCase())}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      editable={!isLoading}
                    />
                  </View>

                  {/* Password Input */}
                  <View className="relative mb-2">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Ionicons name="lock-closed" size={20} color="#617c89" />
                    </View>
                    <TextInput
                      className="w-full rounded-xl bg-[#f0f3f4] h-14 pl-12 pr-12 text-gray-900"
                      placeholder="Contraseña"
                      placeholderTextColor="#617c89"
                      value={password}
                      onChangeText={setPassword}
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
                        color="#617c89"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botón de login */}
                <View className="mt-8">
                  <TouchableOpacity
                    className="w-full h-14 rounded-xl bg-[#ea2a33] items-center justify-center shadow-md"
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-lg font-bold">
                        Iniciar Sesión
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Enlace olvidó contraseña */}
                <View className="items-center mt-6">
                  <TouchableOpacity disabled={isLoading}>
                    <Text className="text-[#ea2a33] text-sm font-medium">
                      ¿Olvidó su contraseña?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
