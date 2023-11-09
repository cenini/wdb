-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Photo" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "updatedAt" DROP NOT NULL;
