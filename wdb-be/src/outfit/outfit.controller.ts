import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import { OutfitService } from './outfit.service';
import {
  CreateOutfitDto,
  CreateOutfitWithItemsDto,
  OutfitCreatedDto
} from './dto/create-outfit.dto';
import { CreateOutfit, CreateOutfitWithItems } from './entities/create-outfit.entity';
import { UpdateOutfitDto } from './dto/update-outfit.dto';
import { plainToInstance } from 'class-transformer';
import { CreateOutfitPhotoDto, PhotoDto } from './dto/create-photo.dto';
import { PhotoService } from '../photo/photo.service';
import { MediaService } from '../photo/media.service';

@Controller('v1/outfits')
export class OutfitController {
  constructor(
    private readonly outfitService: OutfitService,
    private readonly photoService: PhotoService,
    private readonly mediaService: MediaService,
    ) {}

  @Post()
  async create(@Request() req, @Body() createOutfitDto: CreateOutfitDto) {
    const owner = { ownerId: parseInt(req.user.sub)} 
    const createOutfit = plainToInstance(CreateOutfit, { ...createOutfitDto, ...owner})
    return plainToInstance(
      OutfitCreatedDto,
      await this.outfitService.create(createOutfit)
    );
  }

  @Post('items')
  async createWithItems(@Request() req, @Body() createOutfitWithItemsDto: CreateOutfitWithItemsDto) {
    const owner = { ownerId: parseInt(req.user.sub)} 
    const createOutfitWithItems = plainToInstance(CreateOutfitWithItems, { ...createOutfitWithItemsDto, ...owner})
    return plainToInstance(
      OutfitCreatedDto,
      await this.outfitService.createOutfitWithItems(createOutfitWithItems)
    );
  }

  @Get()
  async findAll(@Request() req) {
    const outfits = await this.outfitService.getOutfitsByOwnerId(parseInt(req.user.sub));
    return outfits.map(outfit => this.outfitService.mapOutfitToDto(outfit));
  }

  @Get()
  async findByItemId(@Request() req, @Param('itemId') itemId: string) {
    const outfits = await this.outfitService.findByItemId(itemId, parseInt(req.user.sub));
    return outfits.map(outfit => this.outfitService.mapOutfitToDto(outfit));
  }

  @Get(':outfitId')
  async findById(@Request() req, @Param('outfitId') outfitId: string) {
    const outfits = await this.outfitService.findByOutfitId(outfitId, parseInt(req.user.sub));
    return outfits.map(outfit => this.outfitService.mapOutfitToDto(outfit));
  }

  @Post(':outfitId/photos')
  async createPhotoForOutfit(
    @Request() req,
    @Param('outfitId') outfitId,
    @Body() dto: CreateOutfitPhotoDto,
  ): Promise<PhotoDto> {
    console.log('Creating photo for outfit...')
    const uploadedImage = await this.mediaService.uploadOutfitImage(
      dto.base64photo,
      outfitId,
      req.user.sub,
    );
    console.log(uploadedImage.publicId);
    return plainToInstance(
      PhotoDto,
      await this.photoService.createOutfitPhoto({
        url: uploadedImage.secureUrl,
        publicId: uploadedImage.publicId,
        outfit: {
          connect: { id: outfitId },
        },
      }),
    );
  }

  @Delete(':outfitId/items')
  async deleteOutfitItems(
    @Request() req,
    @Param('outfitId') outfitId,
    @Query('ids', new ParseArrayPipe({ items: String })) itemIds: string[]
  ): Promise<void> {
    console.log(`Itemids: ${itemIds.toString()}`);
    console.log(`Outfitid: ${outfitId.toString()}`);
    const result = await this.outfitService.deleteOutfitItemsById(parseInt(req.user.sub), outfitId, itemIds)
    console.log(result)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outfitService.findOne(id);
  }

  // @Get(':id/items')
  // async findItemsPartOfOutfit(
  //   @Request() req,
  //   @Param('id') id: string
  // ) {
  //   const outfits = await this.outfitService.getOutfitsByOwnerId(parseInt(req.user.sub));
  //   return this.outfitService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutfitDto: UpdateOutfitDto) {
    return this.outfitService.update(id, updateOutfitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outfitService.remove(id);
  }
}
