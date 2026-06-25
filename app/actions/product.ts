'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateProductAction(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const price = Math.round(parseFloat(formData.get('price') as string) * 100); // Zamiana PLN na grosze
  const description = formData.get('description') as string;
  const stock = parseInt(formData.get('stock') as string);
  const category = formData.get('category') as string;

  await prisma.product.update({
    where: { id: id },
    data: {
      name,
      price,
      description,
      stock,
      category,
    },
  });

  revalidatePath('/');
  redirect('/');
}