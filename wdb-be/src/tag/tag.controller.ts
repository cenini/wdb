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
import { TagService } from './tag.service';
import { Tag as TagModel, TagType } from '@prisma/client';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  async createKvpTag(
    @Body()
    tagData: {
      key: string;
      value: string;
    },
  ): Promise<TagModel> {
    return await this.tagService.createTag({
      type: TagType.KEY_VALUE,
      key: tagData.key,
      value: tagData.value,
    });
  }

  @Post()
  async createNameTag(@Body() tagData: { name: string }): Promise<TagModel> {
    return await this.tagService.createTag({
      type: TagType.NAME,
      name: tagData.name,
    });
  }
}
