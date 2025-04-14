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
});