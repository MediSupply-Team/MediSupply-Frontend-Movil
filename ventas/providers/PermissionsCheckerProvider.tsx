import { router } from 'expo-router';
import { PropsWithChildren, useEffect } from 'react';
import { AppState } from 'react-native';

import { PermissionStatus } from '@/infrastructure/interfaces/location';

import { usePermissionsStore } from '../store/usePermissions';

const PermissionsCheckerProvider = ({ children }: PropsWithChildren) => {
  const { locationStatus, checkLocationPermission } = usePermissionsStore();

  useEffect(() => {
    if (locationStatus === PermissionStatus.GRANTED) {
      router.replace('/ruta');
    } else if (locationStatus !== PermissionStatus.CHECKING) {
      router.replace('/permissions/' as any); // Agregar as any temporalmente
    }
  }, [locationStatus]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
};
export default PermissionsCheckerProvider;