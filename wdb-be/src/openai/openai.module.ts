import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [OpenAIService],
  imports: [ConfigModule],
})
export class OpenAIModule {}
