-- CreateTable
CREATE TABLE "OutfitPhoto" (
    "id" TEXT NOT NULL,
    "url" VARCHAR(256) NOT NULL,
    "publicId" VARCHAR(256) NOT NULL,
    "outfitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OutfitPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutfitPhoto_url_key" ON "OutfitPhoto"("url");

-- CreateIndex
CREATE UNIQUE INDEX "OutfitPhoto_publicId_key" ON "OutfitPhoto"("publicId");

-- AddForeignKey
ALTER TABLE "OutfitPhoto" ADD CONSTRAINT "OutfitPhoto_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "Outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
