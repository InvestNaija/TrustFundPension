import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { envConfig } from '../../../core/config';
import { HttpRequestService } from '../../../shared/http-request';
import { IVerifyMeBvnResponse } from './types';

@Injectable()
export class VerifyMeService {
  private logger = new Logger(VerifyMeService.name);

  constructor(private readonly httpRequest: HttpRequestService) {}

  private getRequestHeaders() {
    return {
        'Authorization': `Bearer ${envConfig.VERIFYME_SECRET_KEY}`,
        'Content-Type': 'application/json'
    };
  }

  async verifyBvn(bvn: string, firstName: string, lastName: string): Promise<IVerifyMeBvnResponse> {
    try {
      const url = `${envConfig.VERIFYME_BASE_URL}/${bvn}?type=premium`;
      const data = JSON.stringify({
        firstname: firstName,
        lastname: lastName
      });
      const response = await this.httpRequest.makeRequest({
        url,
        method: 'POST',
        headers: this.getRequestHeaders(),
        data
      });

      if (!response || !response.status) {
        this.logger.error('Invalid BVN response:', response);
        throw new UnprocessableEntityException(response?.message || 'Invalid BVN');
      }

      return response;
    } catch (error) {
      this.logger.error('Error verifying BVN:', error);
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
      throw new UnprocessableEntityException('Could not verify BVN');
    }
  }
} 