import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton'; // 🚀 IMPORT NOWEGO PRZYCISKU

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug: slug },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-gray-100">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            ← Powrót do sklepu
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-12">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4">
                {product.name}
              </h1>
              <div className="text-3xl font-black text-gray-900 mt-4">
                {(product.price / 100).toFixed(2)} <span className="text-lg font-normal text-gray-500">PLN</span>
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Opis produktu</h3>
                <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-100">
              {/* 🚀 WRZUCAMY PRZYCISK DODAWANIA DO KOSZYKA */}
              <AddToCartButton product={{
  id: product.id,
  name: product.name,
  price: product.price,
  image_url: product.image_url,
  stock: product.stock // 🚀 DOPISZ TĘ LINIJKĘ
}} />
              <p className="text-center text-xs text-gray-400 mt-3">
                Darmowa wysyłka od 200 PLN • Płatności SQLite + Stripe
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}