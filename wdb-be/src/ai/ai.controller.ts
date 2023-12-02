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
import {
  DescribeItemDto,
  DescriptionDto,
  TitleAndDescriptionDto,
} from '../dto/AIDto';
import { plainToClass } from 'class-transformer';
import { KvpTagDto, NameTagDto } from '../dto/TagDto';

@Controller('v1/ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('description')
  async describeImage(
    @Request() req,
    @Body() describeItemDto: DescribeItemDto,
  ): Promise<DescriptionDto> {
    // const descriptionString = await this.aiService.describeImage(
    //   describeItemDto.title,
    //   describeItemDto.base64photo,
    // );
    // const descriptionObject = JSON.parse(descriptionString);

    const descriptionObject = {
      tags: [
        { season: 'fall' },
        { pattern: 'coral reef' },
        { color: 'coral' },
        'elegant',
        'structured',
        { 'lining color': 'salmon' },
        'warm',
        'formal',
      ],
    };

    const mappedData = new DescriptionDto();
    mappedData.nameTags = descriptionObject.tags
      .filter((tag) => typeof tag === 'string')
      .map((tag) => new NameTagDto({ name: tag }));
    mappedData.kvpTags = descriptionObject.tags
      .filter((tag) => typeof tag === 'object' && !Array.isArray(tag))
      .map(
        (tag) =>
          new KvpTagDto({
            key: Object.keys(tag)[0],
            value: tag[Object.keys(tag)[0]],
          }),
      );
    return mappedData;
  }

  @Post('titleAndDescription')
  async titleAndDescribeImage(
    @Request() req,
    @Body() describeItemDto: DescribeItemDto,
  ): Promise<TitleAndDescriptionDto> {
    // const descriptionString = await this.aiService.describeImageWithoutTitle(
    //   describeItemDto.base64photo,
    // );
    // const descriptionObject = JSON.parse(descriptionString);
    const descriptionObject = {
      title: 'Coral Textured Overcoat',
      tags: [
        { season: 'fall' },
        { pattern: 'coral reef' },
        { color: 'coral' },
        'elegant',
        'structured',
        { 'lining color': 'salmon' },
        'warm',
        'formal',
      ],
    };

    const mappedData = new TitleAndDescriptionDto();
    mappedData.title = descriptionObject.title;
    mappedData.nameTags = descriptionObject.tags
      .filter((tag) => typeof tag === 'string')
      .map((tag) => new NameTagDto({ name: tag }));
    mappedData.kvpTags = descriptionObject.tags
      .filter((tag) => typeof tag === 'object' && !Array.isArray(tag))
      .map(
        (tag) =>
          new KvpTagDto({
            key: Object.keys(tag)[0],
            value: tag[Object.keys(tag)[0]],
          }),
      );

    return mappedData;
  }
}
