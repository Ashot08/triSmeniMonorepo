import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { EnvVariable } from '../config/env.enum';
import { join } from 'path';

const envPath = join(process.cwd(), '../../.env');
loadEnv({ path: envPath });

//const entitiesPath = join(__dirname, 'entities/*.entity.{ts,js}');
const entitiesPath = join(__dirname, '../modules/**/entities/*.entity.{ts,js}');
const migrationsPath = join(__dirname, 'migrations/*.{ts,js}');

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env[EnvVariable.POSTGRES_HOST],
  port: Number(process.env[EnvVariable.POSTGRES_PORT] ?? 5432),
  username: process.env[EnvVariable.POSTGRES_USER],
  password: process.env[EnvVariable.POSTGRES_PASSWORD],
  database: process.env[EnvVariable.POSTGRES_DB],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  migrationsTableName: 'typeorm_migrations',
  connectTimeoutMS: 10000,
};

export const AppDataSource = new DataSource(dataSourceOptions);
