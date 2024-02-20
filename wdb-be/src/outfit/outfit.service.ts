import { Injectable } from '@nestjs/common';
import {
  CreateOutfitDto,
  CreateOutfitWithItemsDto,
} from './dto/create-outfit.dto';
import { UpdateOutfitDto } from './dto/update-outfit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Outfit, OutfitItem, OutfitPhoto } from '@prisma/client';
import { CreateOutfit, CreateOutfitWithItems } from './entities/create-outfit.entity';
import { OutfitDto, OutfitItemDto, OutfitPhotoDto } from './dto/get-outfit.dto';

@Injectable()
export class OutfitService {
  constructor(private prisma: PrismaService) {}

  async create(createOutfit: CreateOutfit): Promise<Outfit> {
    return this.prisma.outfit.create({ data: createOutfit });
  }

  async createOutfitWithItems(
    createOutfitWithItems: CreateOutfitWithItems,
  ): Promise<Outfit> {
    const { itemIds, ...outfitData } = createOutfitWithItems;
    const outfit = await this.prisma.outfit.create({
      data: outfitData,
    });
    const outfitItemsData = itemIds.map((itemId) => ({
      itemId,
      outfitId: outfit.id,
    }));
    await this.prisma.outfitItem.createMany({
      data: outfitItemsData,
    });
    return outfit;
  }

  async getOutfitsByOwnerId(id: number) {
    try {
      const outfits = await this.prisma.outfit.findMany({
        where: {
          owner: {
            id: id,
          },
        },
        include: {
          owner: false,
          outfitPhoto: true,
          outfitItem: true,
          // outfitTags: {
          //   include: {
          //     tag: true,
          //   },
          // },
        },
      });

      return outfits;
    } catch (error) {
      console.error('Error fetching outfits:', error);
      throw error;
    }
  }

  async getOutfitByOwnerId(outfitId: string, ownerId: number) {
    try {
      const outfits = await this.prisma.outfit.findMany({
        where: {
          owner: {
            id: ownerId,
          },
          id: outfitId
        },
        include: {
          owner: false,
          outfitPhoto: true,
          outfitItem: true,
          // outfitTags: {
          //   include: {
          //     tag: true,
          //   },
          // },
        },
      });

      return outfits;
    } catch (error) {
      console.error('Error fetching outfits:', error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all outfit`;
  }

  findOne(id: string) {
    return `This action returns a #${id} outfit`;
  }

  async findByItemId(itemId: string, ownerId: number) {
    try {
      const outfits = await this.prisma.outfit.findMany({
        where: {
          ownerId: ownerId,
          outfitItem: {
            some: {
              itemId: itemId
            }
          }
        },
        include: {
          owner: false,
          outfitPhoto: true,
          outfitItem: true,
          // outfitTags: {
          //   include: {
          //     tag: true,
          //   },
          // },
        },
      });

      return outfits;
    } catch (error) {
      console.error('Error fetching outfits:', error);
      throw error;
    }
  }

  async findByOutfitId(outfitId: string, ownerId: number) {
    try {
      const outfits = await this.prisma.outfit.findMany({
        where: {
          ownerId: ownerId,
          id: outfitId
        },
        include: {
          owner: false,
          outfitPhoto: true,
          outfitItem: true,
          // outfitTags: {
          //   include: {
          //     tag: true,
          //   },
          // },
        },
      });

      return outfits;
    } catch (error) {
      console.error('Error fetching outfits:', error);
      throw error;
    }
  }

  update(id: string, updateOutfitDto: UpdateOutfitDto) {
    return `This action updates a #${id} outfit`;
  }

  remove(id: string) {
    return `This action removes a #${id} outfit`;
  }

  async deleteOutfitItemsById(ownerId: number, outfitId: string, itemIds: string[]){
    try {
      const outfits = await this.prisma.outfitItem.deleteMany({
        where: {
          AND: [
            { itemId: { in: itemIds } },
            { outfit: { ownerId: ownerId }},
            { outfitId: outfitId }
          ]
        },
      });
      return outfits;
    } catch (error) {
      console.error('Error fetching outfits:', error);
      throw error;
    }
  }

  mapOutfitToDto(outfit: any): OutfitDto {
    return {
      id: outfit.id,
      createdAt: outfit.createdAt,
      wornAt: outfit.wornAt,
      name: outfit.name ?? '',
      updatedAt: outfit.updatedAt,
      outfitItems: outfit.outfitItem.map(item => this.mapOutfitItemToDto(item)),
      outfitPhotos: outfit.outfitPhoto.map(photo => this.mapOutfitPhotoToDto(photo)),
    };
  }

  mapOutfitItemToDto(outfitItem: OutfitItem): OutfitItemDto {
    return {
      itemId: outfitItem.itemId,
    };
  }

  mapOutfitPhotoToDto(outfitPhoto: OutfitPhoto): OutfitPhotoDto {
    return {
      publicId: outfitPhoto.publicId,
      url: outfitPhoto.url,
      createdAt: outfitPhoto.createdAt,
      updatedAt: outfitPhoto.updatedAt,
    };
  }
}

