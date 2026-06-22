'use client';

import { useCart } from '../../lib/cart-context';
import { formatPrice } from '../../lib/utils';
import Link from 'next/link';
import { createCheckoutSession } from '../../lib/stripe-action';
import NavbarCartCounter from '../components/navbar-cart-counter';

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCart();

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-black text-indigo-600 tracking-tight">
              MEGA_SHOP 🛒
            </Link>
            <NavbarCartCounter />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-slate-950 tracking-tight mb-8">Twój Koszyk</h1>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-sm">
            <p className="text-lg font-medium text-slate-500">Twój koszyk jest pusty.</p>
            <Link
              href="/"
              className="mt-4 inline-flex h-10 items-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white transition-all hover:bg-indigo-700 shadow-sm"
            >
              Przejdź do sklepu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.product.id} className="flex p-6 items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-xl object-cover border border-slate-100 bg-slate-50"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.product.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Ilość: {item.quantity} szt.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-950">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 mt-1"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 font-medium">Razem do zapłaty:</p>
                <p className="text-2xl font-black text-slate-950 mt-0.5">{formatPrice(totalPrice)}</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={clearCart}
                  className="flex-1 sm:flex-none h-11 items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Wyczyść
                </button>
                <button
                  onClick={async () => {
                    const res = await createCheckoutSession(items);
                    if (res?.url) {
                      window.location.href = res.url;
                    } else {
                      alert('Wystąpił problem z połączeniem ze Stripe. Sprawdź klucz w .env.local');
                    }
                  }}
                  className="flex-1 sm:flex-none h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Przejdź do kasy (Stripe)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}