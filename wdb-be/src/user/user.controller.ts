import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { Public } from '../auth/auth.guard';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post()
  async signupUser(
    @Body() userData: { email: string; password: string },
  ): Promise<UserModel> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);
    return await this.userService.createUser({
      email: userData.email,
      handle: uuidv4(),
      salt: salt as string,
      passhash: hash as string,
    });
  }
}
