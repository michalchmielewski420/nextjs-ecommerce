import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import AdminOrderCard from '@/components/AdminOrderCard'; // 🚀 IMPORT NOWEGO KOMPONENTU

const prisma = new PrismaClient();

interface OrderType {
  id: string;
  items: string;
  total: number;
  status: string;
  createdAt: Date;
}

interface AdminOrdersPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search;

  const whereConditions: any = {};
  if (searchQuery) {
    whereConditions.items = {
      contains: searchQuery
    };
  }

  const orders = (await prisma.order.findMany({
    where: whereConditions,
    orderBy: { createdAt: 'desc' }
  })) as OrderType[];

  const allOrders = (await prisma.order.findMany()) as OrderType[];
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = allOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  let totalItemsSold = 0;
  allOrders.forEach(order => {
    const matches = order.items.match(/\((\d+)\s*szt\.\)/g);
    if (matches) {
      matches.forEach(m => {
        const num = parseInt(m.replace(/[^\d]/g, ''));
        if (!isNaN(num)) totalItemsSold += num;
      });
    } else {
      totalItemsSold += 1;
    }
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Nawigacja */}
        <div className="mb-8">
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            ← Powrót do sklepu
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Panel Zamówień Admina 📋</h1>
          <p className="text-sm text-gray-400 mt-1">Centrum zarządzania i analityki sprzedaży MEGA_SHOP.</p>
        </div>

        {/* STATYSTYKI BIZNESOWE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
              <span>Całkowity obrót</span>
              <span className="text-lg">💰</span>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-2">
              {(totalRevenue / 100).toFixed(2)} <span className="text-xs font-normal text-gray-500">PLN</span>
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">● 100% zrealizowanych płatności</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
              <span>Zamówienia</span>
              <span className="text-lg">🛒</span>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-2">{totalOrders} <span className="text-xs font-normal text-gray-500">szt.</span></p>
            <p className="text-xs text-gray-400 mt-1">Wszystkie sesje SQLite</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
              <span>Średnia wartość (AOV)</span>
              <span className="text-lg">📊</span>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-2">
              {(averageOrderValue / 100).toFixed(2)} <span className="text-xs font-normal text-gray-500">PLN</span>
            </p>
            <p className="text-xs text-blue-600 font-medium mt-1">Wskaźnik koszyka klienta</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
              <span>Sprzedane sztuki</span>
              <span className="text-lg">📦</span>
            </div>
            <p className="text-2xl font-black text-gray-950 mt-2">{totalItemsSold} <span className="text-xs font-normal text-gray-500">szt.</span></p>
            <p className="text-xs text-purple-600 font-medium mt-1">Zdjęte automatycznie z magazynu</p>
          </div>
        </div>

        {/* PASEK WYSZUKIWANIA */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <form method="GET" action="/admin/orders" className="flex gap-2 w-full max-w-xl">
            <input 
              type="text" 
              name="search" 
              defaultValue={searchQuery || ''} 
              placeholder="Wyszukaj zamówienie po nazwie produktu..." 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" 
            />
            <button type="submit" className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors">
              Filtruj
            </button>
            {searchQuery && (
              <Link href="/admin/orders" className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-xl flex items-center transition-colors">
                X
              </Link>
            )}
          </form>
          <div className="text-xs font-medium text-gray-400">
            Znaleziono: <span className="font-bold text-gray-700">{orders.length}</span> pozycji
          </div>
        </div>

        {/* LISTA ZAMÓWIEŃ */}
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg font-medium">Nie znaleziono zamówień spełniających kryteria. 🔍</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              // 🚀 WYWOŁANIE NOWEGO DYNAMICZNEGO KOMPONENTU KARTY
              <AdminOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}