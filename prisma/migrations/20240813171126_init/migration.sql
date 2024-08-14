-- CreateTable
CREATE TABLE "Films" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "release_year" INTEGER NOT NULL,
    "genre" TEXT[],
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "video_url" TEXT NOT NULL,
    "cover_image_url" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Films_pkey" PRIMARY KEY ("id")
);
