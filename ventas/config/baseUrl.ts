// config/baseUrl.ts
import { Platform } from "react-native";
import { isAPKMode } from './apkSimulation';

// Tipos de ambientes disponibles
export type Environment = 'local' | 'aws' | 'production';

// URLs exactas de la guía de endpoints
const ENVIRONMENTS = {
  local: {
    // Docker Compose local (desde la guía)
    bffVenta: "http://localhost:8001",
    bffCliente: "http://localhost:8002", 
    ordersService: "http://localhost:8000",
    clienteService: "http://localhost:3003",
    catalogService: "http://localhost:3001", 
    rutasService: "http://localhost:8003",
  },
  aws: {
    // AWS - Endpoints desplegados (desde la guía)
    bffVenta: "https://medisupply-backend.duckdns.org/venta",
    bffCliente: "https://medisupply-backend.duckdns.org/cliente",
    ordersService: "", // Se usa a través del BFF
    clienteService: "", // Se usa a través del BFF  
    catalogService: "", // Se usa a través del BFF
    rutasService: "", // Se usa a través del BFF
  },
  production: {
    // Producción (mismo que AWS por ahora)
    bffVenta: "https://medisupply-backend.duckdns.org/venta",
    bffCliente: "https://medisupply-backend.duckdns.org/cliente",
    ordersService: "",
    clienteService: "",  
    catalogService: "",
    rutasService: "",
  }
};

// Función para obtener el ambiente actual
export function getCurrentEnvironment(): Environment {
  // 1. Variable de entorno explícita
  const envVar = process.env.EXPO_PUBLIC_ENVIRONMENT as Environment;
  if (envVar && ['local', 'aws', 'production'].includes(envVar)) {
    console.log(`Environment from var: ${envVar}`);
    return envVar;
  }
  
  // 2. APK compilado O simulación APK - FORZAR producción
  if (isAPKMode()) {
    console.log(`APK mode detected (real or simulated) - using PRODUCTION`);
    console.log(`Platform: ${Platform.OS}`);
    console.log(`__DEV__: ${__DEV__}`);
    console.log(`isAPKMode(): ${isAPKMode()}`);
    return 'production';
  }
  
  // 3. Modo desarrollo
  console.log(`Development mode - using LOCAL`);
  return 'local';
}

// Función para obtener el host base adaptado para emuladores/dispositivos  
export function apiHost() {
  const environment = getCurrentEnvironment();
  
  if (environment === 'local') {
    // Para desarrollo local, adaptamos según la plataforma
    const LAN_IP = process.env.EXPO_PUBLIC_API_HOST ?? "10.189.117.176";
    
    if (Platform.OS === "ios") return "http://localhost";
    if (Platform.OS === "android") return "http://10.0.2.2";
    return `http://${LAN_IP}`;
  } else {
    // Para AWS/producción, usamos las URLs directas de la guía
    const config = ENVIRONMENTS[environment];
    return config.bffCliente; // BFF Cliente como entrada principal para app clientes
  }
}

// URLs específicas por servicio según la guía
export function getServiceUrl(service: 'orders' | 'cliente' | 'catalog' | 'rutas') {
  const environment = getCurrentEnvironment();
  const config = ENVIRONMENTS[environment];
  
  if (environment === 'local') {
    // Desarrollo local: acceso directo a microservicios (puertos de la guía)
    const base = apiHost();
    const ports = {
      orders: '8000',    // Orders Service
      cliente: '3003',   // Cliente Service   
      catalog: '3001',   // Catálogo Service
      rutas: '8003'      // Rutas Service
    };
    
    return `${base}:${ports[service]}`;
  } else {
    // AWS/Producción: todo a través de los BFFs (según la guía)
    const paths = {
      orders: '/api/v1/orders',      // BFF maneja órdenes
      cliente: '/api/v1/client/',      // BFF Cliente maneja clientes (con / final)
      catalog: '/api/v1/catalog',           // BFF Venta proxy a catálogo
      rutas: '/api/v1/rutas'        // BFF Venta maneja rutas
    };
    
    // Para clientes, la mayoría van por BFF Cliente, excepto catálogo que va por BFF Venta
    if (service === 'catalog' || service === 'rutas') {
      return `${config.bffVenta}${paths[service]}`;
    } else {
      // orders, cliente van por BFF Cliente
      return `${config.bffCliente}${paths[service]}`;
    }
  }
}

// Helper para logs detallados
export function logEnvironmentInfo() {
  const environment = getCurrentEnvironment();
  const isAPK = !__DEV__;
  
  console.log('🔧 MEDISUPPLY - CONFIGURACIÓN DE AMBIENTE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌍 Ambiente: ${environment.toUpperCase()}`);
  console.log(`📱 Plataforma: ${Platform.OS}`);
  console.log(`� Modo: ${isAPK ? 'APK/Producción' : 'Desarrollo'}`);
  console.log(`�🔗 Base URL: ${apiHost()}`);
  console.log(`🔧 __DEV__: ${__DEV__}`);
  
  if (environment === 'production' || environment === 'aws') {
    console.log('\n🚀 Modo producción/AWS');
  } else {
    console.log('\n🐳 Usando Docker Compose local');
  }
  
  console.log('\n📋 Servicios configurados:');
  console.log(`  • Orders: ${getServiceUrl('orders')}`);
  console.log(`  • Cliente: ${getServiceUrl('cliente')}`);  
  console.log(`  • Catálogo: ${getServiceUrl('catalog')}`);
  console.log(`  • Rutas: ${getServiceUrl('rutas')}`);
  
  console.log('\n💡 Para cambiar ambiente en desarrollo:');
  console.log('   export EXPO_PUBLIC_ENVIRONMENT=aws');
  console.log('   npm run start:aws');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
