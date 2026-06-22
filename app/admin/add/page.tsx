import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

export default function AddProductPage() {
  // Funkcja Server Action - wykona się bezpiecznie bezpośrednio na serwerze!
  async function createProduct(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const priceInput = formData.get('price') as string;
    const image_url = formData.get('image_url') as string;
    const category = formData.get('category') as string;

    // Walidacja - upewniamy się, że podstawowe pola są uzupełnione
    if (!name || !slug || !priceInput || !image_url) {
      return;
    }

    // Zamieniamy cenę wpisaną przez admina (np. 149.99) na grosze (14999) dla bazy i Stripe
    const priceInCents = Math.round(parseFloat(priceInput) * 100);

    // Zapisujemy nowy produkt w bazie danych Neon
    await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-'), // Czyszczenie sluga ze spacji i znaków specjalnych
        description: description || 'Brak opisu.',
        price: priceInCents,
        image_url,
        category: category || 'Inne',
      },
    });

    // Po pomyślnym dodaniu, przekierowujemy admina na stronę główną, żeby zobaczył efekt
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
        
        {/* Nagłówek */}
        <div className="border-b border-gray-100 pb-5 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Panel Administratora ⚙️</h1>
            <p className="text-sm text-gray-500 mt-1">Dodaj nowy produkt bezpośrednio do bazy danych Neon DB.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline">
            Sklep →
          </Link>
        </div>

        {/* Formularz połączony z Server Action */}
        <form action={createProduct} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nazwa produktu</label>
            <input type="text" name="name" required placeholder="np. Klawiatura Mechaniczna RGB" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-blue-500 text-gray-900 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Slug (część adresu URL)</label>
            <input type="text" name="slug" required placeholder="np. klawiatura-mechaniczna-rgb" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-blue-500 text-gray-900 text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cena w PLN (np. 199.99)</label>
              <input type="number" name="price" step="0.01" required placeholder="199.99" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-blue-500 text-gray-900 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategoria</label>
              <input type="text" name="category" required placeholder="np. Elektronika" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-blue-500 text-gray-900 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Link do zdjęcia (URL)</label>
            <input type="url" name="image_url" required placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-blue-500 text-gray-900 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Opis produktu</label>
            <textarea name="description" rows={4} placeholder="Wpisz szczegółowy opis produktu..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-blue-500 text-gray-900 text-sm resize-none"></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold py-4 rounded-xl shadow-xs transition-colors duration-200 text-sm">
            Zapisz produkt w bazie danych 🚀
          </button>
        </form>

      </div>
    </main>
  );
}