import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PedidosScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-gray-800">Pedidos</Text>
        <Text className="text-gray-500 mt-2">Pantalla de pedidos en construcción</Text>
      </View>
    </SafeAreaView>
  );
}
