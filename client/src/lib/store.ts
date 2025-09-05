import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, User, Order } from '@shared/schema';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl?: string;
}

interface StoreState {
  user: User | null;
  cart: CartItem[];
  currentOrder: Order | null;
  
  // User actions
  setUser: (user: User) => void;
  clearUser: () => void;
  
  // Cart actions
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Order actions
  setCurrentOrder: (order: Order) => void;
  clearCurrentOrder: () => void;
  
  // Computed values
  cartTotal: () => number;
  cartItemCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      currentOrder: null,

      // User actions
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // Cart actions
      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItemIndex = cart.findIndex(item => item.productId === product.id);
        
        if (existingItemIndex >= 0) {
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += quantity;
          set({ cart: updatedCart });
        } else {
          const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            unit: product.unit,
            imageUrl: product.imageUrl,
          };
          set({ cart: [...cart, newItem] });
        }
      },

      removeFromCart: (productId) => {
        const { cart } = get();
        set({ cart: cart.filter(item => item.productId !== productId) });
      },

      updateCartItemQuantity: (productId, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          set({ cart: cart.filter(item => item.productId !== productId) });
        } else {
          const updatedCart = cart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          );
          set({ cart: updatedCart });
        }
      },

      clearCart: () => set({ cart: [] }),

      // Order actions
      setCurrentOrder: (order) => set({ currentOrder: order }),
      clearCurrentOrder: () => set({ currentOrder: null }),

      // Computed values
      cartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      cartItemCount: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'ruralcart-store',
      partialize: (state) => ({ 
        user: state.user,
        cart: state.cart,
      }),
    }
  )
);
