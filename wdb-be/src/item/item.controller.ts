import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { Item as ItemModel } from '@prisma/client';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post('')
  async createItem(
    @Request() req,
    @Body() itemData: { title: string },
  ): Promise<ItemModel> {
    return await this.itemService.createItem({
      title: itemData.title,
      owner: {
        connect: { id: req.user.sub },
      },
    });
  }
}
