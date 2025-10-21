// scripts/test-api.js
// Script para probar la conectividad con la API

const axios = require('axios');

const BASE_URLS = [
  'http://localhost:3003',
  'http://10.0.2.2:3003',
  'http://10.189.117.176:3003', // IP del .env
];

async function testEndpoint(baseUrl) {
  console.log(`\n🔍 Testing ${baseUrl}...`);
  
  try {
    // Test health check
    const healthResponse = await axios.get(`${baseUrl}/api/cliente/health`, { timeout: 5000 });
    console.log(`✅ Health check: ${healthResponse.status}`);
    
    // Test listar clientes
    const clientesResponse = await axios.get(`${baseUrl}/api/cliente/`, { timeout: 5000 });
    console.log(`✅ Clientes: ${clientesResponse.data.length} clientes found`);
    
    if (clientesResponse.data.length > 0) {
      const firstClient = clientesResponse.data[0];
      console.log(`📝 First client: ${firstClient.id} - ${firstClient.nombre}`);
      
      // Test histórico del primer cliente
      try {
        const historicoResponse = await axios.get(
          `${baseUrl}/api/cliente/${firstClient.id}/historico?vendedor_id=VEN001`, 
          { timeout: 5000 }
        );
        console.log(`✅ Histórico: ${historicoResponse.status}`);
        console.log(`📊 Stats: ${historicoResponse.data.estadisticas.total_compras} compras`);
        return true;
      } catch (historicoError) {
        console.log(`❌ Histórico error: ${historicoError.response?.status} ${historicoError.response?.data || historicoError.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Connection failed: ${error.response?.status || error.code || error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing API connectivity...\n');
  
  for (const baseUrl of BASE_URLS) {
    const success = await testEndpoint(baseUrl);
    if (success) {
      console.log(`\n🎉 SUCCESS: API is working at ${baseUrl}`);
      console.log(`\n💡 To use this URL in your app, update your config:`);
      console.log(`   - For localhost: Use iOS simulator or web`);
      console.log(`   - For 10.0.2.2: Use Android emulator`);
      console.log(`   - For IP address: Use physical device or change EXPO_PUBLIC_API_HOST\n`);
      break;
    }
  }
}

main().catch(console.error);