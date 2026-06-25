'use client';

import { useCart } from '@/lib/cart-context';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number; // 🚀 DODAJEMY STAN MAGAZYNOWY
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, items } = useCart();

  // Sprawdzamy, ile sztuk tego produktu użytkownik ma już wrzucone do koszyka
  const itemInCart = items.find((i) => i.id === product.id);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;

  // Produkt jest niedostępny, jeśli ogólny stock to 0 LUB użytkownik chce dodać więcej niż jest w magazynie
  const isOutOfStock = product.stock <= 0 || cartQuantity >= product.stock;

  return (
    <button
      onClick={() => !isOutOfStock && addToCart(product)}
      disabled={isOutOfStock}
      className={`w-full py-3 font-bold rounded-xl shadow-xs cursor-pointer transition-colors text-center text-sm ${
        isOutOfStock
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {product.stock <= 0 
        ? 'Brak w magazynie ❌' 
        : isOutOfStock 
        ? 'Osiągnięto limit magazynu 📦' 
        : 'Dodaj do koszyka 🛒'}
    </button>
  );
}