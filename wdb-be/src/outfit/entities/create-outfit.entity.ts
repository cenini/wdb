export class CreateOutfit {
  name: string;
  ownerId: number;
}

export class CreateOutfitWithItems {
  itemIds: string[];
  ownerId: number;
}
