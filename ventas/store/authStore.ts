import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface VendorUser {
  id: number;
  email: string;
  name: string | null;
  role: 'SELLER';
  permissions: string[];
  cliente_id: null;
  venta_id: string;
}

interface AuthState {
  // Estado
  user: VendorUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Acciones
  setAuth: (user: VendorUser, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<VendorUser>) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'medisupply-vendor-auth';

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
              // Token válido, mantener sesión
              set({ isLoading: false });
              return;
            }
          }
          
          // No hay sesión guardada
          set({ isLoading: false, isAuthenticated: false });
        } catch (error) {
          console.error('Error al inicializar auth:', error);
          set({ isLoading: false, isAuthenticated: false });
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
