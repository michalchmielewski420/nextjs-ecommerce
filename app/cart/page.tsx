'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { createOrderAction } from '@/app/actions/order';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (items.length === 0 || isLoading) return;

    setIsLoading(true);
    const loadingToast = toast.loading('Inicjalizacja bezpiecznej płatności Stripe...');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.url) {
        await createOrderAction(items, totalPrice);
        clearCart();
        
        toast.dismiss(loadingToast);
        window.location.href = data.url;
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.error || 'Nie udało się wygenerować płatności Stripe.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Błąd kasy:', err);
      toast.dismiss(loadingToast);
      toast.error('Wystąpił problem podczas łączenia z systemem płatności.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
          <div>
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              ← Kontynuuj zakupy
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Twój Koszyk 🛒</h1>
          </div>
          {items.length > 0 && (
            <button 
              onClick={() => {
                clearCart();
                toast.success('Koszyk został wyczyszczony', { id: 'clear-cart-success' });
              }} 
              disabled={isLoading} 
              className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Wyczyść koszyk
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg font-medium">Twój koszyk jest pusty. 🌟</p>
            <Link href="/" className="mt-4 inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors">
              Przeglądaj produkty
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => {
                const maxStock = item.stock ?? 99;
                const isPlusDisabled = item.quantity >= maxStock;

                return (
                  <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-950 text-sm sm:text-base line-clamp-1">{item.name}</h3>
                      
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => {
                            updateQuantity(item.id, item.quantity - 1);
                            if (item.quantity === 1) toast.success('Usunięto produkt z koszyka', { id: `remove-${item.id}` });
                          }}
                          disabled={isLoading}
                          className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-bold flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (!isPlusDisabled) {
                              updateQuantity(item.id, item.quantity + 1);
                            } else {
                              // 🚀 POPRAWKA: Przekazujemy unikalne id oparte o ID produktu. 
                              // Dzięki temu bez względu na to, ile razy klikniesz, wyskoczy tylko JEDEN dymek!
                              toast.error('Nie możesz dodać więcej sztuk – brak w magazynie!', {
                                id: `stock-limit-${item.id}`,
                              });
                            }
                          }}
                          disabled={isLoading}
                          className={`w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${
                            isPlusDisabled
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer'
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-black text-gray-950 mt-2">
                        {((item.price * item.quantity) / 100).toFixed(2)} PLN
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success('Usunięto produkt', { id: `delete-${item.id}` });
                      }} 
                      disabled={isLoading} 
                      className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all cursor-pointer border border-transparent hover:border-red-100 disabled:opacity-50"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Podsumowanie</h2>
                <div className="flex items-center justify-between text-sm mt-4 text-gray-600">
                  <span>Wartość koszyka:</span>
                  <span className="font-semibold text-gray-900">{(totalPrice / 100).toFixed(2)} PLN</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2 text-gray-600">
                  <span>Dostawa:</span>
                  <span className="text-green-600 font-bold uppercase tracking-wide text-xs">Gratis 🎉</span>
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between text-lg font-black text-gray-900">
                  <span>Do zapłaty:</span>
                  <span>{(totalPrice / 100).toFixed(2)} PLN</span>
                </div>
              </div>

              <button onClick={handleCheckout} disabled={isLoading} className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-center block disabled:bg-gray-400">
                Zapłać ze Stripe 💳
              </button>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}