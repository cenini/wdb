import {
  IsBase64,
  IsDate,
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";

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
