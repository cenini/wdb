import { Injectable } from '@nestjs/common';
import {
  CreateOutfitDto,
  CreateOutfitWithItemsDto,
} from './dto/create-outfit.dto';
import { UpdateOutfitDto } from './dto/update-outfit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Outfit } from '@prisma/client';
import { CreateOutfit, CreateOutfitWithItems } from './entities/create-outfit.entity';

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

  async getOutfitsById(id: number) {
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

  findByItemId(itemId: string) {
    return `This action returns an outfit by item id`;
  }

  update(id: string, updateOutfitDto: UpdateOutfitDto) {
    return `This action updates a #${id} outfit`;
  }

  remove(id: string) {
    return `This action removes a #${id} outfit`;
  }
}
