'use client';

import { useState } from 'react';

export default function BuyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Coś poszło nie tak z płatnością: ' + data.error);
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('Wystąpił błąd podczas uruchamiania płatności.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      /* 🚀 TUTAJ: Dodane klasy cursor-pointer, hover:bg-blue-700 oraz disabled:cursor-not-allowed */
      className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-2xl shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Generowanie płatności...
        </span>
      ) : (
        'Kup teraz przez Stripe 💳'
      )}
    </button>
  );
}