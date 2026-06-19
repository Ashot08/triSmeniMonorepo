import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariable } from '@/config/env.enum';
import { UserService } from '@/modules/user/user.service';
import { JwtPayload } from '../interfaces/jwt.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>(EnvVariable.JWT_ACCESS_SECRET),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.login);

    if(!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      sessionId: payload.sid,
    }
  }
}
