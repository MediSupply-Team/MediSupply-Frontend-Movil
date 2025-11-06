// Test directo en la app para debugging
import { catalogApi } from '../services/catalogApi';
import axios from 'axios';
import { getCurrentEnvironment, getServiceUrl } from '../config/baseUrl';

export async function testCatalogDirectly() {
  console.log('🔧 TESTING CATALOG DIRECTLY');
  console.log('══════════════════════════════════════════════════════════════════════════════════════════');
  
  // Test 1: Con catalogApi configurado
  try {
    console.log('🚀 Test 1: Using configured catalogApi...');
    const response = await catalogApi.get('/items');
    
    console.log('✅ SUCCESS with catalogApi!');
    console.log('✅ Status:', response.status);
    console.log('✅ Headers:', JSON.stringify(response.headers, null, 2));
    console.log('✅ Data keys:', Object.keys(response.data || {}));
    
    if (response.data?.items) {
      console.log('✅ Items count:', response.data.items.length);
      console.log('✅ First item:', JSON.stringify(response.data.items[0], null, 2));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('💥 Test 1 FAILED with catalogApi!');
    console.error('💥 Error message:', error?.message);
    console.error('💥 Error code:', error?.code);
    console.error('💥 Error name:', error?.name);
    
    if (error?.response) {
      console.error('💥 Response status:', error.response.status);
      console.error('💥 Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('💥 Response headers:', JSON.stringify(error.response.headers, null, 2));
    }
    
    if (error?.request) {
      console.error('💥 Request exists but no response received');
      console.error('💥 Request details:', {
        readyState: error.request.readyState,
        status: error.request.status,
        statusText: error.request.statusText,
        responseURL: error.request.responseURL
      });
    }
  }

  // Test 2: Con axios directo y configuración manual
  try {
    console.log('🚀 Test 2: Using direct axios with manual config...');
    const catalogUrl = getServiceUrl('catalog');
    const fullUrl = `${catalogUrl}/items`;
    
    console.log('🌐 Environment:', getCurrentEnvironment());
    console.log('🌐 Base URL:', catalogUrl);
    console.log('🌐 Full URL:', fullUrl);
    
    const response = await axios.get(fullUrl, {
      timeout: 30000, // Timeout más largo
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MediSupplyClientes/1.0 (Mobile; APK)',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      validateStatus: function (status) {
        return status < 500; // Resolver even for 4xx errors
      }
    });
    
    console.log('✅ SUCCESS with direct axios!');
    console.log('✅ Status:', response.status);
    console.log('✅ Headers:', JSON.stringify(response.headers, null, 2));
    console.log('✅ Data:', JSON.stringify(response.data, null, 2).substring(0, 500));
    
    return response.data;
  } catch (error: any) {
    console.error('💥 Test 2 FAILED with direct axios!');
    console.error('💥 Error message:', error?.message);
    console.error('💥 Error code:', error?.code);
    console.error('💥 Error stack:', error?.stack);
    
    // Información adicional de red
    console.error('💥 Network info:', {
      isNetworkError: error?.code === 'ERR_NETWORK',
      isTimeoutError: error?.code === 'ECONNABORTED',
      hasResponse: !!error?.response,
      hasRequest: !!error?.request
    });
    
    throw error;
  }
}