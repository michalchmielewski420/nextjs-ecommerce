'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createOrderAction(cartItems: any[], totalAmount: number) {
  if (cartItems.length === 0) return;

  // 1. Mapujemy koszyk na prosty opis tekstowy do tabeli zamówień
  const itemsSummary = cartItems.map(item => `${item.name} (${item.quantity} szt.)`).join(', ');

  // 2. Zapisujemy zamówienie w bazie danych
  await prisma.order.create({
    data: {
      items: itemsSummary,
      total: totalAmount,
      status: 'Opłacone 🎉'
    }
  });

  // 3. 🚀 AUTOMATYCZNE ODEJMOWANIE Z MAGAZYNU:
  // Przechodzimy pętlą po każdym przedmiocie z koszyka i zmniejszamy jego stock w SQLite
  for (const item of cartItems) {
    await prisma.product.update({
      where: { id: item.id },
      data: {
        stock: {
          decrement: item.quantity // Odejmuje dokładnie tyle sztuk, ile kupiono!
        }
      }
    });
  }
}