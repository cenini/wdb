/*
  Warnings:

  - You are about to drop the `ItemPhoto` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `itemId` on table `Photo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ItemPhoto" DROP CONSTRAINT "ItemPhoto_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemPhoto" DROP CONSTRAINT "ItemPhoto_photoId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_itemId_fkey";

-- AlterTable
ALTER TABLE "Photo" ALTER COLUMN "itemId" SET NOT NULL;

-- DropTable
DROP TABLE "ItemPhoto";

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
