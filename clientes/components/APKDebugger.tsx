// components/APKDebugger.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  StyleSheet,
  Modal,
  Share 
} from 'react-native';
import { apkLogger } from '@/utils/apkLogger';
import { testCatalogDirectly } from '@/utils/testCatalog';
import { testNetworkConnectivity } from '@/utils/networkTest';
import { getCurrentEnvironment, getServiceUrl } from '@/config/baseUrl';
import * as Constants from 'expo-constants';

export function APKDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    if (isVisible) {
      const currentLogs = apkLogger.getLogs();
      setLogs(currentLogs);
    }
  }, [isVisible]);
  
  const refreshLogs = () => {
    const currentLogs = apkLogger.getLogs();
    setLogs(currentLogs);
  };
  
  const clearLogs = () => {
    apkLogger.clearLogs();
    setLogs([]);
  };
  
  const shareLogs = async () => {
    try {
      const logsString = apkLogger.getLogsAsString();
      await Share.share({
        message: `MediSupply APK Debug Logs\n\n${logsString}`,
        title: 'APK Debug Logs'
      });
    } catch (error: any) {
      console.error('Failed to share logs:', error);
      Alert.alert('Error', 'No se pudieron compartir los logs');
    }
  };
  
  const runNetworkTest = async () => {
    try {
      // Test de conectividad completo primero
      await testNetworkConnectivity();
      
      // Luego test directo del catálogo
      await testCatalogDirectly();
      refreshLogs();
      Alert.alert('Test Completado', 'Revisa los logs para ver el resultado');
    } catch (error: any) {
      console.error('Network test failed:', error);
      refreshLogs();
      Alert.alert('Test Falló', 'Revisa los logs para ver el error');
    }
  };  const logEnvironmentInfo = () => {
    apkLogger.logEnvironmentInfo();
    refreshLogs();
  };
  
  if (!__DEV__) {
    // En APK real, mostrar botón flotante más pequeño
    return (
      <>
        <TouchableOpacity 
          style={styles.floatingDebugButton}
          onPress={() => setIsVisible(true)}
        >
          <Text style={styles.debugButtonText}>🐛</Text>
        </TouchableOpacity>
        
        <Modal
          visible={isVisible}
          animationType="slide"
          presentationStyle="formSheet"
        >
          <APKDebugModal 
            logs={logs}
            onClose={() => setIsVisible(false)}
            onRefresh={refreshLogs}
            onClear={clearLogs}
            onShare={shareLogs}
            onNetworkTest={runNetworkTest}
            onEnvironmentInfo={logEnvironmentInfo}
          />
        </Modal>
      </>
    );
  }
  
  // En desarrollo, mostrar botón normal
  return (
    <>
      <TouchableOpacity 
        style={styles.devDebugButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.debugButtonText}>🐛 Debug</Text>
      </TouchableOpacity>
      
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="formSheet"
      >
        <APKDebugModal 
          logs={logs}
          onClose={() => setIsVisible(false)}
          onRefresh={refreshLogs}
          onClear={clearLogs}
          onShare={shareLogs}
          onNetworkTest={runNetworkTest}
          onEnvironmentInfo={logEnvironmentInfo}
        />
      </Modal>
    </>
  );
}

function APKDebugModal({ 
  logs, 
  onClose, 
  onRefresh, 
  onClear, 
  onShare, 
  onNetworkTest,
  onEnvironmentInfo 
}: {
  logs: string[];
  onClose: () => void;
  onRefresh: () => void;
  onClear: () => void;
  onShare: () => void;
  onNetworkTest: () => void;
  onEnvironmentInfo: () => void;
}) {
  const environment = getCurrentEnvironment();
  const isAPK = !__DEV__;
  
  return (
    <View style={styles.modal}>
      <View style={styles.header}>
        <Text style={styles.title}>🐛 APK Debugger</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>
          📱 Mode: {isAPK ? 'APK' : 'Development'} | 
          🌍 Env: {environment.toUpperCase()} | 
          📋 Logs: {logs.length}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEnvironmentInfo}>
          <Text style={styles.actionText}>📊 Env Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onNetworkTest}>
          <Text style={styles.actionText}>🌐 Network Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
          <Text style={styles.actionText}>🔄 Refresh</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onClear}>
          <Text style={styles.actionText}>🗑️ Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Text style={styles.actionText}>📤 Share</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.logsContainer}>
        {logs.length === 0 ? (
          <Text style={styles.noLogs}>No logs available</Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} style={styles.logEntry}>
              {log}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingDebugButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  devDebugButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    zIndex: 1000,
  },
  debugButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  info: {
    padding: 15,
    backgroundColor: '#e3f2fd',
  },
  infoText: {
    fontSize: 12,
    color: '#1976d2',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    margin: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#2196f3',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logsContainer: {
    flex: 1,
    padding: 10,
  },
  logEntry: {
    fontSize: 10,
    fontFamily: 'monospace',
    marginBottom: 2,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  noLogs: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 50,
  },
});