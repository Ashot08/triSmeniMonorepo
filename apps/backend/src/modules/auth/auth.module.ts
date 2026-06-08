import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { EnvVariable } from '@/config/env.enum';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { RedisService } from '@/redis/redis.service';
import { JwtConfigService } from '@/config/jwt-config.service';
import { SessionService } from '@/modules/auth/session.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>(EnvVariable.JWT_ACCESS_SECRET),
        signOptions: {
          expiresIn: config.getOrThrow<StringValue>(EnvVariable.JWT_ACCESS_EXPIRES_IN),
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RedisService, JwtConfigService, SessionService],
  controllers: [AuthController],
})
export class AuthModule {}
