import { PrismaClient } from '@prisma/client';
import { PRODUCTS } from '../lib/data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rozpoczynam zasiewanie bazy danych...');

  // Czyścimy bazę przed wrzuceniem danych
  await prisma.product.deleteMany();

  // Mapujemy produkty w pętli
  for (const product of PRODUCTS) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        description: product.description,
        image_url: product.image_url,
        category: product.category,
      },
    });
  }

  console.log('✅ Baza danych została pomyślnie zasilona produktami!');
}

main()
  .catch((e) => {
    console.error('❌ Wystąpił błąd podczas seedowania:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });