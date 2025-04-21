import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { envConfig } from './env.config';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envConfig.DB_HOST,
  port: Number(envConfig.DB_PORT),
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  schema: envConfig.DB_SCHEMA_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/core/database/migrations/*.js'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
};
 
const databaseSource = new DataSource(dataSourceOptions);

// Attempt database connection
export const initializeSchema = async () => {
  databaseSource
    .initialize()
    .then(async () => {
      // Create schema if it doesn't exist
      await databaseSource.query(
        `CREATE SCHEMA IF NOT EXISTS ${envConfig.DB_SCHEMA_NAME};`,
      );
 
      console.log(
        `Schema '${envConfig.DB_SCHEMA_NAME}' created or already exists.`,
      );
    })
    .catch((error) => {
      console.error(`Connection to database failed: ${error}`);
      process.exit(1);
    });
};

export default databaseSource;