import {
  IsBase64,
  IsDate,
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { KvpTagDto, NameTagDto } from './TagDto';

export class DescribeItemDto {
  @IsBase64()
  readonly base64photo: string;
  @IsString()
  readonly title: string;
}

export class TitleAndDescribeItemDto {
  @IsBase64()
  readonly base64photo: string;
}

export class ItemDescriptionDto {
  readonly nameTags: NameTagDto[];
  readonly kvpTags: KvpTagDto[];
}

export class TitleAndDescriptionDto {
  @IsNotEmpty()
  readonly title: string;
  readonly nameTags: NameTagDto[];
  readonly kvpTags: KvpTagDto[];
}
