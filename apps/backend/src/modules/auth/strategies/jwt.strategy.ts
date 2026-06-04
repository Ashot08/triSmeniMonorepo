import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariable } from '@/config/env.enum';
import { UserService } from '@/modules/user/user.service';

interface JwtPayload {
  sub: number;
  login: string;
}

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
    return this.userService.findOne(payload.login);
  }
}
