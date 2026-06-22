'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function toggleLikeAction(productId: string, actionType: 'like' | 'unlike') {
  if (!productId) return;

  await prisma.product.update({
    where: { id: productId },
    data: {
      likes: {
        // Jeśli 'like' to dodajemy 1, jeśli 'unlike' to odejmujemy 1
        increment: actionType === 'like' ? 1 : -1
      }
    }
  });

  // Odświeżamy stronę główną, żeby pobrała nowe liczniki z bazy
  revalidatePath('/');
}