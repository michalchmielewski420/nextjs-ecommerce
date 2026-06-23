'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function NavbarCartCounter() {
  const { cartCount } = useCart();

  return (
    <Link 
      href="/cart" 
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer relative"
    >
      <span>🛒 Koszyk</span>
      {cartCount > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
          {cartCount}
        </span>
      )}
    </Link>
  );
}