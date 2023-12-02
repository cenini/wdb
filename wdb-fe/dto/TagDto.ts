import { IsNotEmpty } from "class-validator";

export class NameTagDto {
  @IsNotEmpty()
  readonly name: string;
}

export class KvpTagDto {
  @IsNotEmpty()
  readonly key: string;
  @IsNotEmpty()
  readonly value: string;
}
