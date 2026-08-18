import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { EnvVariable } from '@/config/env.enum';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const isProd = config.get(EnvVariable.NODE_ENV) === 'production';
    return {
      type: 'postgres',
      host: config.get(EnvVariable.POSTGRES_HOST),
      port: config.get<number>(EnvVariable.POSTGRES_PORT),
      username: config.get(EnvVariable.POSTGRES_USER),
      password: config.get(EnvVariable.POSTGRES_PASSWORD),
      database: config.get(EnvVariable.POSTGRES_DB),
      logging: config.get(EnvVariable.DB_LOGGING) === 'true',
      autoLoadEntities: true,
      synchronize: true, // в проде установить false
      // migrations: [
      //   isProd
      //     ? 'dist/database/migrations/*{.js}'
      //     : 'src/database/migrations/*{.ts}',
      // ],
      // migrationsTableName: 'typeorm_migrations',
      // migrationsRun: false,
    };
  },
};
