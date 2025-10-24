# Sistema de Cambio de Ambientes - MediSupply Mobile Apps

## 📋 Resumen

Sistema completo implementado que permite cambiar fácilmente entre ambientes locales (Docker Compose), AWS (desarrollo) y Producción para las aplicaciones móviles de MediSupply.

## 🚀 Funcionalidades Implementadas

### ✅ 1. Configuración de Ambientes Automática
- **Local**: Endpoints de Docker Compose (localhost)
- **AWS**: Endpoints de ALB en desarrollo
- **Producción**: Endpoints de producción (configurables)

### ✅ 2. Scripts NPM Integrados

#### App de Clientes
```bash
# Desarrollo
npm run start:local          # Expo con Docker
npm run start:aws           # Expo con AWS

# Android específico
npm run android:local       # Android con Docker
npm run android:aws         # Android con AWS
npm run android:prod        # Android con Producción

# Testing de conectividad
npm run test-endpoints      # Test todos los ambientes
npm run test-endpoints:aws  # Test solo AWS
npm run test-endpoints:local # Test solo Docker
npm run test-endpoints:prod # Test solo Producción
```

#### App de Ventas
```bash
# Mismo conjunto de scripts que clientes
npm run start:local
npm run start:aws
npm run start:prod
npm run android:local
npm run android:aws
npm run android:prod
npm run test-endpoints
npm run test-endpoints:aws
npm run test-endpoints:local
npm run test-endpoints:prod
```

### ✅ 3. Sistema de Configuración Inteligente

**Archivo**: `config/baseUrl.ts`

```typescript
// Funciones principales
getCurrentEnvironment()     // Detecta ambiente actual
getServiceUrl(service)     // URL correcta por ambiente
logEnvironmentInfo()       // Logging detallado
```

**Servicios configurados**:
- BFF Venta
- BFF Cliente  
- Orders Service
- Catalog Service
- Cliente Service
- Rutas Service

### ✅ 4. Testing de Conectividad Automático

**Scripts de testing**: `scripts/test-endpoints.js`

- Verifica conectividad a todos los servicios
- Reportes detallados de salud de endpoints
- Testing específico por ambiente
- Manejo de errores con descripciones claras

### ✅ 5. Logging y Debugging Mejorado

- Interceptores de Axios con logging detallado
- Información de ambiente en cada request
- Debugging de payloads y respuestas
- Identificación clara de errores de red

### ✅ 6. Vistas de Catálogo y Carrito Implementadas

#### App de Ventas - Nuevas Pantallas
- **`/app/pedido/catalogo.tsx`**: Vista de catálogo con búsqueda y categorías
- **`/app/pedido/carrito.tsx`**: Carrito de compras y confirmación de pedidos

#### Funcionalidades del Catálogo
- Búsqueda de productos por nombre
- Filtrado por categorías
- Agregar productos al carrito
- Navegación integrada con tabs

#### Funcionalidades del Carrito
- Visualización de items agregados
- Edición de cantidades
- Cálculo de totales
- Creación de pedidos con formato correcto

### ✅ 7. Estado Global con Zustand

**`store/cartStore.ts`**:
- Gestión del carrito de compras
- Persistencia de items
- Operaciones de agregar/remover/limpiar
- Cálculos automáticos de totales

### ✅ 8. Hooks Personalizados

- **`useCreateOrder`**: Creación de pedidos con formato correcto de API
- **`useCatalogProducts`**: Gestión del catálogo con TanStack Query
- **`useClientes`**: Gestión de clientes (app ventas)
- **`useRutas`**: Gestión de rutas (app ventas)

## 🔧 URLs Configuradas

### Ambiente Local (Docker Compose)
```bash
BFF Venta:      http://localhost:8001
BFF Cliente:    http://localhost:8002
Orders Service: http://localhost:8000
Cliente Service: http://localhost:3003
Catalog Service: http://localhost:3001
Rutas Service:  http://localhost:8003
```

### Ambiente AWS (Desarrollo)
```bash
BFF Venta:  http://medisupply-dev-bff-venta-alb-1773752444.us-east-1.elb.amazonaws.com
BFF Cliente: http://medisupply-dev-bff-cliente-alb-1141787956.us-east-1.elb.amazonaws.com
```

## 🎯 Testing de Conectividad - Estado Actual

### ✅ AWS (Funcionando)
```bash
$ npm run test-endpoints:aws

🧪 Testing AWS environment...
✅ bffVenta: 200 - {"status":"ok"}
✅ bffCliente: 200 - {"status":"ok"}
📊 Resultados AWS: 2/2 exitosos
```

### ✅ Producción (Funcionando)
```bash
$ npm run test-endpoints:prod

🧪 Testing PRODUCTION environment...
✅ bffVenta: 200 - {"status":"ok"}
✅ bffCliente: 200 - {"status":"ok"}
📊 Resultados PRODUCCIÓN: 2/2 exitosos
```

### ⚠️ Local (Docker no ejecutándose)
```bash
$ npm run test-endpoints:local

🧪 Testing LOCAL environment...
❌ Servicios no disponibles (ECONNREFUSED)
📊 Resultados LOCAL: 0/6 exitosos
```

## 🚀 Uso del Sistema

### Para Desarrollo Diario (AWS)
```bash
# Verificar conectividad
npm run test-endpoints:aws

# Ejecutar app con AWS
npm run start:aws

# Android con AWS
npm run android:aws
```

### Para Desarrollo Local (con Docker)
```bash
# Iniciar Docker Compose primero
docker-compose up -d

# Verificar conectividad
npm run test-endpoints:local

# Ejecutar app local
npm run start:local
```

### Para APK con AWS (Deploy)
```bash
# Configurar ambiente
export EXPO_PUBLIC_ENVIRONMENT=aws

# Compilar
expo build:android
# o
eas build --platform android
```

### Para APK de Producción (Deploy Final)
```bash
# Verificar conectividad de producción
npm run test-endpoints:prod

# Configurar ambiente
export EXPO_PUBLIC_ENVIRONMENT=production

# Compilar para producción
expo build:android --release-channel production
# o
eas build --platform android --profile production
```

### Testing Rápido de Producción (Sin APK)
```bash
# Solo para probar endpoints de producción sin compilar
npm run start:prod
npm run android:prod
```

## 📚 Archivos Creados/Modificados

### Configuración
- `clientes/config/baseUrl.ts` - Sistema de URLs por ambiente
- `ventas/config/baseUrl.ts` - Sistema de URLs por ambiente
- `*/package.json` - Scripts npm integrados

### Servicios API
- `clientes/services/catalogApi.ts` - API con ambiente configurable
- `ventas/services/catalogApi.ts` - API con ambiente configurable

### Testing
- `clientes/scripts/test-endpoints.js` - Testing de conectividad
- `ventas/scripts/test-endpoints.js` - Testing de conectividad

### Vistas Nuevas (App Ventas)
- `ventas/app/pedido/catalogo.tsx` - Vista catálogo
- `ventas/app/pedido/carrito.tsx` - Vista carrito

### Estado y Hooks
- `ventas/store/cartStore.ts` - Estado del carrito
- `ventas/hooks/useCreateOrder.ts` - Hook de creación de pedidos

### Documentación
- `clientes/README.md` - Guía completa actualizada
- `ventas/README.md` - Guía completa actualizada

## ✨ Beneficios Logrados

1. **🔄 Cambio de Ambiente Sin Recompilación**: Las apps pueden cambiar de ambiente sin necesidad de recompilar
2. **🧪 Testing de Conectividad**: Verificación automática de endpoints antes de desarrollo
3. **📱 Desarrollo Ágil**: Scripts npm fáciles para diferentes escenarios
4. **🐛 Debugging Mejorado**: Logging detallado y trazabilidad de requests
5. **📋 Documentación Completa**: READMEs actualizados con guías paso a paso
6. **🎨 UX Consistente**: Vistas de catálogo y carrito similares entre apps
7. **⚙️ Configuración Centralizada**: Un solo punto de configuración por app

## 🎉 Sistema Listo Para Producción

El sistema está completamente implementado y listo para usar tanto en desarrollo como en producción. Los desarrolladores pueden ahora:

- Probar fácilmente con endpoints de AWS sin compilar APK
- Cambiar entre ambientes con comandos simples
- Verificar conectividad antes de desarrollar
- Mantener un flujo de desarrollo eficiente