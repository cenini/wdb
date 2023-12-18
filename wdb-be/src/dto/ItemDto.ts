import {
  IsBase64,
  IsDate,
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { KvpTagDto, NameTagDto } from './TagDto';

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

export class ItemDto {
  id: string;
  ownerId: number;
  createdAt: Date;
  title: string;
  updatedAt: Date | null;
  photos: PhotoDto[];
  tags: TagDto[];
}

export class PhotoDto {
  id: string;
  url: string;
  itemId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class ItemTagDto {
  id: number;
  itemId: string;
  tagId: number;
  tag: TagDto;
}

export class TagDto {
  id: number;
  type: TagType;
  name: string | null;
  key: string | null;
  value: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

enum TagType {
  NAME,
  KEY_VALUE,
}

export class CreateItemPhotoDto {
  @IsBase64()
  readonly base64photo: string;
}

export class CreateNewItemPhotoDto {
  @IsNotEmpty()
  readonly title: string;
  @IsBase64()
  readonly base64photo: string;
}

export class CreateItemTagsDto {
  readonly nameTags: NameTagDto[];
  readonly kvpTags: KvpTagDto[];
}
