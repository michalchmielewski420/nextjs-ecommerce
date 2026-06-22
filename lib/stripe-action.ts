'use server';

import Stripe from 'stripe';
import { CartItem } from './cart-context';

export async function createCheckoutSession(cartItems: CartItem[]) {
  if (cartItems.length === 0) return { url: null };

  // 🚀 Usuwamy stąd apiVersion – teraz Stripe sam dopasuje wersję Dahlia z Twojego konta!
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:3000/cart/success`,
      cancel_url: `http://localhost:3000/cart`,
    });

    return { url: session.url };
  } catch (error) {
    console.error('DOKŁADNY BŁĄD STRIPE:', error);
    return { url: null };
  }
}