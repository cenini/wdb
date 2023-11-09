import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ItemModule } from './item/item.module';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true }), ItemModule, PhotoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
