#!/usr/bin/env node

// Test específico para los nuevos endpoints de órdenes via BFF
const axios = require('axios');

// Configuración de endpoints
const ENDPOINTS = {
  ventas: "https://d3f7r5jd3xated.cloudfront.net/api/v1/orders",
  clientes: "https://d2daixtzj6x1qi.cloudfront.net/api/v1/orders"
};

// Payload de prueba con el formato BFF
const createTestPayload = (app) => ({
  body: {
    customer_id: "CUST-3001",
    items: [
      { sku: "BIKE-3001", qty: 3 },
      { sku: "HELM-2001", qty: 1 }
    ]
  }
});

async function testOrderCreation(app, endpoint) {
  console.log(`\n🧪 TESTING ${app.toUpperCase()} - Creación de orden`);
  console.log(`📍 Endpoint: ${endpoint}`);
  console.log("=" .repeat(70));
  
  const payload = createTestPayload(app);
  console.log("📦 Payload enviado:");
  console.log(JSON.stringify(payload, null, 2));
  
  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `MediSupply${app.charAt(0).toUpperCase() + app.slice(1)}/1.0 (Mobile; Test)`,
        'Idempotency-Key': `test-${app}-${Date.now()}`
      },
      timeout: 15000
    });
    
    console.log("✅ ÉXITO!");
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log("📄 Respuesta:");
    console.log(JSON.stringify(response.data, null, 2));
    
    // Headers de respuesta
    console.log("📋 Headers importantes:");
    console.log(`   Content-Type: ${response.headers['content-type']}`);
    console.log(`   Content-Length: ${response.headers['content-length']}`);
    
    return { success: true, data: response.data };
    
  } catch (error) {
    console.log("❌ ERROR!");
    
    if (error.response) {
      console.log(`📊 Status: ${error.response.status} ${error.response.statusText}`);
      console.log("📄 Error Data:");
      console.log(JSON.stringify(error.response.data, null, 2));
      console.log("📋 Error Headers:");
      console.log(JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.log("🔍 Request hecho pero sin respuesta");
      console.log("📨 Request config:", error.config.url);
    } else {
      console.log("⚙️ Error en configuración:", error.message);
    }
    
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log("🚀 MEDISUPPLY - TEST DE ENDPOINTS BFF PARA ÓRDENES");
  console.log("📅 " + new Date().toISOString());
  console.log("=" .repeat(70));
  
  const results = {};
  
  // Test app de ventas
  results.ventas = await testOrderCreation('ventas', ENDPOINTS.ventas);
  
  // Test app de clientes  
  results.clientes = await testOrderCreation('clientes', ENDPOINTS.clientes);
  
  // Resumen final
  console.log("\n" + "=" .repeat(70));
  console.log("📊 RESUMEN DE PRUEBAS");
  console.log("=" .repeat(70));
  
  Object.entries(results).forEach(([app, result]) => {
    const icon = result.success ? "✅" : "❌";
    const status = result.success ? "EXITOSO" : "FALLÓ";
    console.log(`${icon} ${app.toUpperCase()}: ${status}`);
    
    if (result.success && result.data?.id) {
      console.log(`   📝 Order ID: ${result.data.id}`);
    }
    if (!result.success) {
      console.log(`   💥 Error: ${result.error}`);
    }
  });
  
  const successCount = Object.values(results).filter(r => r.success).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 Resultado: ${successCount}/${totalCount} endpoints funcionando`);
  
  if (successCount === totalCount) {
    console.log("🎉 ¡Todos los endpoints BFF funcionan correctamente!");
    console.log("📱 Las apps pueden crear órdenes exitosamente");
  } else {
    console.log("⚠️  Algunos endpoints tienen problemas");
    console.log("🔧 Revisa los logs arriba para más detalles");
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testOrderCreation, createTestPayload };