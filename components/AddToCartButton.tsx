'use client';

import { useCart } from '@/lib/cart-context';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors text-center text-sm"
    >
      Dodaj do koszyka 🛒
    </button>
  );
}