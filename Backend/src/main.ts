import {
  ClassSerializerInterceptor,
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './core/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        // Allow requests with no origin (like Postman or mobile apps) or from allowed origins
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true, // Allow credentials such as cookies, authorization headers, etc.
    preflightContinue: false,
    optionsSuccessStatus: 200, // For legacy browser support
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(morgan('combined'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Strips properties not defined in a DTO
      forbidNonWhitelisted: true, // Throws an error for non-whitelisted properties
    }),
  );

  // Enable class-transformer globally
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new GlobalExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Trustfund Pension')
    .setDescription('API Documentation for Trustfund Pension')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3001, () => {
    Logger.log(
      `
      ################################################
      🛡️ Trustfund Pension is running! Access URLs:
      🏠 Local:      http://localhost:3001
      ################################################
      `,
    );
    Logger.log(
      `
      ################################################
      🛡️ Trustfund Pension doc is running! Access URLs:
      🏠 Local:    http://localhost:3001/docs/
      ################################################
      `,
    );
  });
}
bootstrap();
