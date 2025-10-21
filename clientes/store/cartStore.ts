import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  code: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  // Estado
  items: CartItem[];
  isOpen: boolean;
  
  // Acciones
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  
  // Selectores computados
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getItemById: (productId: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>((set, get) => ({
  // Estado inicial con algunos productos de prueba
  items: [
    {
      id: '1',
      name: 'Guantes de látex',
      price: 25.00,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
      code: 'GL-12345',
      stock: 35
    },
    {
      id: '2',
      name: 'Mascarillas N95',
      price: 25.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
      code: 'MN-67890',
      stock: 20
    },
    {
      id: '3',
      name: 'Desinfectante de manos',
      price: 25.00,
      quantity: 3,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
      code: 'DM-11223',
      stock: 50
    }
  ],
  isOpen: false,
  
  // Acciones
  addItem: (product: Product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si el producto ya existe, actualizar cantidad
        return {
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
              : item
          )
        };
      } else {
        // Si es un producto nuevo, agregarlo
        return {
          items: [...state.items, { ...product, quantity: Math.min(quantity, product.stock) }]
        };
      }
    });
  },
  
  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== productId)
    }));
  },
  
  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },
  
  // Selectores computados
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  
  getTotalPrice: () => {
    const subtotal = get().getSubtotal();
    const shipping = get().getShipping();
    return subtotal + shipping;
  },
  
  getSubtotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getShipping: () => {
    const subtotal = get().getSubtotal();
    return subtotal > 0 ? 10.00 : 0; // Envío gratis si no hay productos
  },
  
  getItemById: (productId: string) => {
    return get().items.find(item => item.id === productId);
  }
}));