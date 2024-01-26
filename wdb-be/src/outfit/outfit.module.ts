import { Module } from '@nestjs/common';
import { OutfitService } from './outfit.service';
import { OutfitController } from './outfit.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OutfitController],
  providers: [OutfitService, PrismaService],
})
export class OutfitModule {}
