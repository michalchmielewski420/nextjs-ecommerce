'use client';

import { useEffect } from 'react';
import { useCart } from '../../../lib/cart-context';
import Link from 'next/link';

export default function SuccessPage() {
  const { clearCart } = useCart();

  // Czyścimy koszyk z localStorage zaraz po wejściu na stronę sukcesu
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl mb-6">
          ✓
        </div>
        <h1 className="text-3xl font-black text-slate-950 tracking-tight">
          Płatność udana!
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Dziękujemy za zakupy w naszym sklepie. Twoje zamówienie zostało przekazane do realizacji. Potwierdzenie wysłaliśmy na Twój e-mail.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="w-full flex h-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
          >
            Wróć do sklepu
          </Link>
        </div>
      </div>
    </main>
  );
}