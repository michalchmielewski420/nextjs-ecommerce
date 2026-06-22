import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

interface ProductType {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  createdAt: Date;
}

interface HomePageProps {
  searchParams: Promise<{ success?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const isSuccess = resolvedSearchParams.success === 'true';

  // Pobranie produktów z bazy danych Neon
  const products = (await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })) as ProductType[];

  // 🚀 FUNKCJA SERWEROWA: Usuwanie produktu z bazy danych
  async function deleteProduct(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    
    if (id) {
      // Usuwamy rekord z Neon DB pasujący do ID
      await prisma.product.delete({
        where: { id: id },
      });
      // Odświeżamy pamięć podręczną Next.js, żeby zmiany były widoczne natychmiast
      revalidatePath('/');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Baner sukcesu po zakupie */}
        {isSuccess && (
          <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-2xl flex items-center gap-3 animate-bounce">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold">Płatność zakończona sukcesem!</p>
              <p className="text-sm">Dziękujemy za zakupy. Potwierdzenie zostało wysłane na Twój e-mail.</p>
            </div>
          </div>
        )}

        {/* Nagłówek sklepu */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              MEGA_SHOP 🛒
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Wszystkie produkty ładowane dynamicznie z bazy danych PostgreSQL (Neon).
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/admin/add" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
              + Dodaj produkt
            </Link>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ● Połączono z Neon DB
            </span>
          </div>
        </div>

        {/* Siatka z produktami */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm border">
            <p className="text-gray-500 text-lg">Brak produktów w bazie. Dodaj coś przez panel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative"
              >
                {/* 🗑️ PRZYCISK USUWANIA (KOSZ) W PRAWYM GÓRNYM ROGU */}
                <form action={deleteProduct} className="absolute top-3 right-3 z-10">
                  <input type="hidden" name="id" value={product.id} />
                  <button 
                    type="submit" 
                    title="Usuń produkt z bazy danych"
                    className="p-2 bg-white/90 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-xl shadow-xs cursor-pointer border border-gray-100 transition-all duration-200"
                  >
                    🗑️
                  </button>
                </form>

                {/* Obrazek jako link */}
                <Link href={`/product/${product.slug}`} className="cursor-pointer aspect-square bg-gray-100 overflow-hidden relative block">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm">
                    {product.category}
                  </span>
                </Link>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <Link href={`/product/${product.slug}`} className="cursor-pointer block group/title">
                      <h2 className="text-lg font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors duration-200">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="text-xl font-black text-gray-900">
                      {(product.price / 100).toFixed(2)} <span className="text-sm font-normal text-gray-500">PLN</span>
                    </div>
                    <Link href={`/product/${product.slug}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
                      Szczegóły
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}