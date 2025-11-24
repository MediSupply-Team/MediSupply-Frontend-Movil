import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/auth';
import { setAuthToken } from '@/services/authApi';

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Acciones
  setAuth: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'medisupply-auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      // Establecer autenticación
      setAuth: (user, token, refreshToken) => {
        setAuthToken(token);
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // Cerrar sesión
      logout: () => {
        setAuthToken(null);
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Actualizar información del usuario
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      // Establecer estado de carga
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Inicializar (restaurar token de AsyncStorage)
      initialize: async () => {
        try {
          set({ isLoading: true });
          const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
          
          if (storedAuth) {
            const { token } = JSON.parse(storedAuth);
            if (token) {
              setAuthToken(token);
            }
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
