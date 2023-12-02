import {
  IsBase64,
  IsDate,
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  readonly title: string;
}

export class ItemCreatedDto {
  @IsNotEmpty()
  readonly id: string;
  @IsNotEmpty()
  readonly ownerId: string;
  @IsDate()
  readonly createdAt: Date;
  @IsNotEmpty()
  readonly title: string;
  @IsDate()
  readonly updatedAt: Date;
}

export class CreateItemPhotoDto {
  @IsBase64()
  readonly base64photo: string;
}
