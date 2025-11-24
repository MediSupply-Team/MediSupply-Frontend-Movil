# Sistema de Autenticación - MediSupply Mobile

## Descripción General

Sistema completo de autenticación para la aplicación móvil de clientes de MediSupply, implementado con React Native, Expo Router, Zustand y AsyncStorage.

## Arquitectura

### Flujo de Registro
1. Usuario completa formulario en `/register`
2. Se llama a `POST /cliente/api/v1/client/` para crear el cliente
3. Automáticamente se llama a `POST /venta/auth/register` para crear el usuario
4. Usuario es redirigido a `/login` con mensaje de éxito

### Flujo de Login
1. Usuario ingresa credenciales en `/login`
2. Se llama a `POST /venta/auth/login`
3. Tokens y datos de usuario se guardan en Zustand + AsyncStorage
4. Usuario es redirigido a la app principal `/(tabs)`

### Persistencia de Sesión
- Los tokens se guardan automáticamente en AsyncStorage mediante Zustand persist middleware
- Al iniciar la app, se restaura el estado de autenticación
- El token se incluye automáticamente en todas las peticiones mediante interceptores de Axios

## Archivos Creados

### Componentes (`components/AuthGuard.tsx`)
- `AuthGuard`: Componente que protege rutas requiriendo autenticación
- Redirige automáticamente a `/login` si el usuario no está autenticado
- Muestra loading mientras verifica el estado de autenticación
- Se aplica en el layout de tabs para proteger toda la aplicación

### Tipos (`types/auth.ts`)
- `User`: Información del usuario autenticado
- `AuthResponse`: Respuesta de login/register con tokens
- `LoginCredentials`: Datos para login
- `RegisterData`: Datos para registro de cliente
- `ClientData`: Respuesta de creación de cliente
- `RegisterUserData`: Datos para activación de usuario

### Servicios (`services/authApi.ts`)
- `authApi`: Cliente Axios para backend de autenticación (venta)
- `clienteApi`: Cliente Axios para backend de clientes
- `login()`: Inicia sesión
- `registerClient()`: Registra cliente (paso 1)
- `registerUser()`: Activa usuario (paso 2)
- `registerComplete()`: Proceso completo de registro
- `setAuthToken()`: Actualiza tokens en interceptores

### Store (`store/authStore.ts`)
Estado global de autenticación con Zustand:
- `user`: Usuario actual
- `token`: JWT access token
- `refreshToken`: JWT refresh token
- `isAuthenticated`: Estado de autenticación
- `isLoading`: Estado de carga
- `setAuth()`: Establecer autenticación
- `logout()`: Cerrar sesión
- `updateUser()`: Actualizar datos de usuario
- `initialize()`: Inicializar desde AsyncStorage

### Pantallas

#### `/login` (`app/login.tsx`)
- Formulario de inicio de sesión
- Validación de credenciales
- Navegación a registro
- Recuperación de contraseña (placeholder)

#### `/register` (`app/register.tsx`)
- Formulario completo de registro institucional
- Campos: NIT, nombre, email, contraseña, teléfono, dirección, ciudad, país
- Validaciones de formulario
- Proceso de registro en 2 pasos (cliente + usuario)
- Redirección a login tras éxito

#### `/perfil` (`app/(tabs)/perfil.tsx`)
- Vista de perfil para usuario autenticado
- **Información completa del usuario:**
  - Avatar con iniciales o icono
  - Nombre completo y email
  - Badge con rol (Cliente)
  - ID de usuario
  - ID de cliente (UUID completo)
  - Lista de permisos con íconos
  - IDs adicionales (venta_id, hospital_id) si existen
- Secciones organizadas por tarjetas
- Opciones de configuración, notificaciones, ayuda
- Botón de cerrar sesión con confirmación
- Vista de no autenticado con navegación a login/registro (como fallback)

### Layout

#### Tabs Layout (`app/(tabs)/_layout.tsx`)
- Protegido con `AuthGuard`
- Todos los tabs requieren autenticación
- Redirección automática a login si no está autenticado
- Inicializa auth store al montar la app
- Registra rutas de login y register en Stack navigator

### Protección de Rutas
- **AuthGuard** en layout de tabs protege toda la aplicación
- Verificación automática de autenticación en cada render
- Redirección inmediata a `/login` si no hay sesión activa
- Loading state mientras se verifica autenticación

### Interceptores de API
Los tokens se configuran automáticamente en:
- `authApi` (backend de venta)
- `clienteApi` (backend de cliente)
- `ordersApi` (backend de órdenes)
- `catalogApi` (backend de catálogo)

## Endpoints del Backend

### Registro
1. **Crear Cliente**
   - `POST https://medisupply-backend.duckdns.org/cliente/api/v1/client/`
   - Body: `RegisterData`
   - Response: `ClientData` (incluye `id` del cliente)

2. **Activar Usuario**
   - `POST https://medisupply-backend.duckdns.org/venta/auth/register`
   - Body: `RegisterUserData` (incluye `cliente_id` del paso 1)
   - Response: `AuthResponse` (tokens + usuario)

### Login
- `POST https://medisupply-backend.duckdns.org/venta/auth/login`
- Body: `LoginCredentials`
- Response: `AuthResponse` (tokens + usuario)

## Uso en la App

### Verificar Autenticación
```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Text>No autenticado</Text>;
  }
  
  return <Text>Bienvenido {user?.name}</Text>;
}
```

### Logout
```typescript
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  
  const handleLogout = () => {
    logout();
    router.replace('/login');
  };
  
  return <Button onPress={handleLogout}>Cerrar Sesión</Button>;
}
```

### Peticiones Autenticadas
Los tokens se incluyen automáticamente en todas las peticiones. No se requiere configuración adicional:

```typescript
// El token se incluye automáticamente
const response = await ordersApi.get('/api/v1/orders');
```

## Seguridad

### Tokens
- **Access Token**: JWT de corta duración para autenticación de peticiones
- **Refresh Token**: JWT de larga duración para renovar access token
- Almacenados en AsyncStorage (encriptado por el SO)

### Validaciones
- Validación de email (formato)
- Contraseña mínima de 8 caracteres
- Confirmación de contraseña en registro
- Campos requeridos validados antes de enviar

### Interceptores
- Logging de peticiones en desarrollo (`__DEV__`)
- Manejo de errores con mensajes amigables
- Headers de autorización configurados automáticamente

## Próximos Pasos

1. **Refresh Token**: Implementar renovación automática de access token
2. **Recuperación de Contraseña**: Implementar flujo de reset de contraseña
3. **Protección de Rutas**: Guard para proteger rutas que requieren autenticación
4. **Biometría**: Implementar login con huella/Face ID
5. **Offline First**: Manejo de sesión sin conexión
