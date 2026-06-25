import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface OrderType {
  id: string;
  items: string;
  total: number;
  status: string;
  createdAt: Date;
}

export default async function AdminOrdersPage() {
  const orders = (await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  })) as OrderType[];

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Nawigacja i Podsumowanie Finansowe */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
          <div>
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              ← Powrót do sklepu
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Panel Zamówień Admina 📋</h1>
            <p className="text-sm text-gray-400 mt-1">Liczba wszystkich zamówień: <span className="font-bold text-gray-700">{orders.length}</span></p>
          </div>
          <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-xs text-right sm:min-w-64">
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">Całkowity obrót sklepu</p>
            <p className="text-3xl font-black mt-1 text-blue-400">{(totalRevenue / 100).toFixed(2)} <span className="text-sm font-normal text-white">PLN</span></p>
          </div>
        </div>

        {/* Lista zamówień w formie ładnych kart fakturowych */}
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg font-medium">Brak zarejestrowanych zamówień. Sklep czeka na pierwszą sprzedaż! 🚀</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              // 🚀 PARSER: Rozbijamy tekst z bazy (rozdzielany przecinkami) na osobną tablicę obiektów
              const parsedItems = order.items.split(',').map(item => item.trim()).filter(Boolean);

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden hover:border-gray-200 transition-colors">
                  
                  {/* Belka górna zamówienia */}
                  <div className="bg-gray-50/70 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-gray-200/60 text-gray-600 px-2 py-1 rounded-md font-bold">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Zawartość zamówienia */}
                  <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    
                    {/* Lista produktów w zamówieniu */}
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Zakupione produkty:</p>
                      <ul className="space-y-1.5">
                        {parsedItems.map((productText, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                            <span className="text-blue-500">📦</span>
                            {productText}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Podsumowanie finansowe pojedynczej karty */}
                    <div className="md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8 flex-shrink-0 flex justify-between md:block">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kwota zamówienia</p>
                      <p className="text-xl font-black text-gray-950 mt-1">
                        {(order.total / 100).toFixed(2)} <span className="text-xs font-normal text-gray-500">PLN</span>
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}