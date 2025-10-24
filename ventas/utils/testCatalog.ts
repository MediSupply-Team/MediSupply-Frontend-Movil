// Test directo en la app para debugging
import axios from 'axios';
import { getCurrentEnvironment, getServiceUrl } from '../config/baseUrl';

export async function testCatalogDirectly() {
  console.log('🔧 TESTING CATALOG DIRECTLY FROM VENTAS APP');
  console.log('══════════════════════════════════════════════════════════════════════════════════════════');
  
  try {
    const catalogUrl = getServiceUrl('catalog');
    const fullUrl = `${catalogUrl}/items`;
    
    console.log('🚀 Making direct catalog request...');
    console.log('🌐 Environment:', getCurrentEnvironment());
    console.log('🌐 Base URL:', catalogUrl);
    console.log('🌐 Full URL:', fullUrl);
    
    const response = await axios.get(fullUrl, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MediSupplyVentas/1.0 (Mobile; APK)',
      }
    });
    
    console.log('✅ SUCCESS!');
    console.log('✅ Status:', response.status);
    console.log('✅ Headers:', JSON.stringify(response.headers, null, 2));
    console.log('✅ Data keys:', Object.keys(response.data || {}));
    
    if (response.data?.items) {
      console.log('✅ Items count:', response.data.items.length);
      console.log('✅ First item:', JSON.stringify(response.data.items[0], null, 2));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('💥 CATALOG TEST FAILED!');
    console.error('💥 Error message:', error?.message);
    console.error('💥 Error code:', error?.code);
    
    if (error?.response) {
      console.error('💥 Response status:', error.response.status);
      console.error('💥 Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error?.request) {
      console.error('💥 Request info:', error.request);
    }
    
    throw error;
  }
}