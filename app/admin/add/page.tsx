import Link from 'next/link';
import { createProductAction } from '@/app/actions/product'; // 🚀 IMPORT ZAKTUALIZOWANEJ AKCJI

export default function AdminAddProductPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
        
        <div className="mb-8">
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            ← Powrót do sklepu
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Dodaj Nowy Produkt 🆕</h1>
          <p className="text-sm text-gray-400 mt-1">Wprowadź dane, aby zasilić bazę danych SQLite.</p>
        </div>

        <form action={createProductAction} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Nazwa produktu</label>
            <input type="text" name="name" placeholder="np. Szybki dysk SSD NVMe" required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Cena (PLN)</label>
              <input type="number" step="0.01" name="price" placeholder="299.99" required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
            </div>
            {/* 🚀 NOWE POLE: Stan magazynowy */}
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Ilość na magazynie</label>
              <input type="number" name="stock" placeholder="5" defaultValue="5" required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Link do zdjęcia (URL)</label>
            <input type="url" name="image_url" placeholder="https://images.unsplash.com/..." required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Kategoria</label>
            <input type="text" name="category" placeholder="Elektronika" required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Opis produktu</label>
            <textarea name="description" rows={4} placeholder="Wpisz szczegółowy opis przedmiotu..." required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>

          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors text-center text-sm">
            Dodaj produkt do sklepu 🚀
          </button>
        </form>

      </div>
    </main>
  );
}