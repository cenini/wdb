import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email, password): Promise<string> {
    const user = await this.userService.user({ email: String(email) });
    if (user == null) {
      throw new UnauthorizedException(
        "Credentials didn't match an existing user",
      );
    }

    if (!(await bcrypt.compare(password, user.passhash))) {
      throw new UnauthorizedException(
        "Credentials didn't match an existing user",
      );
    }

    const payload = { sub: user.id, username: user.email };
    return await this.jwtService.signAsync(payload);
  }
}
