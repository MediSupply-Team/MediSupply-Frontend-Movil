import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../../global.css';

const mockClients = [
  {
    id: '1',
    name: 'Dr. Elena Ramirez',
    institution: 'Hospital General',
    avatar: 'ER',
    avatarColor: '#3b82f6',
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendoza',
    institution: 'Clínica Especializada',
    avatar: 'CM',
    avatarColor: '#22c55e',
  },
  {
    id: '3',
    name: 'Dra. Sofia Vargas',
    institution: 'Hospital Infantil',
    avatar: 'SV',
    avatarColor: '#f59e0b',
  },
  {
    id: '4',
    name: 'Dr. Ricardo Torres',
    institution: 'Clínica de Rehabilitación',
    avatar: 'RT',
    avatarColor: '#ef4444',
  },
  {
    id: '5',
    name: 'Dra. Laura Castro',
    institution: 'Hospital General',
    avatar: 'LC',
    avatarColor: '#8b5cf6',
  },
];

export default function ClientesScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchText.toLowerCase()) ||
    client.institution.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderClient = ({ item }: { item: typeof mockClients[0] }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-4 bg-white active:bg-neutral-50"
      onPress={() => router.push(`/cliente/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: item.avatarColor }}
      >
        <Text className="text-white text-base font-public-bold">
          {item.avatar}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-public-medium text-neutral-900 mb-1">
          {item.name}
        </Text>
        <Text className="text-sm text-neutral-500">
          {item.institution}
        </Text>
      </View>
      <MaterialIcons name="arrow-forward-ios" size={16} color="#a3a3a3" />
    </TouchableOpacity>
  );

  const renderSeparator = () => (
    <View className="h-px bg-neutral-100 ml-20" />
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-100" edges={['top']}>
      <View className="flex-1 bg-neutral-100">
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        
        {/* Header */}
        <View className="bg-white shadow-sm" style={{ 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 3,
        }}>
          {/* Header Top */}
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="w-8" />
            <Text className="text-xl font-public-bold text-neutral-900 flex-1 text-center">
              Clientes
            </Text>
            <TouchableOpacity className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center">
              <MaterialIcons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View className="px-4 pb-4">
            <View className="relative">
              <MaterialIcons 
                name="search" 
                size={20} 
                color="#737373" 
                className="absolute left-3 top-3 z-10"
                style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
              />
              <TextInput
                className="bg-neutral-100 rounded-3xl py-2 pl-10 pr-4 text-base text-neutral-900"
                placeholder="Buscar clientes"
                placeholderTextColor="#737373"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>
          
          {/* Filter Buttons */}
          <View className="flex-row gap-2 px-4 pb-3">
            <TouchableOpacity className="flex-row items-center bg-neutral-100 px-4 py-2 rounded-2xl gap-2">
              <Text className="text-sm font-public-medium text-neutral-900">
                Estado
              </Text>
              <MaterialIcons name="expand-more" size={16} color="#737373" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center bg-neutral-100 px-4 py-2 rounded-2xl gap-2">
              <Text className="text-sm font-public-medium text-neutral-900">
                Tipo de cliente
              </Text>
              <MaterialIcons name="expand-more" size={16} color="#737373" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Client List */}
        <FlatList
          data={filteredClients}
          renderItem={renderClient}
          keyExtractor={item => item.id}
          className="flex-1 bg-white"
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
    </SafeAreaView>
  );
}