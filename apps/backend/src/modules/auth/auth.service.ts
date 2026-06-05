import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { RedisService } from '@/redis/redis.service';
import { JwtConfigService } from '@/config/jwt-config.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redis: RedisService,
    private jwtConfig: JwtConfigService,
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(login);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
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

  async login(user: User) {
    const payload: JwtPayload = { login: user.username, sub: user.id };
    const tokens = await this.generateTokens(payload);

    await this.redis.setJwtRefreshToken(
      user.id,
      tokens.refreshToken,
      this.jwtConfig.jwtRefreshTtlSeconds,
    );

    return tokens;
  }
}
