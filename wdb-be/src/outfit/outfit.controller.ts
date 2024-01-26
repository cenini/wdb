import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OutfitService } from './outfit.service';
import {
  CreateOutfitDto,
  CreateOutfitWithItemsDto,
} from './dto/create-outfit.dto';
import { UpdateOutfitDto } from './dto/update-outfit.dto';

@Controller('v1/outfits')
export class OutfitController {
  constructor(private readonly outfitService: OutfitService) {}

  @Post()
  create(@Body() createOutfitDto: CreateOutfitDto) {
    return this.outfitService.create(createOutfitDto);
  }

  @Post('items')
  createWithItems(@Body() createOutfitWithItemsDto: CreateOutfitWithItemsDto) {
    return this.outfitService.createOutfitWithItems(createOutfitWithItemsDto);
  }

  @Get()
  findAll() {
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
