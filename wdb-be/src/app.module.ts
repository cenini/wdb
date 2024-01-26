import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ItemModule } from './item/item.module';
import { PhotoModule } from './photo/photo.module';
import { AIModule } from './ai/ai.module';
import { TagModule } from './tag/tag.module';
import { OutfitModule } from './outfit/outfit.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ItemModule,
    PhotoModule,
    AIModule,
    TagModule,
    OutfitModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
