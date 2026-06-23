import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: undefined as any, 
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Koszyk jest pusty' }, { status: 400 });
    }

    // MAPOWANIE KOSZYKA z zabezpieczeniem zdjęć
    const lineItems = items.map((item: any) => {
      // 🚀 ZABEZPIECZENIE: Stripe przyjmuje tylko pełne linki internetowe zaczynające się od http/https
      const hasValidImage = item.image_url && (item.image_url.startsWith('http://') || item.image_url.startsWith('https://'));
      
      return {
        price_data: {
          currency: 'pln',
          product_data: {
            name: item.name,
            // Jeśli link jest prawidłowy, dodajemy zdjęcie. Jeśli nie – pomijamy je, żeby Stripe nie wywalił błędu.
            images: hasValidImage ? [item.image_url] : [],
          },
          unit_amount: Math.round(item.price), // Zaokrąglamy na wypadek problemów z liczbami zmiennoprzecinkowymi
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?success=true`,
      cancel_url: `${req.headers.get('origin')}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    // 🔍 Podgląd błędu w terminalu VS Code (bardzo ułatwia diagnozę!)
    console.error('💥 CRITICAL STRIPE ERROR:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}