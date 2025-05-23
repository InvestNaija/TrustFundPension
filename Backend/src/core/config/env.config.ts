import * as dotenv from 'dotenv';
import * as Joi from 'joi';

export enum Env {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

dotenv.config();

export const envConfig = {
  NODE_ENV: process.env.NODE_ENV,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_SCHEMA_NAME: process.env.DB_SCHEMA_NAME,
  CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  TRUSTFUND_USERNAME: process.env.TRUSTFUND_USERNAME,
  TRUSTFUND_PASSWORD: process.env.TRUSTFUND_PASSWORD,
  TRUSTFUND_URL: process.env.TRUSTFUND_URL,
  ENCRYPTION_SECRET_KEY: process.env.ENCRYPTION_SECRET_KEY,
  TRUSTFUND_EMAIL_FROM: process.env.TRUSTFUND_EMAIL_FROM,
  TRUSTFUND_EMAIL_FROM_NAME: process.env.TRUSTFUND_EMAIL_FROM_NAME,
  TRUSTFUND_SMS_USERNAME: process.env.TRUSTFUND_SMS_USERNAME,
  TRUSTFUND_SMS_PASSWORD: process.env.TRUSTFUND_SMS_PASSWORD,
  TRUSTFUND_SMS_SENDER: process.env.TRUSTFUND_SMS_SENDER,
  TRUSTFUND_BASE_URL: process.env.TRUSTFUND_BASE_URL
}

export interface IEnvConfig {
  NODE_ENV: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: string;
  TRUSTFUND_URL: string;
  ENCRYPTION_SECRET_KEY: string;
}

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Env))
    .required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_DIALECT: Joi.string().required(),
  DB_SCHEMA_NAME: Joi.string().required(),
  CORS_ALLOWED_ORIGINS: Joi.string().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRY: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRY: Joi.string().required(),
  TRUSTFUND_USERNAME: Joi.string().required(),
  TRUSTFUND_PASSWORD: Joi.string().required(),
  TRUSTFUND_URL: Joi.string().required(),
  TRUSTFUND_EMAIL_FROM: Joi.string().required(),
  TRUSTFUND_EMAIL_FROM_NAME: Joi.string().required(),
  TRUSTFUND_SMS_USERNAME: Joi.string().required(),
  TRUSTFUND_SMS_PASSWORD: Joi.string().required(),
  TRUSTFUND_SMS_SENDER: Joi.string().required(),
  TRUSTFUND_BASE_URL: Joi.string().required(),
});

// import * as dotenv from 'dotenv';
// import * as Joi from 'joi';

// export enum Env {
//   DEVELOPMENT = 'development',
//   STAGING = 'staging',
//   PRODUCTION = 'production',
//   TEST = 'test',
// }

// dotenv.config();

// export const envConfig = {
//   NODE_ENV: process.env.NODE_ENV,
//   DB_USERNAME: process.env.DB_USERNAME,
//   DB_PASSWORD: process.env.DB_PASSWORD,
//   DB_NAME: process.env.DB_NAME,
//   DB_HOST: process.env.DB_HOST,
//   DB_PORT: process.env.DB_PORT,
//   DB_DIALECT: process.env.DB_DIALECT,
//   DB_SCHEMA_NAME: process.env.DB_SCHEMA_NAME,
//   CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS,
//   JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
//   JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
//   JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY,
//   JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY,
//   TRUSTFUND_USERNAME: process.env.TRUSTFUND_USERNAME,
//   TRUSTFUND_PASSWORD: process.env.TRUSTFUND_PASSWORD,
//   TRUSTFUND_URL: process.env.TRUSTFUND_URL,
//   validationSchema: Joi.object({
//     // Node environment
//     NODE_ENV: Joi.string()
//       .valid('development', 'production', 'test')
//       .default('development'),

//     // Application
//     PORT: Joi.number().default(3000),
//     API_PREFIX: Joi.string().default('api'),

//     // Main Database
//     DB_HOST: Joi.string().required(),
//     DB_PORT: Joi.number().default(5432),
//     DB_USERNAME: Joi.string().required(),
//     DB_PASSWORD: Joi.string().required(),
//     DB_NAME: Joi.string().required(),

//     // Test Database
//     TEST_DB_HOST: Joi.string().default('localhost'),
//     TEST_DB_PORT: Joi.number().default(5433),
//     TEST_DB_USERNAME: Joi.string().default('postgres'),
//     TEST_DB_PASSWORD: Joi.string().default('postgres'),
//     TEST_DB_NAME: Joi.string().default('trustfund_test'),
//   }),

//   validationOptions: {
//     abortEarly: true,
//     allowUnknown: true,
//   },
// };

// export const getEnvPath = (nodeEnv: string): string => {
//   const envPath = nodeEnv === 'test' ? '.env.test' : '.env';
//   return envPath;
// };