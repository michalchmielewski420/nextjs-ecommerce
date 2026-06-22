'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './data';

// Definiujemy strukturę przedmiotu w koszyku (produkt + wybrana ilość)
export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 1. Po załadowaniu komponentu, wyciągamy koszyk z localStorage przeglądarki
  useEffect(() => {
    const savedCart = localStorage.getItem('mega_shop_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Błąd parsowania koszyka:', e);
      }
    }
  }, []);

  // 2. Za każdym razem, gdy zmienia się zawartość koszyka, zapisujemy go w localStorage
  useEffect(() => {
    if (items.length > 0 || localStorage.getItem('mega_shop_cart')) {
      localStorage.setItem('mega_shop_cart', JSON.stringify(items));
    }
  }, [items]);

  // 3. Funkcja dodawania do koszyka (jeśli produkt już jest, zwiększamy ilość)
  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  // 4. Usuwanie przedmiotu z koszyka
  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // 5. Czyszczenie całego koszyka (np. po udanej płatności)
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('mega_shop_cart');
  };

  // 6. Licznik wszystkich sztuk w koszyku (wyświetlany w navbarze)
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// Customowy hook, żeby łatwo wyciągać koszyk w dowolnym pliku
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart musi być użyty wewnątrz CartProvider');
  }
  return context;
}