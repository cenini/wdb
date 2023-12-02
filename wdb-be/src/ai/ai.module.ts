import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { ConfigModule } from '@nestjs/config';
import { AIController } from './ai.controller';

@Module({
  providers: [AIService],
  imports: [ConfigModule],
  controllers: [AIController],
})
export class AIModule {}
