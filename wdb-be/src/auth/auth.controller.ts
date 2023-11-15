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
import { AccessTokenDto } from '../dto/AuthDto';
import { plainToClass } from 'class-transformer';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    return plainToClass(AccessTokenDto, {
      accessToken: await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      ),
    });
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
