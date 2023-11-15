import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Module({
  providers: [UserService, PrismaService, AuthService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
