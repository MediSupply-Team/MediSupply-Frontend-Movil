import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/theme';

const mockClientDetails = {
  '1': {
    name: 'Dra. Sofia Ramirez',
    institution: 'Hospital San Lucas',
    id: '12345',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    address: 'Calle Principal #123, Ciudad',
    phone: '+57 310 123 4567',
    email: 'sofia.ramirez@sanlucas.com',
    visits: [
      { type: 'Visita', date: '20 de Mayo, 2024', icon: 'event-note', color: '#3b82f6' },
      { type: 'Pedido #789', date: '15 de Abril, 2024', icon: 'inventory-2', color: '#22c55e' },
    ],
  },
};

export default function ClienteDetalleScreen() {
  const { id } = useLocalSearchParams();
  const client = mockClientDetails[id as keyof typeof mockClientDetails] || mockClientDetails['1'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={Colors.light.neutral900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Cliente</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Client Profile */}
        <View style={styles.profileSection}>
          <Image source={{ uri: client.avatar }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.clientName}>{client.name}</Text>
            <Text style={styles.clientInstitution}>{client.institution}</Text>
            <Text style={styles.clientId}>ID: {client.id}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.contactItem}>
            <MaterialIcons name="location-on" size={20} color={Colors.light.neutral500} style={styles.contactIcon} />
            <View>
              <Text style={styles.contactLabel}>Dirección</Text>
              <Text style={styles.contactValue}>{client.address}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialIcons name="phone" size={20} color={Colors.light.neutral500} style={styles.contactIcon} />
            <View>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>{client.phone}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <MaterialIcons name="email" size={20} color={Colors.light.neutral500} style={styles.contactIcon} />
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{client.email}</Text>
            </View>
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial</Text>
          
          {client.visits.map((visit, index) => (
            <TouchableOpacity key={index} style={styles.historyItem}>
              <View style={[styles.historyIcon, { backgroundColor: `${visit.color}20` }]}>
                <MaterialIcons name={visit.icon as any} size={20} color={visit.color} />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>{visit.type}</Text>
                <Text style={styles.historyDate}>{visit.date}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={16} color={Colors.light.neutral400} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.primaryButton}>
            <MaterialIcons name="add-comment" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Registrar Visita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <MaterialIcons name="add-shopping-cart" size={20} color={Colors.light.neutral800} />
            <Text style={styles.secondaryButtonText}>Crear Pedido</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    flex: 1,
    textAlign: 'center',
    marginLeft: -32,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  profileInfo: {
    alignItems: 'center',
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.neutral900,
    marginBottom: 4,
  },
  clientInstitution: {
    fontSize: 18,
    color: Colors.light.neutral500,
    marginBottom: 4,
  },
  clientId: {
    fontSize: 14,
    color: Colors.light.neutral500,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.neutral900,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.neutral500,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: Colors.light.neutral800,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.neutral100,
    borderRadius: 8,
    marginBottom: 16,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.neutral900,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 14,
    color: Colors.light.neutral500,
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: Colors.light.neutral200,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.neutral200,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: Colors.light.neutral800,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
