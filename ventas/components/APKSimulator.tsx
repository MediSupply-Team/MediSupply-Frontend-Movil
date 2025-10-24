// components/APKSimulator.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getCurrentEnvironment, getServiceUrl } from '../config/baseUrl';
import { setForceAPKMode, isAPKMode } from '../config/apkSimulation';

export function APKSimulator() {
  const [isSimulating, setIsSimulating] = useState(isAPKMode());
  const environment = getCurrentEnvironment();
  
  const toggleAPKMode = () => {
    const newMode = !isSimulating;
    setForceAPKMode(newMode);
    setIsSimulating(newMode);
    
    Alert.alert(
      'APK Simulation Mode',
      newMode 
        ? '🎯 APK MODE ACTIVATED\n\n• Using production endpoints\n• APK headers & timeouts\n• Real APK behavior simulation' 
        : '🔧 DEVELOPMENT MODE\n\n• Back to local/dev endpoints\n• Standard headers & timeouts',
      [{ 
        text: 'OK', 
        onPress: () => {
          console.log('🔄 Restarting app with new mode...');
          // La app se actualizará automáticamente con el nuevo modo
        }
      }]
    );
  };
  
  if (!__DEV__) return null; // Solo mostrar en desarrollo
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: isSimulating ? '#ff4444' : '#4444ff' }
    ]}>
      <TouchableOpacity onPress={toggleAPKMode} style={styles.button}>
        <Text style={styles.modeText}>
          {isSimulating ? '📱 APK SIM' : '🔧 DEV'}
        </Text>
        <Text style={styles.envText}>
          {environment.toUpperCase()}
        </Text>
        <Text style={styles.urlText} numberOfLines={1}>
          {getServiceUrl('catalog').replace('http://', '')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    borderRadius: 8,
    padding: 8,
    minWidth: 80,
    zIndex: 1000,
  },
  button: {
    alignItems: 'center',
  },
  modeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  envText: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
  },
  urlText: {
    color: 'white',
    fontSize: 8,
    marginTop: 2,
    textAlign: 'center',
  },
});