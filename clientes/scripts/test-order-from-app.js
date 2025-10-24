// Test simple para añadir al package.json y probar desde app
// scripts/test-order-from-app.js

const { getServiceUrl, getCurrentEnvironment } = require('../config/baseUrl');

// Cargar configuración actual 
console.log('🔍 TESTING ORDER CREATION FROM APP CONTEXT');
console.log('==========================================');
console.log('Environment:', getCurrentEnvironment());
console.log('Orders URL:', getServiceUrl('orders'));

// Simular exactamente lo que hace la app
const axios = require('axios');

const ordersApiConfig = {
  baseURL: getServiceUrl('orders'),
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
};

console.log('📋 Orders API Config:', JSON.stringify(ordersApiConfig, null, 2));

const testAppOrder = async () => {
  const testPayload = {
    body: {
      customer_id: "hospital-central-001",
      items: [
        { sku: "PARACETAMOL-500MG", qty: 2 },
        { sku: "ASPIRINA-100MG", qty: 1 }
      ]
    }
  };

  try {
    console.log('\n🚀 Making request with app configuration...');
    console.log('📍 Full URL:', `${ordersApiConfig.baseURL}/orders`);
    console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await axios.post(`${ordersApiConfig.baseURL}/orders`, testPayload, {
      timeout: ordersApiConfig.timeout,
      headers: {
        ...ordersApiConfig.headers,
        "Idempotency-Key": "test-" + Date.now()
      }
    });
    
    console.log('✅ SUCCESS from app context!');
    console.log('📊 Status:', response.status, response.statusText);
    console.log('📋 Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERROR from app context!');
    console.log('📊 Status:', error.response?.status || 'NO_RESPONSE');
    console.log('📋 Error Data:', JSON.stringify(error.response?.data || error.message, null, 2));
    
    if (error.response?.status === 404) {
      console.log('\n🔍 404 Analysis:');
      console.log('  App URL:', `${ordersApiConfig.baseURL}/orders`);
      console.log('  Script URL (working):', 'https://d2daixtzj6x1qi.cloudfront.net/api/v1/orders');
      console.log('  Match?', `${ordersApiConfig.baseURL}/orders` === 'https://d2daixtzj6x1qi.cloudfront.net/api/v1/orders');
    }
  }
};

testAppOrder();