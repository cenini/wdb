import { Module } from '@nestjs/common';
import { OutfitService } from './outfit.service';
import { OutfitController } from './outfit.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../photo/media.service';
import { PhotoService } from '../photo/photo.service';

@Module({
  controllers: [OutfitController],
  providers: [OutfitService, PrismaService, MediaService, PhotoService],
})
export class OutfitModule {}
