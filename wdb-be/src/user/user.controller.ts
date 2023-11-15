import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { Public } from '../auth/auth.guard';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserCreatedDto } from '../dto/UserDto';
import { plainToClass } from 'class-transformer';
import { AuthService } from '../auth/auth.service';

@Controller('v1/users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post()
  async signupUser(
    @Body() userData: { email: string; password: string },
    @Request() req: Request,
  ): Promise<UserCreatedDto> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);
    try {
      const createdUser = await this.userService.createUser({
        email: userData.email,
        handle: uuidv4(),
        salt: salt as string,
        passhash: hash as string,
      });
      return plainToClass(UserCreatedDto, {
        email: createdUser.email,
        accessToken: await this.authService.signIn(
          userData.email,
          userData.password,
        ),
      });
    } catch (error) {
      if (error.code == 'P2002') {
        throw new HttpException('Conflicting e-mails', HttpStatus.CONFLICT);
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException('Request was bad', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
}
