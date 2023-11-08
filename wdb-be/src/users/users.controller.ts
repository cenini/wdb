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
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // constructor(private userRepository: UserRepository) {}
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() signUpDto: Record<string, any>) {
    return await this.usersService.createUser(
      signUpDto.username,
      signUpDto.password,
    );
  }
}
