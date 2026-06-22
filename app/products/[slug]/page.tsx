import { PRODUCTS } from '../../../lib/data';
import { formatPrice } from '../../../lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '../../components/add-to-cart-button';
import NavbarCartCounter from '../../components/navbar-cart-counter';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // W Next.js 15 params są obietnicą (Promise), więc musimy je "odpakować" za pomocą await
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Szukamy produktu w naszej bazie danych po jego slugu
  const product = PRODUCTS.find((p) => p.slug === slug);

  // Jeśli użytkownik wpisze w URL coś, co nie istnieje, pokazujemy stronę 404
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-black text-indigo-600 tracking-tight">
              MEGA_SHOP 🛒
            </Link>
            <NavbarCartCounter />
          </div>
        </div>
      </nav>

      {/* Kontener główny produktu */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Link powrotny */}
        <Link href="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-8">
          ← Wróć do sklepu
        </Link>

        {/* Układ dwukolumnowy: Zdjęcie / Dane */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
          {/* Lewa kolumna: Zdjęcie */}
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Prawa kolumna: Szczegóły */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100/50">
                {product.category}
              </span>
              <h1 className="mt-4 text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <p className="mt-6 text-2xl font-black text-slate-950">
                {formatPrice(product.price)}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Opis produktu</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Sekcja zakupu */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-slate-500">Dostępność:</p>
                <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  W magazynie ({product.stock} szt.)
                </p>
              </div>

              {/* Na razie zwykły przycisk, który zaraz podkręcimy stanem Reacta */}
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}