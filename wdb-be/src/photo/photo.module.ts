import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PrismaService } from '../prisma/prisma.service';
import { ItemService } from '../item/item.service';

@Module({
  controllers: [],
  providers: [PhotoService, PrismaService, ItemService],
  exports: [PhotoService],
})
export class PhotoModule {}
