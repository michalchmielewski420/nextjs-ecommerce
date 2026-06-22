import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

// Inicjalizujemy Stripe przy użyciu Twojego klucza prywatnego z pliku .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  try {
    // Odbieramy ID produktu przesłane z frontendu
    const { productId } = await request.json();

    // 1. Wyciągamy produkt bezpośrednio z bazy danych Neon, aby zweryfikować cenę
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produkt nie istnieje' }, { status: 404 });
    }

    // 2. Tworzymy sesję płatności w Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Płatność kartą
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.image_url],
            },
            unit_amount: product.price, // Cena w groszach prosto z bazy Neon!
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Gdzie Stripe ma przekierować klienta po zakupie (wraca na localhost)
      success_url: `${request.headers.get('origin')}/?success=true`,
      cancel_url: `${request.headers.get('origin')}/product/${product.slug}?canceled=true`,
    });

    // Zwracamy adres URL do bezpiecznej płatności Stripe
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Błąd Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}