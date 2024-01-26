import { Injectable } from '@nestjs/common';
import {
  CreateOutfitDto,
  CreateOutfitWithItemsDto,
} from './dto/create-outfit.dto';
import { UpdateOutfitDto } from './dto/update-outfit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Outfit } from '@prisma/client';

@Injectable()
export class OutfitService {
  constructor(private prisma: PrismaService) {}

  async create(createOutfitDto: CreateOutfitDto): Promise<Outfit> {
    return this.prisma.outfit.create({ data: createOutfitDto });
  }

  async createOutfitWithItems(
    createOutfitWithItemsDto: CreateOutfitWithItemsDto,
  ): Promise<Outfit> {
    const { itemIds, ...outfitData } = createOutfitWithItemsDto;
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
