import {
  Body,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ItemService, mapItemToItemDto } from './item.service';
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
  ItemCreatedDto,
  ItemDto,
  PhotoDto,
} from '../dto/ItemDto';
import { KvpTagDto, NameTagDto } from '../dto/TagDto';
import { MediaService } from '../photo/media.service';
import { plainToClass, plainToInstance } from 'class-transformer';

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
  ): Promise<ItemCreatedDto> {
    const itemCreated = plainToInstance(
      ItemCreatedDto,
      await this.itemService.createItem({
        title: createItemDto.title,
        owner: {
          connect: { id: req.user.sub },
        },
      }),
    );
    return itemCreated;
  }

  @Get('')
  async getItems(
    @Request() req,
    @Query('ids', new ParseArrayPipe({ items: String, optional: true })) ids?: string[]
  ): Promise<ItemDto[]> {
    // console.log(ids)
    const items = ids == null 
      ? await this.itemService.getItemsByOwnerId(parseInt(req.user.sub)) 
      : await this.itemService.getItemsByIdForOwner(ids, parseInt(req.user.sub));;
    return items.map((item) => mapItemToItemDto(item));
  }

  // @Get('')
  // async getItems(
  //   @Request() req,
  // ): Promise<ItemDto[]> {
  //   const items = await this.itemService.getItemsByOwnerId(parseInt(req.user.sub)) 
  //   return items.map((item) => mapItemToItemDto(item));
  // }

  // @Get('')
  // async getItemsByIds(
  //   @Request() req,
  //   @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: string[]
  // ): Promise<ItemDto[]> {
  //   const items = await this.itemService.getItemsByIdForOwner(ids, parseInt(req.user.sub));
  //   return items.map((item) => mapItemToItemDto(item));
  // }

  @Get(':itemId')
  async getItem(@Request() req, @Param('itemId') itemId): Promise<ItemDto> {
    return mapItemToItemDto(
      await this.itemService.getItemForOwner(itemId, req.user.sub),
    );
  }

  @Delete(':itemId')
  async Item(@Request() req, @Param('itemId') itemId): Promise<ItemDto> {
    await this.mediaService.deleteImageFolder(
      this.mediaService.generateItemFolderPath(itemId, req.user.sub),
    );
    return plainToInstance(
      ItemDto,
      await this.itemService.deleteItem({ id: itemId }),
    );
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
        name: tag.name,
        key: '',
        value: '',
      })),
      ...createItemTagsDto.kvpTags.map((tag) => ({
        type: TagType.KEY_VALUE,
        key: tag.key,
        value: tag.value,
        name: '',
      })),
    ];
    const tags = await this.tagService.upsertTags(tagDataArray);
    const tagItemDataArray = tags.map((tag) => ({
      itemId: itemId,
      tagId: tag.id,
    }));
    return await this.itemTagService.updateItemTags(tagItemDataArray);
  }

  @Post(':itemId/photos')
  async createPhotoForItem(
    @Request() req,
    @Param('itemId') itemId,
    @Body() dto: CreateItemPhotoDto,
  ): Promise<PhotoDto> {
    const uploadedImage = await this.mediaService.uploadItemImage(
      dto.base64photo,
      itemId,
      req.user.sub,
    );
    // console.log(uploadedImage);
    return plainToInstance(
      PhotoDto,
      await this.photoService.createPhoto({
        url: uploadedImage.secureUrl,
        publicId: uploadedImage.publicId,
        item: {
          connect: { id: itemId },
        },
      }),
    );
  }

  @Delete(':itemId/photos/:photoId')
  async createPhoto(
    @Request() req,
    @Param('itemId') itemId,
    @Param('photoId') photoId,
  ): Promise<PhotoDto> {
    return plainToInstance(
      PhotoDto,
      await this.photoService.deletePhoto({
        id: photoId,
      }),
    );
  }

  @Post('photos')
  async createPhotoForNewItem(
    @Request() req,
    @Body() dto: CreateNewItemPhotoDto,
  ): Promise<PhotoDto> {
    const item = await this.itemService.createItem({
      title: dto.title,
      owner: {
        connect: { id: req.user.sub },
      },
    });
    const uploadedImage = await this.mediaService.uploadItemImage(
      dto.base64photo,
      item.id,
      req.user.sub,
    );
    return plainToInstance(
      PhotoDto,
      await this.photoService.createPhoto({
        url: uploadedImage.secureUrl,
        publicId: uploadedImage.publicId,
        item: {
          connect: { id: item.id },
        },
      }),
    );
  }
}
