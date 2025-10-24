// APK Debugger - Interfaz completa de debugging para APK
// Permite ver logs, probar conexiones de red, y diagnosticar problemas
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Share,
  Alert,
  Dimensions 
} from 'react-native';
import { apkLogger } from '@/utils/apkLogger';
import { testCatalogDirectly } from '@/utils/testCatalog';
import { getCurrentEnvironment, getServiceUrl } from '@/config/baseUrl';
import * as Constants from 'expo-constants';

export const APKDebugger: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'network' | 'environment'>('logs');
  const [isTestingNetwork, setIsTestingNetwork] = useState(false);

  const refreshLogs = () => {
    const allLogs = apkLogger.getLogs();
    setLogs(allLogs);
  };

  useEffect(() => {
    if (modalVisible) {
      refreshLogs();
    }
  }, [modalVisible]);

  const handleShareLogs = async () => {
    const logsString = apkLogger.getLogsAsString();
    const stats = apkLogger.getLogStats();
    
    const debugInfo = `
🔍 APK Debug Report - Ventas App
📱 Platform: ${Constants.default.platform?.ios ? 'iOS' : 'Android'}
🏗️ Environment: ${getCurrentEnvironment()}
📊 Stats: ${stats.total} logs, ${stats.errors} errors, ${stats.networkErrors} network errors

=== LOGS ===
${logsString}
    `.trim();

    try {
      await Share.share({
        message: debugInfo,
        title: 'APK Debug Report - Ventas'
      });
    } catch {
      Alert.alert('Error', 'No se pudo compartir el reporte');
    }
  };

  const testNetworkConnectivity = async () => {
    setIsTestingNetwork(true);
    try {
      apkLogger.clearLogs();
      console.log('🧪 Starting network connectivity test from Ventas app...');
      
      // Test directo del catálogo
      await testCatalogDirectly();
      
      console.log('✅ Network test completed');
      refreshLogs();
    } catch (error) {
      console.error('❌ Network test failed:', error);
      refreshLogs();
    } finally {
      setIsTestingNetwork(false);
    }
  };

  const getEnvironmentInfo = () => {
    return {
      environment: getCurrentEnvironment(),
      catalogUrl: getServiceUrl('catalog'),
      rutasUrl: getServiceUrl('rutas'),
      ordersUrl: getServiceUrl('orders'),
      platform: Constants.default.platform?.ios ? 'iOS' : 'Android',
      appVersion: Constants.default.manifest?.version || 'Unknown',
      expoVersion: Constants.default.expoVersion
    };
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'logs':
        return (
          <ScrollView style={{ maxHeight: 400 }}>
            {logs.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                No hay logs disponibles
              </Text>
            ) : (
              logs.map((log, index) => (
                <View 
                  key={index}
                  style={{
                    padding: 8,
                    marginBottom: 4,
                    backgroundColor: 
                      log.level === 'error' ? '#ffebee' :
                      log.level === 'warn' ? '#fff8e1' :
                      log.level === 'network' ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: 4
                  }}
                >
                  <Text style={{ fontSize: 10, color: '#666' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </Text>
                  <Text style={{ 
                    fontSize: 12, 
                    color: log.level === 'error' ? '#d32f2f' : '#333'
                  }}>
                    [{log.level.toUpperCase()}] {log.message}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        );

      case 'network':
        const networkLogs = logs.filter(log => log.level === 'network');
        return (
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: isTestingNetwork ? '#ccc' : '#2196F3',
                padding: 12,
                borderRadius: 6,
                marginBottom: 16
              }}
              onPress={testNetworkConnectivity}
              disabled={isTestingNetwork}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                {isTestingNetwork ? 'Probando conexión...' : 'Probar Conectividad'}
              </Text>
            </TouchableOpacity>

            <ScrollView style={{ maxHeight: 350 }}>
              {networkLogs.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#666' }}>
                  No hay logs de red disponibles
                </Text>
              ) : (
                networkLogs.map((log, index) => (
                  <View 
                    key={index}
                    style={{
                      padding: 8,
                      marginBottom: 4,
                      backgroundColor: log.extra?.success ? '#e8f5e8' : '#ffebee',
                      borderRadius: 4
                    }}
                  >
                    <Text style={{ fontSize: 10, color: '#666' }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {log.message}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        );

      case 'environment':
        const envInfo = getEnvironmentInfo();
        return (
          <ScrollView style={{ maxHeight: 400 }}>
            <View style={{ padding: 16 }}>
              {Object.entries(envInfo).map(([key, value]) => (
                <View key={key} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#333' }}>
                    {key.toUpperCase()}:
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    {String(value)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  const stats = apkLogger.getLogStats();

  return (
    <>
      {/* Botón flotante de debug */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          backgroundColor: '#FF5722',
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          zIndex: 1000
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>🐛</Text>
      </TouchableOpacity>

      {/* Modal de debugging */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: Dimensions.get('window').height * 0.8
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>APK Debugger</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 18, color: '#666' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 16,
              padding: 12,
              backgroundColor: '#f5f5f5',
              borderRadius: 8
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{stats.total}</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>Total</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#d32f2f' }}>{stats.errors}</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>Errores</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2196F3' }}>{stats.networkSuccess}</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>Red OK</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ff9800' }}>{stats.networkErrors}</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>Red Error</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={{
              flexDirection: 'row',
              marginBottom: 16
            }}>
              {['logs', 'network', 'environment'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={{
                    flex: 1,
                    padding: 8,
                    alignItems: 'center',
                    backgroundColor: activeTab === tab ? '#2196F3' : '#f0f0f0',
                    marginRight: tab === 'environment' ? 0 : 4,
                    borderRadius: 4
                  }}
                  onPress={() => setActiveTab(tab as any)}
                >
                  <Text style={{
                    color: activeTab === tab ? 'white' : '#333',
                    fontSize: 12,
                    fontWeight: activeTab === tab ? 'bold' : 'normal'
                  }}>
                    {tab === 'logs' ? 'Logs' : tab === 'network' ? 'Red' : 'Entorno'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Content */}
            {renderTabContent()}

            {/* Actions */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16
            }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ff9800',
                  padding: 12,
                  borderRadius: 6,
                  flex: 1,
                  marginRight: 8
                }}
                onPress={() => {
                  apkLogger.clearLogs();
                  refreshLogs();
                }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                  Limpiar Logs
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#4CAF50',
                  padding: 12,
                  borderRadius: 6,
                  flex: 1,
                  marginLeft: 8
                }}
                onPress={handleShareLogs}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                  Compartir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};