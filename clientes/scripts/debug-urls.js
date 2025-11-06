// Script para verificar las URLs que se están generando
const fs = require('fs');

// Simular el archivo baseUrl.ts
const { Platform } = { OS: 'android' };

// Simular process.env
process.env.EXPO_PUBLIC_ENVIRONMENT = 'production';

// Importar las funciones (simuladas)
const ENVIRONMENTS = {
  local: {
    bffVenta: "http://localhost:8001",
    bffCliente: "http://localhost:8002", 
    ordersService: "http://localhost:8000",
    clienteService: "http://localhost:3003",
    catalogService: "http://localhost:3001", 
    rutasService: "http://localhost:8003",
  },
  aws: {
    bffVenta: "https://d3f7r5jd3xated.cloudfront.net",
    bffCliente: "https://d2daixtzj6x1qi.cloudfront.net",
    ordersService: "",
    clienteService: "",  
    catalogService: "",
    rutasService: "",
  },
  production: {
    bffVenta: "https://d3f7r5jd3xated.cloudfront.net",
    bffCliente: "https://d2daixtzj6x1qi.cloudfront.net",
    ordersService: "",
    clienteService: "",  
    catalogService: "",
    rutasService: "",
  }
};

function getCurrentEnvironment() {
  const envVar = process.env.EXPO_PUBLIC_ENVIRONMENT;
  if (envVar && ['local', 'aws', 'production'].includes(envVar)) {
    return envVar;
  }
  return 'local';
}

function getServiceUrl(service) {
  const environment = getCurrentEnvironment();
  const config = ENVIRONMENTS[environment];
  
  if (environment === 'local') {
    // Desarrollo local
    const base = "http://localhost";
    const ports = {
      orders: '8000',
      cliente: '3003',   
      catalog: '3001',
      rutas: '8003'
    };
    
    return `${base}:${ports[service]}`;
  } else {
    // AWS/Producción
    const paths = {
      orders: '/api/v1/orders',
      cliente: '/api/cliente/',
      catalog: '/api/v1/catalog',
      rutas: '/api/v1/rutas'
    };
    
    if (service === 'catalog' || service === 'rutas') {
      return `${config.bffVenta}${paths[service]}`;
    } else {
      return `${config.bffCliente}${paths[service]}`;
    }
  }
}

console.log('🔍 VERIFICANDO URLs GENERADAS:');
console.log('================================');
console.log('Environment:', getCurrentEnvironment());
console.log('');
console.log('📋 URLs de servicios:');
console.log('  Orders:', getServiceUrl('orders'));
console.log('  Cliente:', getServiceUrl('cliente'));
console.log('  Catalog:', getServiceUrl('catalog'));
console.log('  Rutas:', getServiceUrl('rutas'));
console.log('');
console.log('🔍 ANÁLISIS:');
console.log('  BFF Cliente base:', ENVIRONMENTS[getCurrentEnvironment()].bffCliente);
console.log('  BFF Venta base:', ENVIRONMENTS[getCurrentEnvironment()].bffVenta);
console.log('');
console.log('🎯 PROBLEMA DETECTADO:');
console.log('  La URL de orders se construye como:', getServiceUrl('orders'));
console.log('  Pero debería ser una URL completa al BFF!');