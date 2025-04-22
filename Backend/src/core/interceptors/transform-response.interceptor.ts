import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { IApiResponse } from '../types';

class TransformResponseInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((response: IApiResponse) => {
        // Turn the response(plain object) to an instance of the DTO(class). Allows other properties from the plain object
        return {
          ...response,
          data: plainToInstance(this.dto, response.data),
        };
      }),
    );
  }
}

interface ClassConstructor {
  new (...args: any[]): object;
}

export const TransformResponse = (dto: ClassConstructor) => {
  return UseInterceptors(new TransformResponseInterceptor(dto));
};
