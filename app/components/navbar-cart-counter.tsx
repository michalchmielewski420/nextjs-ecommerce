'use client';

import { useCart } from "../../lib/cart-context";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarCartCounter() {
  const { cartCount } = useCart();
  const [mounted, setMounted] = useState(false);

  // Upewniamy się, że stan z localStorage zsynchronizował się z przeglądarką
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link 
      href="/cart" 
      className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-95 shadow-sm"
    >
      Koszyk ({mounted ? cartCount : 0})
    </Link>
  );
}