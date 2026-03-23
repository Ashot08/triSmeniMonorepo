import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '@/config/database.config';
import { RedisModule } from '@/redis/redis.module';
import { UserModule } from './user/user.module';
import { UserModule } from './modules/user/user.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env']
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    RedisModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
