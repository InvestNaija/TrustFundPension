import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { envConfig } from './env.config';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};

export const dataSource = new DataSource(databaseConfig as DataSourceOptions);

export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('Database connection established successfully');
    } else {
      console.log('Using existing database connection');
    }
  } catch (error) {
    console.error(`Connection to database failed: ${error}`);
    // Only exit if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

export default dataSource;