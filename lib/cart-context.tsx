'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Typ pojedynczego produktu w koszyku
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 1. Po załadowaniu strony wyciągamy koszyk z LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('mega_shop_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // 2. Za każdym razem gdy koszyk się zmienia, zapisujemy go w LocalStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('mega_shop_cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('mega_shop_cart');
    }
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === newItem.id);
      if (existingItem) {
        // Jeśli produkt już jest w koszyku, zwiększamy ilość o 1
        return prevItems.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Jeśli to nowy produkt, dodajemy go z ilością 1
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  // Licznik wszystkich sztuk w koszyku
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}