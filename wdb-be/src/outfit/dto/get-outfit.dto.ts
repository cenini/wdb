export class GetOutfitsByOwnerIdDto {
  id: string;
  createdAt: Date;
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
