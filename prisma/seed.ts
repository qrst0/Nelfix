// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';

// initialize Prisma Client
const prisma = new PrismaClient();

const secret_pw = "d2ce3a75f152458eabbd83d35450511bd3d55304b6ee5647261fcc5c496549d3"; // pw: admin123

async function main() {

  const csvFilePath = path.resolve(__dirname, '../exported.csv');
  
  const headers = ["title", "desc", "director", "release_year", "genre", "price", "duration", "video_url", "cover_image_url"]
  
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8'});
  
  parse(fileContent, {
    delimiter: ',',
    columns: headers,
    relax_quotes: true,
  }, async (error, result) => {
    if (error) {
      console.error(error);
    }
    for(const res of result){
      const genre = res.genre.split(',')
      const recipe4 = await prisma.films.upsert({
        where: {id: 0},
        update: {},
        create: {
          title: res.title,
          description: res.desc,
          director: res.director,
          release_year: parseInt(res.release_year),
          genre: genre,
          price: parseInt(res.price),
          duration: parseInt(res.duration),
          video_url: res.video_url,
          cover_image_url: res.cover_image_url
        }
      });
      console.log(recipe4);
    }
  });
  const recipe1 = await prisma.users.upsert({
    where: { id:0 },
    update: {},
    create: {
      username: 'admin',
      fullname: 'admin',
      email: 'admin@gmail.com',
      password: secret_pw,
      admin: true
    }
  });
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