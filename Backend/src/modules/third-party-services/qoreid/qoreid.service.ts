import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { envConfig } from '../../../core/config';
import { HttpRequestService } from '../../../shared/http-request';
import { IQoreIdNinResponse } from './types';

@Injectable()
export class QoreIdService {
  private logger = new Logger(QoreIdService.name);
  private accessToken: string | null = null;
  private headers: Record<string, string> = {};

  constructor(private readonly httpRequest: HttpRequestService) {}

  private async initializeToken(): Promise<void> {
    try {
      const url = `${envConfig.QOREID_BASE_URL}/token`;
      const response = await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        data: {
          clientId: envConfig.QOREID_CLIENT_ID,
          secret: envConfig.QOREID_SECRET,
        }
      });

      if (!response || !response.accessToken) {
        this.logger.error('Invalid token response:', response);
        throw new UnprocessableEntityException('Invalid token response');
      }

      this.accessToken = response.accessToken;
      this.headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      };
      this.logger.log('Successfully initialized QoreID token');
    } catch (error) {
      this.logger.error('Error during token initialization:', error);
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
      throw new UnprocessableEntityException('Could not authenticate with QoreID');
    }
  }

  async verifyNin(nin: string): Promise<IQoreIdNinResponse> {
    try {
      if (!this.accessToken) {
        await this.initializeToken();
      }

      const url = `${envConfig.QOREID_BASE_URL}/v1/ng/identities/nin/${nin}`;
      const response = await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        headers: this.headers,
      });

      if (!response || !response.nin) {
        this.logger.error('Invalid NIN response from QoreID');
        throw new UnprocessableEntityException('NIN verification failed');
      }

      return response;
    } catch (error) {
      this.logger.error('Error verifying NIN:', error);
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
      throw new UnprocessableEntityException('Could not verify NIN');
    }
  }
} 