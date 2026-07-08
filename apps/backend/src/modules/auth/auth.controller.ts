import { Controller, Post, UseGuards, Get, Body, Req} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import type { JwtRequest } from './interfaces/jwt.request.interface';
import type { LoginRequest } from './interfaces/login.request.interface';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { PasswordResetService } from './password.reset.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Throttle } from '@nestjs/throttler';
import { AuthorizeGlobalRoles } from './decorators/authorize-global-roles.decorator';
import { RoleCode } from '@/common/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private passwordResetService: PasswordResetService,
  ) {}

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

  @Post('logout-all')
  logoutAll(@Req() req: JwtRequest) {
    const {id} = req.user;
    return this.authService.logoutAll(id)
  }

  @AuthorizeGlobalRoles(RoleCode.PLAYER)
  @Get('profile')
  getProfile(@Req() req: JwtRequest) {
    return req.user;
  }

  @Public()
  @Post('password-reset/request')
  requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ) {

    return this.passwordResetService.requestPasswordReset(
      dto.email,
    );

  }

  @Public()
  @Throttle({
    default: {
      limit: 10,
      ttl: 60000,
    },
  })
  @Post('password-reset/confirm')
  resetPassword(
    @Body() dto: ResetPasswordDto,
  ) {

    return this.passwordResetService.resetPassword(
      dto.token,
      dto.password,
    );

  }
}
