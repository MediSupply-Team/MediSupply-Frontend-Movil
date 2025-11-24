// Script para probar la creación de órdenes en ambos BFFs desde la app de ventas
const axios = require('axios');

// Configuración de endpoints
const BFF_CLIENTE = 'https://d2daixtzj6x1qi.cloudfront.net';
const BFF_VENTA = 'https://d3f7r5jd3xated.cloudfront.net';

// Datos de prueba específicos para ventas
const testOrderVendedor = {
  body: {
    customer_id: "HOSPITAL-CENTRAL-001", 
    created_by_role: "vendedor",
    source: "mobile-ventas",
    items: [
      { sku: "JERINGA-5ML", qty: 50 },
      { sku: "ALCOHOL-70", qty: 10 },
      { sku: "GASAS-ESTERILES", qty: 20 }
    ]
  }
};

const testOrderClienteFromVentas = {
  body: {
    customer_id: "CLINICA-NORTE-002",
    created_by_role: "cliente", 
    source: "mobile-clientes",
    items: [
      { sku: "ACETAMINOFEN-500MG", qty: 100 },
      { sku: "SUERO-FISIOLOGICO", qty: 25 }
    ]
  }
};

async function testCreateOrder(endpoint, orderData, bffName, testType) {
  console.log(`\n🧪 Testing ${bffName} - ${testType}`);
  console.log(`📍 Endpoint: ${endpoint}/api/v1/orders`);
  console.log(`📦 Order Data:`, JSON.stringify(orderData, null, 2));
  
  try {
    const response = await axios.post(`${endpoint}/api/v1/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `MediSupply-Ventas-Test/1.0 (Mobile; Integration-Test)`
      },
      timeout: 15000,
      validateStatus: (status) => status < 500
    });

    console.log(`✅ ${bffName} Response Status: ${response.status} ${response.statusText}`);
    
    if (response.data) {
      console.log(`📋 Response Data:`, JSON.stringify(response.data, null, 2));
      
      // Verificar estructura de respuesta específica
      const orderId = response.data.order_id || response.data.id || response.data.orderId;
      if (orderId) {
        console.log(`🎯 Order ID: ${orderId}`);
      }
      
      const status = response.data.status || response.data.state;
      if (status) {
        console.log(`📊 Order Status: ${status}`);
      }
      
      const timestamp = response.data.created_at || response.data.createdAt || response.data.timestamp;
      if (timestamp) {
        console.log(`⏰ Created: ${timestamp}`);
      }
      
      // Verificar items
      const items = response.data.items || response.data.order_items;
      if (items && Array.isArray(items)) {
        console.log(`📦 Items Count: ${items.length}`);
      }
    }
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ ${testType}: Order creation SUCCESSFUL`);
      return { success: true, data: response.data, status: response.status };
    } else {
      console.log(`⚠️ ${testType}: Unexpected status ${response.status}`);
      return { success: false, status: response.status, data: response.data };
    }

  } catch (error) {
    console.log(`❌ ${testType} Request FAILED:`);
    console.log(`   Error: ${error.message}`);
    
    if (error.response) {
      console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
      console.log(`   Headers:`, JSON.stringify(error.response.headers, null, 2));
      console.log(`   Data:`, JSON.stringify(error.response.data, null, 2));
      
      // Análisis detallado de errores
      switch (error.response.status) {
        case 400:
          console.log(`   🔍 Analysis: Bad Request - Invalid payload format or missing fields`);
          break;
        case 401:
          console.log(`   🔍 Analysis: Unauthorized - Authentication required`);
          break;
        case 403:
          console.log(`   🔍 Analysis: Forbidden - Permission denied`);
          break;
        case 404:
          console.log(`   🔍 Analysis: Not Found - Endpoint doesn't exist`);
          break;
        case 422:
          console.log(`   🔍 Analysis: Validation Error - Check required fields and data types`);
          break;
        case 500:
          console.log(`   🔍 Analysis: Internal Server Error - Backend issue`);
          break;
        case 502:
          console.log(`   🔍 Analysis: Bad Gateway - Proxy/Load balancer issue`);
          break;
        case 503:
          console.log(`   🔍 Analysis: Service Unavailable - Backend temporarily down`);
          break;
        default:
          console.log(`   🔍 Analysis: HTTP ${error.response.status} - Check BFF documentation`);
      }
    } else if (error.request) {
      console.log(`   🔍 Analysis: Network Error - Cannot reach server`);
    }
    
    return { success: false, error: error.message, status: error.response?.status };
  }
}

async function runVentasOrderTests() {
  console.log('🚀 TESTING ORDER CREATION FROM VENTAS APP');
  console.log('===========================================\n');
  
  const results = {
    ventaBFF: null,
    clienteBFF: null
  };
  
  // Test 1: Crear orden de vendedor en BFF Venta
  console.log('🔸 Test 1: Vendedor creating order via BFF Venta');
  results.ventaBFF = await testCreateOrder(
    BFF_VENTA, 
    testOrderVendedor, 
    'BFF-Venta', 
    'Vendedor Order'
  );
  
  // Pausa entre requests
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Crear orden de cliente en BFF Cliente (simulando orden desde app ventas)
  console.log('🔸 Test 2: Cliente order via BFF Cliente (from Ventas app)');
  results.clienteBFF = await testCreateOrder(
    BFF_CLIENTE, 
    testOrderClienteFromVentas, 
    'BFF-Cliente', 
    'Cliente Order (via Ventas)'
  );
  
  // Resumen detallado
  console.log('\n📊 DETAILED RESULTS SUMMARY');
  console.log('============================');
  
  console.log('\n🚚 BFF VENTA RESULTS:');
  if (results.ventaBFF.success) {
    console.log('   ✅ Status: SUCCESS');
    console.log('   📋 Can create vendedor orders');
    console.log('   🎯 Order processing working');
  } else {
    console.log('   ❌ Status: FAILED');
    console.log(`   📋 Error: ${results.ventaBFF.error || 'Unknown error'}`);
    console.log(`   🎯 HTTP Status: ${results.ventaBFF.status || 'N/A'}`);
  }
  
  console.log('\n🏥 BFF CLIENTE RESULTS:');
  if (results.clienteBFF.success) {
    console.log('   ✅ Status: SUCCESS'); 
    console.log('   📋 Can create cliente orders');
    console.log('   🎯 Cross-BFF compatibility working');
  } else {
    console.log('   ❌ Status: FAILED');
    console.log(`   📋 Error: ${results.clienteBFF.error || 'Unknown error'}`);
    console.log(`   🎯 HTTP Status: ${results.clienteBFF.status || 'N/A'}`);
  }
  
  // Conclusión general
  console.log('\n🎯 OVERALL ASSESSMENT:');
  if (results.ventaBFF.success && results.clienteBFF.success) {
    console.log('   🎉 ALL TESTS PASSED!');
    console.log('   ✅ Both BFFs are working correctly');
    console.log('   ✅ Order creation is functional');
    console.log('   ✅ Cross-app compatibility confirmed');
  } else if (results.ventaBFF.success || results.clienteBFF.success) {
    console.log('   ⚠️ PARTIAL SUCCESS');
    console.log('   📋 Some endpoints working, others need attention');
  } else {
    console.log('   ❌ ALL TESTS FAILED');
    console.log('   📋 Both BFFs have issues - check backend status');
  }
  
  console.log('\n📝 TECHNICAL DETAILS:');
  console.log(`   🚚 Venta BFF:   ${BFF_VENTA}/api/v1/orders`);
  console.log(`   🏥 Cliente BFF: ${BFF_CLIENTE}/api/v1/orders`);
  console.log(`   📦 Payload:     { body: { customer_id, created_by_role, source, items } }`);
  console.log(`   🔧 Headers:     Content-Type: application/json`);
  
  return results;
}

// Ejecutar tests
runVentasOrderTests().catch(console.error);