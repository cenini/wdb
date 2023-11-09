import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { PrismaService } from '../prisma/prisma.service';
import { PhotoService } from '../photo/photo.service';

@Module({
  controllers: [ItemController],
  providers: [ItemService, PrismaService, PhotoService],
})
export class ItemModule {}
