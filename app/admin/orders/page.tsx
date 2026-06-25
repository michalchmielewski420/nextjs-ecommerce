import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

// Wymuszamy dynamiczne pobieranie danych przy każdym wejściu
export const dynamic = 'force-dynamic';

interface OrderType {
  id: string;
  items: string;
  total: number;
  status: string;
  createdAt: Date;
}

export default async function AdminOrdersPage() {
  // Pobieramy wszystkie zamówienia z SQLite, najnowsze na górze
  const orders = (await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  })) as OrderType[];

  // Obliczamy całkowity zarobek sklepu
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Nawigacja */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
          <div>
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              ← Powrót do sklepu
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Panel Zamówień Admina 📋</h1>
          </div>
          <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-sm text-right">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Całkowity przychód</p>
            <p className="text-2xl font-black">{(totalRevenue / 100).toFixed(2)} PLN</p>
          </div>
        </div>

        {/* Tabela zamówień */}
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg font-medium">Brak zarejestrowanych zamówień. Twój sklep czeka na pierwszego klienta! 🚀</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="p-5">ID Zamówienia</th>
                    <th className="p-5">Zakupione produkty</th>
                    <th className="p-5">Data</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Wartość</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 font-mono text-xs text-gray-400">#{order.id.slice(-8)}</td>
                      <td className="p-5 font-bold text-gray-900">{order.items}</td>
                      <td className="p-5 text-gray-500">{new Date(order.createdAt).toLocaleString('pl-PL')}</td>
                      <td className="p-5">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-md">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-5 text-right font-black text-gray-900">
                        {(order.total / 100).toFixed(2)} PLN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}