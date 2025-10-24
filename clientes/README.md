# Clientes App - MediSupply 🏥

App móvil para los clientes de MediSupply.

## 🚀 Inicio Rápido

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Verificar conectividad** (opcional)
   ```bash
   npm run test-endpoints
   ```

3. **Ejecutar la app**
   ```bash
   # Ambiente local (Docker)
   npm run start:local
   
   # Ambiente AWS (desarrollo)
   npm run start:aws
   ```

## 🌍 Configuración de Ambientes

Esta app puede conectarse a diferentes ambientes de backend:

### Ambiente Local (Docker Compose)
```bash
# Verificar conectividad
npm run test-endpoints:local

# Ejecutar con Docker local
npm run start:local
npm run android:local
npm run ios:local
```

### Ambiente AWS (Desarrollo)
```bash
# Verificar conectividad AWS
npm run test-endpoints:aws

# Ejecutar con endpoints AWS
npm run start:aws
npm run android:aws
npm run ios:aws
```

### Ambiente Producción
```bash
# Verificar conectividad de producción
npm run test-endpoints:prod

# Ejecutar con endpoints de producción
npm run start:prod
npm run android:prod
npm run ios:prod
```

### Testing de Endpoints
```bash
# Test todos los ambientes
npm run test-endpoints

# Test ambiente específico
npm run test-endpoints:local
npm run test-endpoints:aws
npm run test-endpoints:prod
```

## 🔧 Configuración Manual

Si necesitas cambiar manualmente el ambiente:

```bash
# Para AWS
export EXPO_PUBLIC_ENVIRONMENT=aws
expo start

# Para Producción
export EXPO_PUBLIC_ENVIRONMENT=production
expo start

# Para Local
export EXPO_PUBLIC_ENVIRONMENT=local
expo start

# Por defecto (Local)
expo start
```

## 📋 URLs Configuradas

### Local (Docker Compose)
- BFF Cliente: `http://localhost:8002`
- Orders Service: `http://localhost:8000`
- Catalog Service: `http://localhost:3001`

### AWS (Desarrollo)
- BFF Cliente: `http://medisupply-dev-bff-cliente-alb-1141787956.us-east-1.elb.amazonaws.com`
- BFF Venta: `http://medisupply-dev-bff-venta-alb-1773752444.us-east-1.elb.amazonaws.com`

Ver `config/baseUrl.ts` para detalles completos.

## 🏗️ Estructura del Proyecto

- `/app` - Pantallas principales (tabs, catálogo, carrito)
- `/components` - Componentes reutilizables
- `/hooks` - Custom hooks (useCatalog, useCreateOrder)
- `/services` - Servicios API
- `/store` - Estado global (Zustand)
- `/config` - Configuración de ambientes

## 🎨 Tema de Colores

- Color primario: `#1193d4` (azul clientes)
- Sistema de colores definido en `constants/theme.ts`

## 📱 Funcionalidades

- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Creación de pedidos
- ✅ Cambio de ambientes
- ✅ Logging y debugging

## 🔍 Debugging

La app incluye logging detallado para debugging:

```bash
# Ver logs del ambiente actual
npm run start:local
# Los logs aparecen en la consola de Expo

# Test de conectividad
npm run test-endpoints:aws
```

## 🚢 Deploy

### Para APK de Desarrollo (AWS)
```bash
# Configurar ambiente
export EXPO_PUBLIC_ENVIRONMENT=aws

# Compilar
expo build:android
# o
eas build --platform android
```

### Para APK de Producción
```bash
# Configurar ambiente de producción
export EXPO_PUBLIC_ENVIRONMENT=production

# Verificar conectividad primero
npm run test-endpoints:prod

# Compilar para producción
expo build:android --release-channel production
# o
eas build --platform android --profile production
```

### Comandos Rápidos para Producción
```bash
# Solo testing (sin compilar)
npm run start:prod          # Expo con endpoints de producción
npm run android:prod        # Android con endpoints de producción  
npm run ios:prod            # iOS con endpoints de producción
```
