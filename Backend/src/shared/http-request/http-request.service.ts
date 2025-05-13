import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { envConfig } from '../../core/config';
import { firstValueFrom } from 'rxjs';
import { IHttpRequest } from './types';

@Injectable()
export class HttpRequestService {
  protected logger = new Logger(HttpRequestService.name);

  constructor(private readonly httpService: HttpService) {}
  private url_pen = `${envConfig.TRUSTFUND_BASE_URL}/pensionserver-web/rest/partnerservice/auth/login`

  async makeRequest({ method, data, url, headers, responseType }: IHttpRequest) {
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          url,
          method,
          data,
          headers,
          responseType,
        }),
      );
      this.logger.log({ url, status: response.status });

      if (url === this.url_pen) {
        return response.headers;
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error making request:', error);
      throw new UnprocessableEntityException('Request failed');
    }
  }
}
