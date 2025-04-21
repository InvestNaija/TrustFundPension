import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
// import { getEnvPath } from '../src/core/config/env.config';

// // Load the correct .env file based on NODE_ENV
// dotenv.config({ path: getEnvPath(process.env.NODE_ENV!) });

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TEST_DB_HOST!,
  port: Number(process.env.TEST_DB_PORT!),
  username: process.env.TEST_DB_USERNAME!,
  password: process.env.TEST_DB_PASSWORD!,
  database: process.env.TEST_DB_NAME!,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true, // This will ensure a clean database for each test run
  logging: false,
};

export const getTestDatabaseConfig = (): TypeOrmModuleOptions => {
  return {
    ...testDatabaseConfig,
    autoLoadEntities: true,
  };
}; 