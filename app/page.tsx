import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import LikeButton from '@/components/LikeButton';
import NavbarCartCounter from '@/components/NavbarCartCounter';
import AddToCartButton from '@/components/AddToCartButton'; // 🚀 IMPORT PRZYCISKU KOSZYKA

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
  likes: number; 
  stock: number; // Zabezpieczenie typu stock dla bazy danych
}

interface HomePageProps {
  searchParams: Promise<{ 
    success?: string; 
    category?: string;
    search?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const isSuccess = resolvedSearchParams.success === 'true';
  const selectedCategory = resolvedSearchParams.category;
  const searchQuery = resolvedSearchParams.search;

  const whereConditions: any = {};
  if (selectedCategory && selectedCategory !== 'all') {
    whereConditions.category = selectedCategory;
  }
  if (searchQuery) {
    whereConditions.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } }
    ];
  }

  const products = (await prisma.product.findMany({
    where: whereConditions,
    orderBy: { createdAt: 'desc' },
  })) as ProductType[];

  const allProductsForCategories = (await prisma.product.findMany({ 
    select: { category: true } 
  })) as { category: string }[];

  const categories: string[] = [
    'all', 
    ...(Array.from(new Set(allProductsForCategories.map((p: { category: string }) => p.category))) as string[])
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Baner sukcesu zakupów */}
        {isSuccess && (
          <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-4 shadow-xs">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-extrabold text-base">Płatność Stripe zakończona sukcesem!</p>
              <p className="text-sm text-emerald-600 mt-0.5">Zamówienie zostało przekazane do realizacji i zapisane w bazie admina.</p>
            </div>
            <Link href="/" className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors">
              Zamknij powiadomienie
            </Link>
          </div>
        )}

        {/* Nagłówek */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">MEGA_SHOP 🛒</h1>
            <p className="mt-2 text-sm text-gray-500">Zarządzaj i kupuj produkty prosto z lokalnej bazy SQLite.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <NavbarCartCounter />
            <Link href="/admin/orders" className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-100 transition-colors">
              📋 Zamówienia Admina
            </Link>
            <Link href="/admin/add" className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
              + Dodaj produkt
            </Link>
          </div>
        </div>

        {/* Filtry */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: string) => {
              const isActive = selectedCategory === cat || (!selectedCategory && cat === 'all');
              const linkUrl = cat === 'all' ? (searchQuery ? `/?search=${searchQuery}` : '/') : `/?category=${cat}${searchQuery ? `&search=${searchQuery}` : ''}`;
              return (
                <Link key={cat} href={linkUrl} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${isActive ? 'bg-blue-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat === 'all' ? 'Wszystko 🌟' : cat}
                </Link>
              );
            })}
          </div>
          <form method="GET" action="/" className="flex gap-2 w-full md:max-w-md">
            {selectedCategory && selectedCategory !== 'all' && <input type="hidden" name="category" value={selectedCategory} />}
            <input type="text" name="search" defaultValue={searchQuery || ''} placeholder="Wyszukaj produkt..." className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors">Szukaj</button>
          </form>
        </div>

        {/* Siatka produktów */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl shadow-sm border"><p className="text-gray-500 text-lg">Brak produktów. 🔍</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                
                {/* Kosz usuwania */}
                <form action={async function(formData) { 'use server'; await prisma.product.delete({ where: { id: formData.get('id') as string } }); revalidatePath('/'); }} className="absolute top-3 left-3 z-10">
                  <input type="hidden" name="id" value={product.id} />
                  <button type="submit" className="p-2 bg-white/90 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-xl shadow-xs cursor-pointer border border-gray-100 transition-all duration-200">🗑️</button>
                </form>

                {/* Przycisk ołówka edycji */}
                <Link href={`/admin/edit/${product.id}`} className="absolute top-3 left-14 z-10 p-2 bg-white/90 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-xl shadow-xs cursor-pointer border border-gray-100 transition-all duration-200 block text-xs">
                  ✏️
                </Link>

                {/* Przycisk polubienia */}
                <LikeButton productId={product.id} initialLikes={product.likes} />

                <Link href={`/product/${product.slug}`} className="cursor-pointer aspect-square bg-gray-100 overflow-hidden relative block">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-14 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm">{product.category}</span>
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex-1">
                    <Link href={`/product/${product.slug}`} className="cursor-pointer block group/title">
                      <h2 className="text-base font-bold text-gray-900 group-hover/title:text-blue-600 transition-colors duration-200 line-clamp-2 min-h-12">{product.name}</h2>
                    </Link>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 min-h-10">{product.description}</p>
                  </div>
                  
                  {/* Sekcja dolna: cena + akcje */}
                  <div className="mt-5 pt-4 border-t border-gray-50 flex flex-col gap-3">
                    <div className="text-xl font-black text-gray-900">
                      {(product.price / 100).toFixed(2)} <span className="text-sm font-normal text-gray-500">PLN</span>
                    </div>
                    
                    {/* 🚀 KOLEBKA PRZYCISKÓW: Zgrabny koszyk i szczegóły obok siebie */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <AddToCartButton product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image_url: product.image_url,
                          stock: product.stock
                        }} />
                      </div>
                      <Link 
                        href={`/product/${product.slug}`} 
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-colors whitespace-nowrap text-center h-fit"
                      >
                        Szczegóły
                      </Link>
                    </div>

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