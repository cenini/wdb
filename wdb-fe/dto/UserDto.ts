import { IsEmail, IsJWT, IsNotEmpty, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  readonly email: string;
  @IsStrongPassword()
  readonly password: string;
}

export class UserCreatedDto {
  @IsEmail()
  readonly email: string;
  @IsJWT()
  readonly accessToken: string;
}
