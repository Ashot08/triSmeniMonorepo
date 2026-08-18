import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { EnvVariable } from '@/config/env.enum';
import ms, { StringValue } from 'ms';

@Injectable()
export class JwtConfigService {
  constructor(private readonly config: ConfigService) {}

  get jwtAccessSecret(): string {
    return this.config.getOrThrow(EnvVariable.JWT_ACCESS_SECRET);
  }

  get jwtRefreshSecret(): string {
    return this.config.getOrThrow(EnvVariable.JWT_REFRESH_SECRET);
  }

  get jwtAccessExpiresIn(): StringValue {
    return this.config.getOrThrow(EnvVariable.JWT_ACCESS_EXPIRES_IN);
  }

  get jwtRefreshExpiresIn(): StringValue {
    return this.config.getOrThrow(EnvVariable.JWT_REFRESH_EXPIRES_IN);
  }

  get jwtRefreshTtlSeconds(): number {
    return Math.floor(ms(this.jwtRefreshExpiresIn) / 1000);
  }
}
