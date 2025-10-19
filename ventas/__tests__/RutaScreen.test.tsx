import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import RutaScreen from '@/app/(tabs)/ruta';

// ===== Mocks de módulos nativos/terceros =====
jest.mock('react-native-maps');
jest.mock('@expo/vector-icons/MaterialIcons');
jest.mock('@/components/CalendarDrawer', () => require('../__mocks__/components__CalendarDrawer'));

// ===== Mocks de hooks =====
jest.mock('@/hooks/useRutas', () => ({ useRutas: jest.fn() }));
jest.mock('@/store/usePermissions', () => ({ usePermissionsStore: jest.fn() }));

import { useRutas } from '@/hooks/useRutas';
import { usePermissionsStore } from '@/store/usePermissions';

const mockUseRutas = useRutas as unknown as jest.Mock;
const mockUsePermissionsStore = usePermissionsStore as unknown as jest.Mock;

function baseUseRutas(overrides: Partial<any> = {}) {
  const base = {
    data: { visitas: [] as any[] },
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    isRefetching: false,
  };
  return { ...base, ...overrides };
}

function basePerms(overrides: Partial<any> = {}) {
  const base = {
    locationStatus: 'whatever',
    requestLocationPermission: jest.fn(),
    checkLocationPermission: jest.fn(),
  };
  return { ...base, ...overrides };
}

describe('RutaScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-10-10T12:00:00Z'));
    mockUsePermissionsStore.mockReturnValue(basePerms());
    mockUseRutas.mockReturnValue(baseUseRutas());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('muestra el placeholder cuando el permiso NO es concedido', () => {
    render(<RutaScreen />);
    expect(screen.getByText('🗺️ Aquí se mostrará el mapa')).toBeTruthy();
  });

  it('renderiza la lista con las visitas del hook', () => {
    mockUseRutas.mockReturnValue(
      baseUseRutas({
        data: {
          visitas: [
            { id: 1, cliente: 'Fundación Santa Fe de Bogotá', hora: '09:00', lat: 4.67, lng: -74.05 },
            { id: 2, cliente: 'Clínica del Country', hora: '11:00', lat: 4.67, lng: -74.06 },
          ],
        },
      }),
    );

    render(<RutaScreen />);
    expect(screen.getByText('Fundación Santa Fe de Bogotá')).toBeTruthy();
    expect(screen.getByText('Clínica del Country')).toBeTruthy();
    expect(screen.getAllByTestId('icon-chevron-right')).toHaveLength(2);
  });

  it('estado de carga y error', () => {
    mockUseRutas.mockReturnValue(baseUseRutas({ isLoading: true }));
    const { rerender } = render(<RutaScreen />);
    expect(screen.getByText(/Cargando visitas/i)).toBeTruthy();

    mockUseRutas.mockReturnValue(baseUseRutas({ isError: true, error: { message: 'Falla API' } }));
    rerender(<RutaScreen />);
    expect(screen.getByText(/Falla API/i)).toBeTruthy();
  });

  it('cuando permisos no concedidos: CTA dispara handlers', () => {
    const requestLocationPermission = jest.fn();
    const checkLocationPermission = jest.fn();

    mockUsePermissionsStore.mockReturnValue(
      basePerms({
        locationStatus: 'no-granted',
        requestLocationPermission,
        checkLocationPermission,
      }),
    );

    render(<RutaScreen />);

    fireEvent.press(screen.getByText(/Habilitar ubicación/i));
    expect(requestLocationPermission).toHaveBeenCalled();

    fireEvent.press(screen.getByText(/Verificar estado/i));
    expect(checkLocationPermission).toHaveBeenCalled();
  });

  it('abre CalendarDrawer y cambiar fecha provoca refetch', () => {
    const refetch = jest.fn();
    mockUseRutas.mockReturnValue(baseUseRutas({ refetch }));

    render(<RutaScreen />);

    fireEvent.press(screen.getByTestId('icon-event'));
    expect(screen.getByTestId('calendar-drawer')).toBeTruthy();

    // Usa el testID del botón del mock
    fireEvent.press(screen.getByTestId('calendar-select-2025-10-11'));
    expect(refetch).toHaveBeenCalled();
  });

  it('fecha formateada en el header (es-ES)', () => {
    render(<RutaScreen />);
    expect(screen.getByText(/octubre/i)).toBeTruthy();
    expect(screen.getByText(/2025/i)).toBeTruthy();
  });
});
