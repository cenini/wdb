import { IsJWT, IsEmail, IsStrongPassword } from "class-validator";

export class LoggedInDto {
  @IsJWT()
  readonly accessToken: string;
}

export class LoginDto {
  @IsEmail()
  readonly email: string;
  @IsStrongPassword()
  readonly password: string;
}
