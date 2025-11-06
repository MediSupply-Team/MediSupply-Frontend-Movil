// Test directo del endpoint de orders desde la app de clientes
const axios = require('axios');

const ORDERS_URL = 'https://d2daixtzj6x1qi.cloudfront.net/api/v1/orders';

const testPayload = {
  body: {
    customer_id: "HOSPITAL-TEST-001",
    items: [
      { sku: "PARACETAMOL-500MG", qty: 2 },
      { sku: "ASPIRINA-100MG", qty: 1 }
    ]
  }
};

async function testDirectOrder() {
  console.log('🧪 TESTING DIRECT ORDER ENDPOINT');
  console.log('================================');
  console.log('📍 URL:', ORDERS_URL);
  console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));
  
  try {
    const response = await axios.post(ORDERS_URL, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MediSupply-Clientes-Direct-Test/1.0'
      },
      timeout: 15000
    });
    
    console.log('✅ SUCCESS!');
    console.log('📊 Status:', response.status, response.statusText);
    console.log('📋 Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERROR!');
    console.log('📊 Status:', error.response?.status || 'NO_RESPONSE');
    console.log('📋 Error Data:', JSON.stringify(error.response?.data || error.message, null, 2));
    console.log('🔍 Full Error:', error.message);
    
    if (error.response?.status === 404) {
      console.log('');
      console.log('🔍 ANÁLISIS DEL ERROR 404:');
      console.log('  • El endpoint no existe en esa ruta');
      console.log('  • Puede que el path correcto sea diferente');
      console.log('  • Verificar si el BFF tiene rutas exactas');
    }
  }
}

testDirectOrder();