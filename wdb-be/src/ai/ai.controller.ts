import {
  Body,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AIService } from './ai.service';
import { DescribeItemDto } from '../dto/AIDto';

@Controller('v1/ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('description')
  async describeImage(
    @Request() req,
    @Body() describeItemDto: DescribeItemDto,
  ): Promise<string> {
    return await this.aiService.describeImage(
      describeItemDto.title,
      describeItemDto.base64photo,
    );
  }

  @Post('titleAndDescription')
  async titleAndDescribeImage(
    @Request() req,
    @Body() describeItemDto: DescribeItemDto,
  ): Promise<string> {
    return await this.aiService.describeImageWithoutTitle(
      describeItemDto.base64photo,
    );
  }
}
