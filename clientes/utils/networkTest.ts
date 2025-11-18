// Test de conectividad de red para diagnosticar problemas de APK
import axios from 'axios';
import { getCurrentEnvironment, getServiceUrl } from '../config/baseUrl';

export async function testNetworkConnectivity() {
  console.log('🌐 TESTING NETWORK CONNECTIVITY');
  console.log('══════════════════════════════════════════════════════════════════════════════════════════');
  
  const results = {
    environment: getCurrentEnvironment(),
    tests: [] as any[]
  };

  // Test 1: Google (HTTPS) para verificar conexión básica
  try {
    console.log('🧪 Test 1: Basic HTTPS connectivity (google.com)...');
    const response = await axios.get('https://www.google.com', { 
      timeout: 10000,
      validateStatus: () => true 
    });
    
    console.log('✅ HTTPS connectivity: OK');
    results.tests.push({
      name: 'HTTPS Connectivity',
      url: 'https://www.google.com',
      status: 'SUCCESS',
      statusCode: response.status
    });
  } catch (error: any) {
    console.error('❌ HTTPS connectivity: FAILED');
    console.error('❌ Error:', error?.message);
    results.tests.push({
      name: 'HTTPS Connectivity',
      url: 'https://www.google.com',
      status: 'FAILED',
      error: error?.message
    });
  }

  // Test 2: HTTP básico
  try {
    console.log('🧪 Test 2: Basic HTTP connectivity (httpbin.org)...');
    const response = await axios.get('http://httpbin.org/get', { 
      timeout: 10000,
      validateStatus: () => true 
    });
    
    console.log('✅ HTTP connectivity: OK');
    results.tests.push({
      name: 'HTTP Connectivity',
      url: 'http://httpbin.org/get',
      status: 'SUCCESS',
      statusCode: response.status
    });
  } catch (error: any) {
    console.error('❌ HTTP connectivity: FAILED');
    console.error('❌ Error:', error?.message);
    results.tests.push({
      name: 'HTTP Connectivity',
      url: 'http://httpbin.org/get',
      status: 'FAILED',
      error: error?.message
    });
  }

  // Test 3: DNS resolution del endpoint AWS
  try {
    console.log('🧪 Test 3: AWS endpoint DNS resolution...');
    const catalogUrl = getServiceUrl('catalog');
    const host = new URL(catalogUrl).hostname;
    
    // Hacer una solicitud simple para verificar DNS
    const response = await axios.get(`http://${host}`, { 
      timeout: 15000,
      validateStatus: () => true 
    });
    
    console.log('✅ AWS DNS resolution: OK');
    results.tests.push({
      name: 'AWS DNS Resolution',
      url: `http://${host}`,
      status: 'SUCCESS',
      statusCode: response.status
    });
  } catch (error: any) {
    console.error('❌ AWS DNS resolution: FAILED');
    console.error('❌ Error:', error?.message);
    results.tests.push({
      name: 'AWS DNS Resolution',
      url: 'AWS endpoint',
      status: 'FAILED',
      error: error?.message
    });
  }

  // Test 4: Endpoint específico con headers completos
  try {
    console.log('🧪 Test 4: Full catalog endpoint test...');
    const catalogUrl = getServiceUrl('catalog');
    const fullUrl = `${catalogUrl}/items`;
    
    const response = await axios.get(fullUrl, {
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MediSupplyClientes/1.0 (Mobile; APK)',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Connection': 'close'
      },
      validateStatus: () => true
    });
    
    console.log('✅ Catalog endpoint: OK');
    console.log('✅ Status:', response.status);
    console.log('✅ Data preview:', JSON.stringify(response.data, null, 2).substring(0, 200));
    
    results.tests.push({
      name: 'Catalog Endpoint',
      url: fullUrl,
      status: 'SUCCESS',
      statusCode: response.status,
      dataPreview: response.data ? 'Data received' : 'No data'
    });
    
    return results;
  } catch (error: any) {
    console.error('❌ Catalog endpoint: FAILED');
    console.error('❌ Error:', error?.message);
    console.error('❌ Code:', error?.code);
    
    results.tests.push({
      name: 'Catalog Endpoint',
      url: 'AWS catalog endpoint',
      status: 'FAILED',
      error: error?.message,
      code: error?.code
    });
  }

  console.log('🏁 Network connectivity test completed');
  console.log('📊 Results:', JSON.stringify(results, null, 2));
  
  return results;
}