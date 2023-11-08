import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email) {
    const user = await this.userService.user({ email: String(email) });
    if (user == null) {
      throw new UnauthorizedException();
    }
    // if (user?.password !== pass) {
    //   throw new UnauthorizedException();
    // }
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
