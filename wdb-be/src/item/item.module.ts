import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { PrismaService } from '../prisma/prisma.service';
import { PhotoService } from '../photo/photo.service';
import { TagService } from '../tag/tag.service';
import { ItemTagService } from './itemtag.service';

@Module({
  controllers: [ItemController],
  providers: [
    ItemService,
    PrismaService,
    PhotoService,
    TagService,
    ItemTagService,
  ],
})
export class ItemModule {}
