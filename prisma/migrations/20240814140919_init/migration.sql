-- CreateTable
CREATE TABLE "History" (
    "userId" INTEGER NOT NULL,
    "filmId" INTEGER NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("userId","filmId")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
