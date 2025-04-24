import { DataSource } from 'typeorm';
import { envConfig } from './env.config';

export const dataSourceOptions = {
  type: 'postgres',
  host: envConfig.DB_HOST,
  port: parseInt(envConfig.DB_PORT),
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  schema: envConfig.DB_SCHEMA_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
};

export const dataSource = new DataSource(dataSourceOptions); 