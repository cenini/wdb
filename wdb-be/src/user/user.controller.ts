import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { Public } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('')
  async signupUser(@Body() userData: { email: string }): Promise<UserModel> {
    console.log(userData.email);
    return this.userService.createUser({
      email: userData.email,
      handle: 'random-string-here',
    });
  }
}
