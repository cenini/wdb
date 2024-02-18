import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
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

@Controller('v1/outfits')
export class OutfitController {
  constructor(private readonly outfitService: OutfitService) {}

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
  findAll(@Request() req) {
    // const items = await this.itemService.getItemsByEmail(req.user.sub);
    return this.outfitService.findAll();
  }

  @Get()
  findByItemId(@Param('itemId') itemId: string) {
    return this.outfitService.findByItemId(itemId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outfitService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutfitDto: UpdateOutfitDto) {
    return this.outfitService.update(id, updateOutfitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outfitService.remove(id);
  }
}
