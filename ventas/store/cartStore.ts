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
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  // Estado inicial
  items: [],
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
    // Envío gratis si el subtotal es mayor a $100, sino $10
    return subtotal > 100 ? 0 : 10;
  },
  
  getItemQuantity: (productId: string) => {
    const item = get().items.find(item => item.id === productId);
    return item?.quantity || 0;
  }
}));