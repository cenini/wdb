export class OutfitModel {
  id: string;
  createdAt: Date;
  wornAt: Date[];
  name: string;
  updatedAt: Date | null;
  outfitItems: OutfitItemModel[];
  outfitPhotos: OutfitPhotoModel[];
}

export class OutfitItemModel {
  itemId: string;
}

export class OutfitPhotoModel {
  publicId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date | null;
}
