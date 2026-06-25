'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, items } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const itemInCart = items.find((i) => i.id === product.id);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;
  const isOutOfStock = product.stock <= 0 || cartQuantity >= product.stock;

  // Efekt powrotu przycisku do normy po 3 sekundach
  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => setIsAdded(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAdded]);

  const handleAdd = () => {
    if (isOutOfStock) return;
    
    addToCart(product);
    setIsAdded(true); // Uruchamiamy stan sukcesu
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Główny przycisk dodawania */}
      <button
        onClick={handleAdd}
        disabled={isOutOfStock}
        className={`w-full py-3.5 font-bold rounded-xl shadow-xs cursor-pointer transition-all duration-300 text-center text-sm transform active:scale-98 ${
          isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isAdded
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white scale-100'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {product.stock <= 0 ? (
          'Brak w magazynie ❌'
        ) : isOutOfStock ? (
          'Osiągnięto limit magazynu 📦'
        ) : isAdded ? (
          <span className="flex items-center justify-center gap-2 animate-fade-in">
            Dodano do koszyka! ✓
          </span>
        ) : (
          'Dodaj do koszyka 🛒'
        )}
      </button>

      {/* 🚀 DYNAMICZNY PRZYCISK PRZEJŚCIA DO KOSZYKA (Wysuwa się płynnie) */}
      <div 
        className={`transition-all duration-300 ease-out overflow-hidden ${
          isAdded ? 'max-h-14 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <Link
          href="/cart"
          className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-center text-sm block transition-colors shadow-xs"
        >
          Przejdź do koszyka ➔
        </Link>
      </div>
    </div>
  );
}