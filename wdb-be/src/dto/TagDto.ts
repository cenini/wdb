import { IsEmail, IsJWT, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class NameTagDto {
  @IsNotEmpty()
  name;

  constructor(data) {
    if (data && data.name) {
      this.name = data.name;
    }
  }
}

export class KvpTagDto {
  @IsNotEmpty()
  key;
  @IsNotEmpty()
  value;

  constructor(data) {
    if (data && data.key && data.value) {
      this.key = data.key;
      this.value = data.value;
    }
  }
}
