import { Controller, Post, UseGuards, Get, Body, Req} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import type { JwtRequest } from './interfaces/jwt.request.interface';
import type { LoginRequest } from './interfaces/login.request.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: LoginRequest) {
    // todo: записывать рефреш токен в http only cookies
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  register (@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('refresh')
  refresh(
    @Body() body: { refreshToken: string },
  ) {
    // todo: записывать рефреш токен в http only cookies

    return this.authService.refresh(
      body.refreshToken,
    );
  }

  @Post('logout')
  logout(@Req() req: JwtRequest) {
    const {id, sessionId} = req.user;
    return this.authService.logout(id, sessionId)
  }

  @Get('profile')
  getProfile(@Req() req: JwtRequest) {
    return req.user;
  }
}
