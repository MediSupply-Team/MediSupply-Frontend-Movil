import ThemedPressable from '@/components/ThemedPressable';
import { ThemedText } from '@/components/themed-text';
import { usePermissionsStore } from '@/store/usePermissions';
import { View } from 'react-native';

const PermissionsScreen = () => {
  const { locationStatus, requestLocationPermission } = usePermissionsStore();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ThemedPressable onPress={requestLocationPermission}>
        Habilitar ubicación
      </ThemedPressable>

      <ThemedText>Estado actual: {locationStatus}</ThemedText>
    </View>
  );
};
export default PermissionsScreen;