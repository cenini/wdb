/*
  Warnings:

  - Added the required column `ownerId` to the `Outfit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Outfit" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Outfit" ADD CONSTRAINT "Outfit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
