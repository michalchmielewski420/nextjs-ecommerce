'use client';

import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/data";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setIsAdded(true);
    
    // Efekt kliknięcia – resetujemy tekst przycisku po 1.5 sekundy
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`w-full flex h-12 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] ${
        isAdded 
          ? 'bg-emerald-600 shadow-emerald-100' 
          : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700'
      }`}
    >
      {isAdded ? '✨ Dodano do koszyka!' : 'Dodaj do koszyka'}
    </button>
  );
}