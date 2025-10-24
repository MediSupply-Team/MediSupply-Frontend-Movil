#!/usr/bin/env node

const axios = require('axios');
const https = require('https');

// URLs a probar (exactas de la configuración)
const ENDPOINTS = [
  'http://medisupply-dev-bff-venta-alb-607524362.us-east-1.elb.amazonaws.com',
  'http://medisupply-dev-bff-cliente-alb-1673122993.us-east-1.elb.amazonaws.com',
];

const APK_HEADERS = {
  'User-Agent': 'okhttp/4.12.0',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Connection': 'close',
  'Cache-Control': 'no-cache'
};

async function debugEndpoint(url) {
  console.log(`\n🔍 Debugging: ${url}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Test 1: Simple ping
  try {
    const response = await axios.get(url, {
      timeout: 45000,
      headers: APK_HEADERS,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    console.log(`✅ STATUS: ${response.status}`);
    console.log(`✅ HEADERS: ${JSON.stringify(response.headers, null, 2)}`);
    console.log(`✅ DATA: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    if (error.response) {
      console.log(`❌ STATUS: ${error.response.status}`);
      console.log(`❌ HEADERS: ${JSON.stringify(error.response.headers, null, 2)}`);
      console.log(`❌ DATA: ${JSON.stringify(error.response.data)}`);
    }
    if (error.code) {
      console.log(`❌ ERROR CODE: ${error.code}`);
    }
    if (error.config) {
      console.log(`❌ REQUEST URL: ${error.config.url}`);
      console.log(`❌ REQUEST HEADERS: ${JSON.stringify(error.config.headers, null, 2)}`);
    }
  }

  // Test 2: Catalog endpoint
  try {
    const catalogUrl = `${url}/catalog`;
    console.log(`\n🛍️ Testing catalog: ${catalogUrl}`);
    const response = await axios.get(catalogUrl, {
      timeout: 45000,
      headers: APK_HEADERS,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    console.log(`✅ CATALOG STATUS: ${response.status}`);
    console.log(`✅ CATALOG DATA: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.log(`❌ CATALOG ERROR: ${error.message}`);
    if (error.response) {
      console.log(`❌ CATALOG STATUS: ${error.response.status}`);
      console.log(`❌ CATALOG DATA: ${JSON.stringify(error.response.data)}`);
    }
  }

  // Test 3: Orders endpoint
  try {
    const ordersUrl = `${url}/api/v1/orders`;
    console.log(`\n📦 Testing orders: ${ordersUrl}`);
    const response = await axios.get(ordersUrl, {
      timeout: 45000,
      headers: APK_HEADERS,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    console.log(`✅ ORDERS STATUS: ${response.status}`);
    console.log(`✅ ORDERS DATA: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.log(`❌ ORDERS ERROR: ${error.message}`);
    if (error.response) {
      console.log(`❌ ORDERS STATUS: ${error.response.status}`);
      console.log(`❌ ORDERS DATA: ${JSON.stringify(error.response.data)}`);
    }
  }
}

async function main() {
  console.log('🔧 MediSupply - APK Network Debugging');
  console.log('═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log(`🎯 Simulando llamadas exactas del APK con headers y timeouts`);
  
  for (const endpoint of ENDPOINTS) {
    await debugEndpoint(endpoint);
  }
  
  console.log('\n🎉 Debugging completado!');
  console.log('\n💡 Si algún endpoint falló, ese es el problema del APK.');
  console.log('💡 Si todos funcionan, el problema es de configuración Android.');
}

main().catch(console.error);