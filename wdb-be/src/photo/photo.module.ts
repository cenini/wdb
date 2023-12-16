import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PrismaService } from '../prisma/prisma.service';
import { ItemService } from '../item/item.service';
import { MediaService } from './media.service';

@Module({
  controllers: [],
  providers: [PhotoService, MediaService, PrismaService, ItemService],
  exports: [PhotoService],
})
export class PhotoModule {}
