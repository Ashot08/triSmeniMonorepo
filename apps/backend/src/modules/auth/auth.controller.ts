import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import {Request as AuthRequest} from 'express';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/user/entities/user.entity';
import { Public } from '@/modules/auth/decorators/public.decorator';

interface RequestWithUser extends AuthRequest {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  async logout(@Request() req: RequestWithUser) {
    return req.logout({}, () => {});
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
