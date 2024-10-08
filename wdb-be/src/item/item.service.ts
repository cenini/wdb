import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Item, Prisma } from '@prisma/client';
import { ItemDto, ItemTagDto, PhotoDto, TagDto } from '../dto/ItemDto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async item(itemId: string): Promise<Item | null> {
    return this.prisma.item.findUnique({
      where: {
        id: itemId,
      },
      include: {
        photos: true,
        itemTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async getItemForOwner(itemId: string, ownerId: number): Promise<Item | null> {
    return this.prisma.item.findUnique({
      where: {
        id: itemId,
        ownerId: ownerId,
      },
      include: {
        photos: true,
        itemTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async items(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ItemWhereUniqueInput;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
  }): Promise<Item[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.item.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getItemsByEmail(email) {
    try {
      const items = await this.prisma.item.findMany({
        where: {
          owner: {
            email: email,
          },
        },
        include: {
          owner: false,
          photos: true,
          itemTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async getItemsByOwnerId(ownerId: number) {
    try {
      const items = await this.prisma.item.findMany({
        where: {
          owner: {
            id: ownerId,
          },
        },
        include: {
          owner: false,
          photos: true,
          itemTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async getItemsByIdForOwner(ids: string[], ownerId: number) {
    try {
      const items = await this.prisma.item.findMany({
        where: {
          AND: [
            { id: {
              in: ids
            }},
            { owner: { id: ownerId }},
          ]
        },
        include: {
          owner: false,
          photos: true,
          itemTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async createItem(data: Prisma.ItemCreateInput): Promise<Item> {
    return this.prisma.item.create({
      data,
    });
  }

  async updateItem(params: {
    where: Prisma.ItemWhereUniqueInput;
    data: Prisma.ItemUpdateInput;
  }): Promise<Item> {
    const { where, data } = params;
    return this.prisma.item.update({
      data,
      where,
    });
  }

  async deleteItem(where: Prisma.ItemWhereUniqueInput): Promise<Item> {
    return this.prisma.item.delete({
      where,
    });
  }
}

// Mapper for Item to ItemDto
export function mapItemToItemDto(item: any): ItemDto {
  return {
    id: item.id,
    ownerId: item.ownerId,
    createdAt: item.createdAt,
    title: item.title,
    updatedAt: item.updatedAt || null,
    photos: item.photos.map(mapPhotoToPhotoDto),
    tags: item.itemTags.map((itemTag) => mapItemTagToItemTagDto(itemTag).tag),
  };
}

// Mapper for Photo to PhotoDto
export function mapPhotoToPhotoDto(photo: any): PhotoDto {
  return {
    id: photo.id,
    url: photo.url,
    publicId: photo.publicId,
    itemId: photo.itemId,
    createdAt: photo.createdAt,
    updatedAt: photo.updatedAt || null,
  };
}

// Mapper for ItemTag to ItemTagDto
export function mapItemTagToItemTagDto(itemTag: any): ItemTagDto {
  return {
    id: itemTag.id,
    itemId: itemTag.itemId,
    tagId: itemTag.tagId,
    tag: mapTagToTagDto(itemTag.tag),
  };
}

// Mapper for Tag to TagDto
export function mapTagToTagDto(tag: any): TagDto {
  return {
    id: tag.id,
    type: tag.type,
    name: tag.name || null,
    key: tag.key || null,
    value: tag.value || null,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt || null,
  };
}
