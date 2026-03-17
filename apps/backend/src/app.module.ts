import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '@/config/database.config';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env', // путь от apps/backend
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
