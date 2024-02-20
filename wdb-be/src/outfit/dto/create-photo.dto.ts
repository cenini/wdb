import { IsBase64 } from "class-validator";

export class PhotoDto {
  id: string;
  url: string;
  publicId: string;
  itemId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class CreateOutfitPhotoDto {
  @IsBase64()
  readonly base64photo: string;
}
