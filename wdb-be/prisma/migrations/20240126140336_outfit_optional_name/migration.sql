/*
  Warnings:

  - You are about to drop the column `name` on the `OutfitItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Outfit" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "OutfitItem" DROP COLUMN "name";
