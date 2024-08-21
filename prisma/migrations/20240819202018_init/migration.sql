-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fullname" TEXT NOT NULL DEFAULT '';
