import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { PrismaService } from '../prisma/prisma.service';
import { PhotoService } from '../photo/photo.service';
import { TagService } from '../tag/tag.service';
import { ItemTagService } from './itemtag.service';
import { MediaService } from '../photo/media.service';

@Module({
  controllers: [ItemController],
  providers: [
    ItemService,
    PrismaService,
    PhotoService,
    MediaService,
    TagService,
    ItemTagService,
  ],
})
export class ItemModule {}
