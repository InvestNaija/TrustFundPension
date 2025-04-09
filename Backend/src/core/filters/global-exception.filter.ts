import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  interface PostgresError extends Error {
    code: string;
    detail: string;
  }
  
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    private logger = new Logger(GlobalExceptionFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
  
      if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
        message = exception.getResponse()['message'] || exception.message;
      }
  
      if (this.isPostgresError(exception)) {
        if (exception.code === '23505') {
          const key = exception.detail.split('=')[0];
  
          statusCode = HttpStatus.CONFLICT;
          message = `${key.slice(5, key.length - 1)} already exists`;
        }
      }
  
      if (exception instanceof Error && exception.name === 'JsonWebTokenError') {
        statusCode = HttpStatus.UNAUTHORIZED;
        message = 'Invalid token';
      }
  
      if (exception instanceof Error && exception.name === 'TokenExpiredError') {
        statusCode = HttpStatus.UNAUTHORIZED;
        message = 'Expired token';
      }
  
      if (
        exception instanceof Error &&
        exception.name === 'EntityPropertyNotFoundError'
      ) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = exception.message;
      }
  
      // Log unhandled errors with stack trace
      if (
        statusCode === HttpStatus.INTERNAL_SERVER_ERROR &&
        exception instanceof Error
      ) {
        this.logger.error(`${exception.message} - Stack: ${exception.stack}`);
      }
  
      response.status(statusCode).json({
        status: false,
        message,
        data: {},
      });
    }
  
    // Type guard for PostgreSQL errors
    private isPostgresError(error: unknown): error is PostgresError {
      return (
        (error as PostgresError).code !== undefined &&
        (error as PostgresError).detail !== undefined
      );
    }
  }