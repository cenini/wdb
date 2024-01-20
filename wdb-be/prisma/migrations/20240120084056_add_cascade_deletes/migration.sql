-- DropForeignKey
ALTER TABLE "ItemTag" DROP CONSTRAINT "ItemTag_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemTag" DROP CONSTRAINT "ItemTag_tagId_fkey";

-- AddForeignKey
ALTER TABLE "ItemTag" ADD CONSTRAINT "ItemTag_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTag" ADD CONSTRAINT "ItemTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
