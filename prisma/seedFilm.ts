// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy recipes
  const recipe1 = await prisma.films.upsert({
    where: {id: 0},
    update: {},
    create: {
      title: 'uwu',
      description: 'uwuw',
      director: 'dir1',
      release_year: 2003,
      genre: ['res1'],
      price: 20,
      duration: 10,
      video_url: 'ehehr',
    }
  });

  const recipe2 = await prisma.films.upsert({
    where: {id: 0},
    update: {},
    create: {
      title: 'uwu2',
      description: 'uwu3',
      director: 'dir2',
      release_year: 2004,
      genre: ['res2'],
      price: 22,
      duration: 12,
      video_url: 'ehehr',
    }
  });

  console.log({ recipe1, recipe2 });
}

// execute the main function
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });