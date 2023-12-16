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
import {
  Item as ItemModel,
  Photo as PhotoModel,
  Tag as TagModel,
  ItemTag as ItemTagModel,
  TagType,
} from '@prisma/client';
import { PhotoService } from '../photo/photo.service';
import { v4 as uuidv4 } from 'uuid';
import { ItemTagService } from './itemtag.service';
import { TagService } from '../tag/tag.service';
import {
  CreateItemDto,
  CreateItemPhotoDto,
  CreateItemTagsDto,
  CreateNewItemPhotoDto,
} from '../dto/ItemDto';
import { KvpTagDto, NameTagDto } from '../dto/TagDto';
import { MediaService } from '../photo/media.service';

@Controller('v1/items')
export class ItemController {
  constructor(
    private itemService: ItemService,
    private photoService: PhotoService,
    private mediaService: MediaService,
    private tagService: TagService,
    private itemTagService: ItemTagService,
  ) {}

  @Post('')
  async createItem(
    @Request() req,
    @Body() createItemDto: CreateItemDto,
  ): Promise<ItemModel> {
    return await this.itemService.createItem({
      title: createItemDto.title,
      owner: {
        connect: { id: req.user.sub },
      },
    });
  }

  @Delete(':itemId')
  async Item(@Request() req, @Param('itemId') itemId): Promise<ItemModel> {
    return await this.itemService.deleteItem({ id: itemId });
  }

  @Post(':itemId/tags')
  async createTagsForItem(
    @Request() req,
    @Param('itemId') itemId,
    @Body()
    createItemTagsDto: CreateItemTagsDto,
  ): Promise<ItemTagModel[]> {
    // Remember to check that the requester is the owner of the item
    const tagDataArray = [
      ...createItemTagsDto.nameTags.map((tag) => ({
        type: TagType.NAME,
        key: tag.name,
        value: '',
      })),
      ...createItemTagsDto.kvpTags.map((tag) => ({
        type: TagType.KEY_VALUE,
        key: tag.key,
        value: tag.value,
      })),
    ];
    const tags = await this.tagService.upsertTags(tagDataArray);
    const tagItemDataArray = tags.map((tag) => ({
      itemId: itemId,
      tagId: tag.id,
    }));
    return await this.itemTagService.upsertItemTags(tagItemDataArray);
  }

  @Post(':itemId/photos')
  async createPhotoForItem(
    @Request() req,
    @Param('itemId') itemId,
    @Body() dto: CreateItemPhotoDto,
  ): Promise<PhotoModel> {
    return await this.photoService.createPhoto({
      url: await this.mediaService.uploadImage(dto.base64photo),
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
    @Body() dto: CreateNewItemPhotoDto,
  ): Promise<PhotoModel> {
    const item = await this.itemService.createItem({
      title: dto.title,
      owner: {
        connect: { id: req.user.sub },
      },
    });
    return await this.photoService.createPhoto({
      url: await this.mediaService.uploadImage(dto.base64photo),
      item: {
        connect: { id: item.id },
      },
    });
  }
}
