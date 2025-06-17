import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { envConfig } from '../../../core/config';
import { HttpRequestService } from '../../../shared/http-request';
import { IQoreIdNinResponse, IQoreIdBvnResponse } from './types';

interface TokenData {
  accessToken: string;
  expiryTime: number;
  headers: Record<string, string>;
}

@Injectable()
export class QoreIdService {
  private logger = new Logger(QoreIdService.name);
  private tokenManager: Map<string, TokenData> = new Map();
  private readonly TOKEN_KEY = 'qoreid_main_token';

  constructor(private readonly httpRequest: HttpRequestService) {}

  private async initializeToken(): Promise<TokenData> {
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

      const tokenData: TokenData = {
        accessToken: response.accessToken,
        expiryTime: Date.now() + ((response.expiresIn - 300) * 1000),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${response.accessToken}`,
        }
      };

      this.tokenManager.set(this.TOKEN_KEY, tokenData);
      this.logger.log('Successfully initialized QoreID token');
      return tokenData;
    } catch (error) {
      this.logger.error('Error during token initialization:', error);
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
      throw new UnprocessableEntityException('Could not authenticate with QoreID');
    }
  }

  private async ensureValidToken(): Promise<TokenData> {
    const currentToken = this.tokenManager.get(this.TOKEN_KEY);
    const isTokenExpired = !currentToken || Date.now() >= currentToken.expiryTime;
    
    if (isTokenExpired) {
      return this.initializeToken();
    }
    
    return currentToken;
  }

  async verifyNin(nin: string): Promise<IQoreIdNinResponse> {
    try {
      const tokenData = await this.ensureValidToken();

      const url = `${envConfig.QOREID_BASE_URL}/v1/ng/identities/nin/${nin}`;
      const response = await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        headers: tokenData.headers,
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

  async verifyBvn(bvn: string): Promise<IQoreIdBvnResponse> {
    try {
      const tokenData = await this.ensureValidToken();

      const url = `${envConfig.QOREID_BASE_URL}/v1/ng/identities/bvn-premium/${bvn}`;
      const response = await this.httpRequest.makeRequest({
        method: 'POST',
        url,
        headers: tokenData.headers,
      });

      if (!response || !response.bvn) {
        this.logger.error('Invalid BVN response from QoreID');
        throw new UnprocessableEntityException('BVN verification failed');
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