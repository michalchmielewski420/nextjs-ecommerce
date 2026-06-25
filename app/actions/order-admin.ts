'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// 🚀 Akcja zmiany statusu zamówienia
export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    console.error('Błąd aktualizacji statusu:', error);
    return { success: false, error: 'Nie udało się zmienić statusu.' };
  }
}

// 🚀 Akcja usuwania zamówienia z bazy
export async function deleteOrderAction(orderId: string) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    console.error('Błąd usuwania zamówienia:', error);
    return { success: false, error: 'Nie udało się usunąć zamówienia.' };
  }
}