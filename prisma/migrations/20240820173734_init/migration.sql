-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_filmId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_userId_fkey";

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Films"("id") ON DELETE CASCADE ON UPDATE CASCADE;
