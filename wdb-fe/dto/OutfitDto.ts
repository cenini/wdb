export class CreateOutfitDto {
  name: string;
}

export class CreateOutfitWithItemsDto {
  itemIds: string[];
  name: string;
}

export class OutfitDto {
  id: string;
  createdAt: Date;
  wornAt: Date[];
  name: string;
  updatedAt: Date | null;
  outfitItems: OutfitItemDto[];
  outfitPhotos: OutfitPhotoDto[];
}

export class OutfitItemDto {
  itemId: string;
}

export class OutfitPhotoDto {
  publicId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date | null;
}
