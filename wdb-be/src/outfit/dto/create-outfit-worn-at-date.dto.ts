import { IsDate } from "class-validator";

export class CreateOutfitWornAtDateDto {
  @IsDate()
  readonly date: Date;
}
