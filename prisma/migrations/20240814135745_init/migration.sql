/*
  Warnings:

  - You are about to drop the column `history` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "history",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;
