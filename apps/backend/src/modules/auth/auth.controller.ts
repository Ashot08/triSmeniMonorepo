import { Controller, Request, Post, UseGuards, Get, Body, Req, Res } from '@nestjs/common';
import {Request as AuthRequest} from 'express';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/modules/user/entities/user.entity';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    sessionId: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthenticatedRequest) {
    // todo: записывать рефреш токен в http only cookies
    return await this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register (@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() body: { refreshToken: string },
  ) {
    // todo: записывать рефреш токен в http only cookies

    return this.authService.refresh(
      body.refreshToken,
    );
  }

  @Post('logout')
  async logout(@Request() req: RequestWithUser) {
    return this.authService.logout(req.user.id, req.user.sessionId)
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
