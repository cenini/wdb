import { IsJWT } from 'class-validator';

export class AccessTokenDto {
  @IsJWT()
  readonly accessToken: string;
}
