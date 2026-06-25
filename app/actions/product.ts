'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// 🚀 NOWA FUNKCJA: Dodawanie produktu ze stanem magazynowym
export async function createProductAction(formData: FormData) {
  const name = formData.get('name') as string;
  const price = Math.round(parseFloat(formData.get('price') as string) * 100); // PLN -> grosze
  const description = formData.get('description') as string;
  const image_url = formData.get('image_url') as string;
  const category = formData.get('category') as string;
  const stock = parseInt(formData.get('stock') as string) || 0; // Pobranie stanu magazynowego

  // Generujemy prosty slug z nazwy (małe litery, bez spacji)
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await prisma.product.create({
    data: {
      name,
      slug,
      price,
      description,
      image_url,
      category,
      stock, // Zapis do bazy SQLite
    },
  });

  revalidatePath('/');
  redirect('/');
}

// Istniejąca funkcja edycji (zostawiamy ją bez zmian)
export async function updateProductAction(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const price = Math.round(parseFloat(formData.get('price') as string) * 100);
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