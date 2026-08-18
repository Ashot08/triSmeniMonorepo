import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { JwtConfigService } from '@/config/jwt-config.service';
import { SessionService } from './session.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { LoginUser } from './interfaces/login.user.interface';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private sessionService: SessionService,
    private jwtConfig: JwtConfigService,
  ) {}

  async validateUser(login: string, pass: string): Promise<LoginUser | null> {
    const user = await this.userService.findOne(login);

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(pass, user.password);

    if (!isValid) {
      return null;
    }

    return this.toLoginUser(user);
  }

  private async generateTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.jwtAccessSecret,
      expiresIn: this.jwtConfig.jwtAccessExpiresIn,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.jwtRefreshSecret,
      expiresIn: this.jwtConfig.jwtRefreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(user: LoginUser) {
    const sessionId = randomUUID();
    const payload: JwtPayload = {
      login: user.username,
      sub: user.id,
      sid: sessionId,
      roles: user.roles,
    };
    const tokens = await this.generateTokens(payload);

    await this.sessionService.createSession(
      user.id,
      sessionId,
      tokens.refreshToken,
      this.jwtConfig.jwtRefreshTtlSeconds,
    );
    return tokens;
  }

  async register(dto: CreateUserDto) {
    const user = await this.userService.create(dto);

    return await this.login(this.toLoginUser(user));
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfig.jwtRefreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!payload.sid || !payload.sub) {
      throw new UnauthorizedException('Invalid session');
    }

    const isValid = await this.sessionService.validateRefreshToken(
      payload.sub,
      payload.sid,
      refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const newTokens = await this.generateTokens({
      login: payload.login,
      sub: payload.sub,
      sid: payload.sid,
      roles: payload.roles,
    });

    await this.sessionService.updateRefreshHash(
      payload.sid,
      newTokens.refreshToken,
    );

    return newTokens;
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.sessionService.deleteSession(userId, sessionId);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionService.deleteAllUserSessions(userId);
  }

  private toLoginUser(user: User): LoginUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((role) => role.code),
    };
  }
}
