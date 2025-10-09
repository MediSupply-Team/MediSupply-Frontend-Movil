import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/theme';

export default function RutaScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ruta</Text>
      </View>
      
      <View style={styles.content}>
        <MaterialIcons name="route" size={64} color={Colors.light.neutral400} />
        <Text style={styles.emptyTitle}>Próximamente</Text>
        <Text style={styles.emptySubtitle}>
          Aquí podrás planificar y seguir tu ruta de visitas
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.neutral100,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.neutral500,
    textAlign: 'center',
    lineHeight: 24,
  },
});
