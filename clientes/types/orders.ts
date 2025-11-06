// Tipos para las órdenes del backend

export interface OrderAddress {
  city: string;
  country: string;
  state: string;
  street: string;
  zip_code: string;
}

export interface OrderItem {
  qty: number;
  sku: string;
}

export type OrderStatus = 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  address: OrderAddress;
  created_at: string;
  created_by_role: string;
  customer_id: string;
  id: string;
  items: OrderItem[];
  source: string;
  status: OrderStatus;
  user_name: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
}

// Helper para obtener el color y label del estado
export const getOrderStatusInfo = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: string }> = {
    NEW: {
      label: 'En preparación',
      color: '#ca8a04',
      bgColor: '#eab3081a',
      icon: 'pending-actions'
    },
    PROCESSING: {
      label: 'En preparación',
      color: '#ca8a04',
      bgColor: '#eab3081a',
      icon: 'pending-actions'
    },
    SHIPPED: {
      label: 'En ruta',
      color: '#2563eb',
      bgColor: '#3b82f61a',
      icon: 'local-shipping'
    },
    DELIVERED: {
      label: 'Entregado',
      color: '#15803d',
      bgColor: '#16a34a1a',
      icon: 'checkmark-circle'
    },
    CANCELLED: {
      label: 'Cancelado',
      color: '#dc2626',
      bgColor: '#ef44441a',
      icon: 'close-circle'
    }
  };

  return statusMap[status] || statusMap.NEW;
};
