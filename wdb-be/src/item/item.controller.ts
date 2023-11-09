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
import { ItemService } from './item.service';
import { Item as ItemModel, Photo as PhotoModel } from '@prisma/client';
import { PhotoService } from '../photo/photo.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('items')
export class ItemController {
  constructor(
    private itemService: ItemService,
    private photoService: PhotoService,
  ) {}

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

  @Delete(':itemId')
  async Item(@Request() req, @Param('itemId') itemId): Promise<ItemModel> {
    return await this.itemService.deleteItem({ id: itemId });
  }

  @Post(':itemId/photos')
  async createPhotoForItem(
    @Request() req,
    @Param('itemId') itemId,
    @Body() photoData: { base64photo: string },
  ): Promise<PhotoModel> {
    return await this.photoService.createPhoto({
      url: `https://some-cdn.com/${uuidv4()}`,
      item: {
        connect: { id: itemId },
      },
    });
  }

  @Delete(':itemId/photos/:photoId')
  async createPhoto(
    @Request() req,
    @Param('itemId') itemId,
    @Param('photoId') photoId,
  ): Promise<PhotoModel> {
    return await this.photoService.deletePhoto({
      id: photoId,
    });
  }

  @Post('photos')
  async createPhotoForNewItem(
    @Request() req,
    @Body() data: { title: string; base64photo: string },
  ): Promise<PhotoModel> {
    const item = await this.itemService.createItem({
      title: data.title,
      owner: {
        connect: { id: req.user.sub },
      },
    });
    return await this.photoService.createPhoto({
      url: `https://some-cdn.com/${uuidv4()}`,
      item: {
        connect: { id: item.id },
      },
    });
  }
}
