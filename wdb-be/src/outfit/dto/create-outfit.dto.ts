export class CreateOutfitDto {
  name: string;
}

export class CreateOutfitWithItemsDto {
  itemIds: string[];
  name: string;
}

export class OutfitCreatedDto {
  id: string;
  createdAt: Date;
}
