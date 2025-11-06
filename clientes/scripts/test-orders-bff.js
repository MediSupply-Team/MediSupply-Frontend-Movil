// Script para probar la creación de órdenes en ambos BFFs
const axios = require('axios');

// Configuración de endpoints
const BFF_CLIENTE = 'https://d2daixtzj6x1qi.cloudfront.net';
const BFF_VENTA = 'https://d3f7r5jd3xated.cloudfront.net';

// Datos de prueba
const testOrderCliente = {
  body: {
    customer_id: "CUST-TEST-001", 
    created_by_role: "cliente",
    source: "mobile-clientes",
    items: [
      { sku: "PARACETAMOL-500MG", qty: 2 },
      { sku: "ASPIRINA-100MG", qty: 1 }
    ]
  }
};

const testOrderVenta = {
  body: {
    customer_id: "CUST-TEST-002",
    created_by_role: "vendedor", 
    source: "mobile-ventas",
    items: [
      { sku: "IBUPROFENO-200MG", qty: 3 },
      { sku: "VITAMINA-C-1000MG", qty: 1 }
    ]
  }
};

async function testCreateOrder(endpoint, orderData, bffName) {
  console.log(`\n🧪 Testing ${bffName} - Create Order`);
  console.log(`📍 Endpoint: ${endpoint}/api/v1/orders`);
  console.log(`📦 Order Data:`, JSON.stringify(orderData, null, 2));
  
  try {
    const response = await axios.post(`${endpoint}/api/v1/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `MediSupply-${bffName}/1.0 (Mobile; Test)`
      },
      timeout: 15000,
      validateStatus: (status) => status < 500 // Aceptar 4xx como válido para análisis
    });

    console.log(`✅ ${bffName} Response Status: ${response.status} ${response.statusText}`);
    
    if (response.data) {
      console.log(`📋 Response Data:`, JSON.stringify(response.data, null, 2));
      
      // Verificar campos esperados en la respuesta
      if (response.data.order_id || response.data.id) {
        console.log(`🎯 Order ID Generated: ${response.data.order_id || response.data.id}`);
      }
      
      if (response.data.status) {
        console.log(`📊 Order Status: ${response.data.status}`);
      }
      
      if (response.data.created_at || response.data.createdAt) {
        console.log(`⏰ Created At: ${response.data.created_at || response.data.createdAt}`);
      }
    }
    
    // Verificar que la orden se haya creado correctamente
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ ${bffName}: Order creation SUCCESSFUL`);
      return { success: true, data: response.data };
    } else {
      console.log(`⚠️ ${bffName}: Order creation returned ${response.status}`);
      return { success: false, status: response.status, data: response.data };
    }

  } catch (error) {
    console.log(`❌ ${bffName} Request FAILED:`);
    console.log(`   Error: ${error.message}`);
    
    if (error.response) {
      console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
      console.log(`   Response Data:`, JSON.stringify(error.response.data, null, 2));
      
      // Analizar tipos de errores comunes
      if (error.response.status === 400) {
        console.log(`   🔍 Analysis: Bad Request - Check payload format`);
      } else if (error.response.status === 404) {
        console.log(`   🔍 Analysis: Not Found - Check endpoint URL`);
      } else if (error.response.status === 422) {
        console.log(`   🔍 Analysis: Validation Error - Check required fields`);
      } else if (error.response.status === 500) {
        console.log(`   🔍 Analysis: Server Error - Backend issue`);
      }
    } else if (error.request) {
      console.log(`   🔍 Analysis: Network Error - No response from server`);
    }
    
    return { success: false, error: error.message };
  }
}

async function runOrderTests() {
  console.log('🚀 TESTING ORDER CREATION IN BOTH BFFs');
  console.log('=============================================\n');
  
  const results = {
    cliente: null,
    venta: null
  };
  
  // Test BFF Cliente
  results.cliente = await testCreateOrder(BFF_CLIENTE, testOrderCliente, 'BFF-Cliente');
  
  // Pausa entre requests
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test BFF Venta  
  results.venta = await testCreateOrder(BFF_VENTA, testOrderVenta, 'BFF-Venta');
  
  // Resumen final
  console.log('\n📊 FINAL RESULTS SUMMARY');
  console.log('=========================');
  console.log(`🏥 BFF Cliente: ${results.cliente.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`🚚 BFF Venta:   ${results.venta.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (results.cliente.success && results.venta.success) {
    console.log('\n🎉 ALL TESTS PASSED! Both BFFs are working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.');
  }
  
  console.log('\n📝 Test Details:');
  console.log(`   - Cliente BFF: ${BFF_CLIENTE}/api/v1/orders`);
  console.log(`   - Venta BFF:   ${BFF_VENTA}/api/v1/orders`);
  console.log(`   - Payload format: { body: { customer_id, items: [{ sku, qty }] } }`);
  
  return results;
}

// Ejecutar tests
runOrderTests().catch(console.error);