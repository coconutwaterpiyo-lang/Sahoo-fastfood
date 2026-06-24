import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const CART_KEY = "sahoo_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === item.id);
      if (existing) {
        return c.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...c, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
