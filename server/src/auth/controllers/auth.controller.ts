import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  HttpStatus,
  HttpCode,
  Req,
  Res,
} from '@nestjs/common';
import { User } from '../../shared/interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RegisterDto } from '../dto/register.dto';
import { AuthUser } from '../../user/decorators/user.decorator';
import { AuthenticatedGuard } from '../guards/auth.guard';
import { Request, Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(ThrottlerGuard, LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  async user(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Post('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      return err ? res.sendStatus(400) : res.sendStatus(200);
    });
    res.status(200).clearCookie('SESSION_ID', {
      path: '/',
    });
  }
}
