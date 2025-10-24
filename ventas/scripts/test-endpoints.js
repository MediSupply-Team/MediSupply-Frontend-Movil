const axios = require('axios');

// URLs exactas de la guía de endpoints
const ENVIRONMENTS = {
  local: {
    bffVenta: 'http://localhost:8001',
    bffCliente: 'http://localhost:8002',
    ordersService: 'http://localhost:8000',
    clienteService: 'http://localhost:3003',
    catalogService: 'http://localhost:3001',
    rutasService: 'http://localhost:8003',
  },
  aws: {
    bffVenta: 'http://medisupply-dev-bff-venta-alb-1773752444.us-east-1.elb.amazonaws.com',
    bffCliente: 'http://medisupply-dev-bff-cliente-alb-1141787956.us-east-1.elb.amazonaws.com',
  },
  production: {
    // Producción - usando mismo ALB por ahora (configurable)
    bffVenta: 'http://medisupply-dev-bff-venta-alb-1773752444.us-east-1.elb.amazonaws.com',
    bffCliente: 'http://medisupply-dev-bff-cliente-alb-1141787956.us-east-1.elb.amazonaws.com',
  }
};

async function testHealthEndpoint(name, url) {
  try {
    console.log(`🔍 Testing ${name}: ${url}`);
    
    const response = await axios.get(`${url}/health`, { 
      timeout: 5000,
      headers: { 'User-Agent': 'MediSupply-Ventas-Test/1.0' }
    });
    
    console.log(`✅ ${name}: ${response.status} - ${JSON.stringify(response.data)}`);
    return { name, status: 'success', data: response.data };
    
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.code === 'ECONNREFUSED') {
      console.log(`   ⚠️  Servicio no disponible (ECONNREFUSED)`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`   ⏰ Timeout - El servicio no responde`);
    }
    return { name, status: 'error', error: error.message };
  }
}

async function testEnvironment(env) {
  console.log(`\n🧪 Testing ${env.toUpperCase()} environment...`);
  const endpoints = ENVIRONMENTS[env];
  const results = [];
  
  for (const [service, url] of Object.entries(endpoints)) {
    const result = await testHealthEndpoint(service, url);
    results.push(result);
    
    // Pequeña pausa entre tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

async function testSpecificEndpoints(env) {
  console.log(`\n🎯 Testing endpoints específicos de la app VENTAS...`);
  const config = ENVIRONMENTS[env];
  
  if (env === 'aws') {
    // Test BFF Venta específicamente
    await testHealthEndpoint('BFF Venta', config.bffVenta);
    
    // Test endpoints específicos del BFF Venta
    try {
      const catalogUrl = `${config.bffVenta}/catalog`;
      console.log(`🔍 Testing catalog endpoint: ${catalogUrl}`);
      
      const catalogResponse = await axios.get(`${catalogUrl}/products`, { 
        timeout: 5000 
      });
      console.log(`✅ Catalog: ${catalogResponse.status}`);
      
    } catch (error) {
      console.log(`❌ Catalog test failed: ${error.message}`);
    }
    
    try {
      const rutasUrl = `${config.bffVenta}/api/v1/rutas`;
      console.log(`🔍 Testing rutas endpoint: ${rutasUrl}`);
      
      // Solo testeamos que el endpoint exista, no necesitamos datos reales
      const rutasResponse = await axios.get(`${rutasUrl}/visita/2025-10-20`, { 
        timeout: 5000,
        validateStatus: (status) => status < 500 // Aceptar 4xx como válido
      });
      console.log(`✅ Rutas: ${rutasResponse.status}`);
      
    } catch (error) {
      console.log(`❌ Rutas test failed: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🚀 MediSupply Ventas - Endpoint Testing');
  console.log('═══════════════════════════════════════════');
  console.log('📋 Basado en la Guía de Endpoints oficial\n');
  
  const targetEnv = process.argv[2] || 'both';
  
  if (targetEnv === 'local' || targetEnv === 'both') {
    const localResults = await testEnvironment('local');
    console.log(`\n📊 Resultados LOCAL: ${localResults.filter(r => r.status === 'success').length}/${localResults.length} exitosos`);
  }
  
  if (targetEnv === 'aws' || targetEnv === 'both') {
    const awsResults = await testEnvironment('aws');
    console.log(`\n📊 Resultados AWS: ${awsResults.filter(r => r.status === 'success').length}/${awsResults.length} exitosos`);
    
    // Tests adicionales específicos para AWS
    await testSpecificEndpoints('aws');
  }
  
  if (targetEnv === 'production' || targetEnv === 'prod') {
    const prodResults = await testEnvironment('production');
    console.log(`\n📊 Resultados PRODUCCIÓN: ${prodResults.filter(r => r.status === 'success').length}/${prodResults.length} exitosos`);
    
    // Tests adicionales específicos para producción
    await testSpecificEndpoints('production');
  }
  
  console.log('\n✨ Testing completado!');
  
  // Mostrar comandos según el ambiente
  if (targetEnv === 'aws' || targetEnv === 'both') {
    console.log('\n💡 Para usar AWS en la app:');
    console.log('   export EXPO_PUBLIC_ENVIRONMENT=aws');
    console.log('   npm run start:aws');
  }
  
  if (targetEnv === 'production' || targetEnv === 'prod') {
    console.log('\n🚀 Para usar PRODUCCIÓN en la app:');
    console.log('   export EXPO_PUBLIC_ENVIRONMENT=production');
    console.log('   npm run start:prod');
  }
  
  if (targetEnv === 'local' || targetEnv === 'both') {
    console.log('\n🏠 Para usar LOCAL en la app:');
    console.log('   export EXPO_PUBLIC_ENVIRONMENT=local');
    console.log('   npm run start:local');
  }
}

main().catch(console.error);