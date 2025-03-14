import { create } from 'zustand';

const useStore = create((set) => ({
  cart: [],
  user: null,
  addToCart: (item) => set((state) => ({ 
    cart: [...state.cart, item] 
  })),
  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== itemId)
  })),
  setUser: (user) => set({ user }),
  clearCart: () => set({ cart: [] }),
}));

export default useStore; 