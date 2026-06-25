import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { updateProductAction } from '@/app/actions/product';

const prisma = new PrismaClient();

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: EditPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
        
        <div className="mb-8">
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            ← Powrót do sklepu
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Edytuj Produkt ✏️</h1>
          <p className="text-sm text-gray-400 mt-1">Zmień parametry przedmiotu w bazie SQLite.</p>
        </div>

        <form action={updateProductAction} className="space-y-6">
          <input type="hidden" name="id" value={product.id} />

          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Nazwa produktu</label>
            <input type="text" name="name" defaultValue={product.name} required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Cena (PLN)</label>
              <input type="number" step="0.01" name="price" defaultValue={(product.price / 100).toFixed(2)} required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Stan magazynowy (Sztuki)</label>
              <input type="number" name="stock" defaultValue={product.stock} required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Kategoria</label>
            <input type="text" name="category" defaultValue={product.category} required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Opis produktu</label>
            <textarea name="description" rows={5} defaultValue={product.description} required className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>

          <button type="submit" className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-colors text-center text-sm">
            Zapisz zmiany i zaktualizuj baze 💾
          </button>
        </form>

      </div>
    </main>
  );
}