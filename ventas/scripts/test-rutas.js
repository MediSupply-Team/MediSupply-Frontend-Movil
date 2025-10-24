// Script para probar el endpoint de rutas BFF
const axios = require('axios');

async function testRutasEndpoint() {
  console.log('🧪 Testing Rutas BFF Endpoint...\n');
  
  const baseUrl = 'https://d3f7r5jd3xated.cloudfront.net';
  const testDate = '2025-10-24'; // Fecha de hoy
  const endpoint = `${baseUrl}/api/v1/rutas/visita/${testDate}`;
  
  try {
    console.log(`📤 Testing: ${endpoint}`);
    
    const response = await axios.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MediSupply-Ventas/1.0 (Mobile; Test)',
        'Accept': 'application/json'
      },
      timeout: 10000,
      validateStatus: (status) => status < 500 // Aceptar 4xx como válido para test
    });
    
    console.log(`✅ Response Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Response Headers:`, JSON.stringify(response.headers, null, 2));
    
    if (response.data) {
      console.log(`📊 Response Data Type:`, typeof response.data);
      console.log(`📊 Response Keys:`, Object.keys(response.data));
      
      if (response.data.visitas && Array.isArray(response.data.visitas)) {
        console.log(`✅ Found ${response.data.visitas.length} visitas`);
        if (response.data.visitas.length > 0) {
          console.log(`📝 First visita:`, JSON.stringify(response.data.visitas[0], null, 2));
        }
      } else if (Array.isArray(response.data)) {
        console.log(`✅ Direct array with ${response.data.length} visitas`);
        if (response.data.length > 0) {
          console.log(`📝 First visita:`, JSON.stringify(response.data[0], null, 2));
        }
      } else {
        console.log(`📊 Response Data:`, JSON.stringify(response.data, null, 2));
      }
    }
    
  } catch (error) {
    console.log(`❌ Request Failed:`);
    console.log(`   Error Message: ${error.message}`);
    
    if (error.response) {
      console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
      console.log(`   Response Headers:`, JSON.stringify(error.response.headers, null, 2));
      console.log(`   Response Data:`, JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log(`   Request Config:`, error.config);
      console.log(`   No Response Received`);
    }
  }
  
  console.log('\n=== Test Summary ===');
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Expected format: Array of visitas or {fecha, visitas: [...]} object`);
}

// Ejecutar test
testRutasEndpoint().catch(console.error);