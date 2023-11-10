import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ItemTag, Prisma } from '@prisma/client';

@Injectable()
export class ItemTagService {
  constructor(private prisma: PrismaService) {}

  async itemTag(
    itemTagWhereUniqueInput: Prisma.ItemTagWhereUniqueInput,
  ): Promise<ItemTag | null> {
    return this.prisma.itemTag.findUnique({
      where: itemTagWhereUniqueInput,
    });
  }

  async itemTags(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ItemTagWhereUniqueInput;
    where?: Prisma.ItemTagWhereInput;
    orderBy?: Prisma.ItemTagOrderByWithRelationInput;
  }): Promise<ItemTag[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.itemTag.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async upsertItemTag(itemTagData: {
    itemId: string;
    tagId: number;
  }): Promise<ItemTag> {
    const { itemId, tagId } = itemTagData;

    return this.prisma.itemTag.upsert({
      where: { itemId_tagId: { itemId, tagId } }, // Assuming 'itemId_tagId' is the composite key field
      update: {},
      create: { itemId, tagId },
    });
  }

  async upsertItemTags(
    itemTagDataArray: {
      itemId: string;
      tagId: number;
    }[],
  ): Promise<ItemTag[]> {
    const upsertedItemTags: ItemTag[] = [];

    for (const itemTagData of itemTagDataArray) {
      const { itemId, tagId } = itemTagData;

      const upsertedItemTag = await this.prisma.itemTag.upsert({
        where: { itemId_tagId: { itemId, tagId } },
        update: {},
        create: { itemId, tagId },
      });

      upsertedItemTags.push(upsertedItemTag);
    }

    return upsertedItemTags;
  }

  async createItemTag(data: Prisma.ItemTagCreateInput): Promise<ItemTag> {
    return this.prisma.itemTag.create({
      data,
    });
  }

  async updateItemTag(params: {
    where: Prisma.ItemTagWhereUniqueInput;
    data: Prisma.ItemTagUpdateInput;
  }): Promise<ItemTag> {
    const { where, data } = params;
    return this.prisma.itemTag.update({
      data,
      where,
    });
  }

  async deleteItemTag(where: Prisma.ItemTagWhereUniqueInput): Promise<ItemTag> {
    return this.prisma.itemTag.delete({
      where,
    });
  }
}
