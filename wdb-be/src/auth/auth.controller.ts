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
import { Public } from './auth.guard';
import { AuthService } from './auth.service';
import { LoggedInDto, LoginDto } from '../dto/AuthDto';
import { plainToClass } from 'class-transformer';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    return plainToClass(LoggedInDto, {
      accessToken: await this.authService.signIn(
        loginDto.email,
        loginDto.password,
      ),
    });
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
