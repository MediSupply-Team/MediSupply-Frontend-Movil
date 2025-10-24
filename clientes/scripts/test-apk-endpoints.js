#!/usr/bin/env node

const axios = require('axios');

// URLs EXACTAS con HTTPS CloudFront (actualizadas)
const WORKING_ENDPOINTS = {
  catalog: 'https://d3f7r5jd3xated.cloudfront.net/api/v1/catalog/items',
  client: 'https://d2daixtzj6x1qi.cloudfront.net/api/v1/client/',
  health_venta: 'https://d3f7r5jd3xated.cloudfront.net/health',
  health_cliente: 'https://d2daixtzj6x1qi.cloudfront.net/health',
  // También mantener las HTTP para comparar
  catalog_http: 'http://medisupply-dev-bff-venta-alb-607524362.us-east-1.elb.amazonaws.com/api/v1/catalog/items',
  client_http: 'http://medisupply-dev-bff-cliente-alb-1673122993.us-east-1.elb.amazonaws.com/api/v1/client/'
};

const APK_HEADERS = {
  'User-Agent': 'okhttp/4.12.0',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Connection': 'close',
  'Cache-Control': 'no-cache'
};

async function testAPKEndpoint(name, url) {
  console.log(`\n🔍 Testing ${name}: ${url}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    const response = await axios.get(url, {
      timeout: 45000, // Timeout largo para APK
      headers: APK_HEADERS,
      validateStatus: (status) => status < 500 // Aceptar 4xx como válido
    });
    
    console.log(`✅ STATUS: ${response.status} ${response.statusText}`);
    console.log(`✅ CONTENT-TYPE: ${response.headers['content-type']}`);
    
    if (response.data) {
      const dataStr = JSON.stringify(response.data);
      if (dataStr.length > 500) {
        console.log(`✅ DATA (truncated): ${dataStr.substring(0, 500)}...`);
        if (Array.isArray(response.data)) {
          console.log(`✅ ARRAY LENGTH: ${response.data.length} items`);
        }
      } else {
        console.log(`✅ DATA: ${dataStr}`);
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    if (error.response) {
      console.log(`❌ STATUS: ${error.response.status} ${error.response.statusText}`);
      console.log(`❌ HEADERS: ${JSON.stringify(error.response.headers, null, 2)}`);
      if (error.response.data) {
        console.log(`❌ DATA: ${JSON.stringify(error.response.data)}`);
      }
    }
    if (error.code) {
      console.log(`❌ ERROR CODE: ${error.code}`);
    }
    return false;
  }
}

async function main() {
  console.log('🚀 MediSupply - APK Endpoint Validation');
  console.log('═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log(`🎯 Testing EXACT working endpoints with APK-like requests`);
  console.log(`🔧 Using User-Agent: ${APK_HEADERS['User-Agent']}`);
  console.log(`⏱️ Timeout: 45 seconds (APK timeout)`);
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const [name, url] of Object.entries(WORKING_ENDPOINTS)) {
    totalCount++;
    const success = await testAPKEndpoint(name, url);
    if (success) successCount++;
  }
  
  console.log('\n🎯 RESUMEN FINAL:');
  console.log('═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════');
  console.log(`✅ Exitosos: ${successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 ¡TODOS LOS ENDPOINTS FUNCIONAN!');
    console.log('💡 Si el APK aún falla, el problema es configuración de Android (Network Security Config)');
    console.log('💡 Siguiente paso: Compilar APK con configuración actualizada');
  } else {
    console.log('\n⚠️  Algunos endpoints fallaron');
    console.log('💡 Revisa la conectividad de red o URLs');
  }
}

main().catch(console.error);