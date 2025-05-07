import { Injectable, Logger } from '@nestjs/common';
import { HttpRequestService } from '../../../shared/http-request/http-request.service';
import { envConfig } from '../../../core/config';
import { VerificationService } from '../../user/services/verification.service';
import { UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class NinService {
  private readonly logger = new Logger(NinService.name);
  private readonly BASE_URL = envConfig.QOREID_BASE_URL;
  private readonly API_KEY = envConfig.QOREID_SECRET;
  private readonly CLIENT_ID = envConfig.QOREID_CLIENT_ID;
  private headers: Record<string, string>;

  constructor(
    private readonly httpRequestService: HttpRequestService,
    private readonly verificationService: VerificationService,
  ) {
    this.initializeToken();
  }

  private async initializeToken() {
    try {
      const url = `${this.BASE_URL}/token`
      const response = await this.httpRequestService.makeRequest({
        method: 'POST',
        url,
        data: {
          clientId: this.CLIENT_ID,
          secret: this.API_KEY
        },
      });

      this.headers = {
        Authorization: `Bearer ${response.accessToken}`,
        'Content-Type': 'application/json'
      };

      this.logger.log('Successfully initialized QoreID token');
    } catch (error) {
      this.logger.error('Error initializing QoreID token:', error);
      throw new UnprocessableEntityException('Could not initialize QoreID service');
    }
  }

  private formatNinResponse(data: any) {
    const ninData = data || {};
    const response: any = {
      nin: ninData.nin,
      firstname: ninData.firstname,
      lastname: ninData.lastname,
    };

    // Handle phone numbers
    const phones: string[] = [];
    if (ninData.phone) phones.push(ninData.phone);
    if (phones.length > 0) {
      response.phones = [...new Set(phones)]; // Remove duplicates
    }

    // Handle emails
    const emails: string[] = [];
    if (ninData.email) emails.push(ninData.email);
    if (ninData.emails && Array.isArray(ninData.emails)) {
      emails.push(...ninData.emails);
    }
    if (emails.length > 0) {
      response.emails = [...new Set(emails)]; // Remove duplicates
    }

    return response;
  }

  async getNinDetails(nin: string) {
    try {
      const url = `${this.BASE_URL}/v1/ng/identities/nin/${nin}`;
      const response = await this.httpRequestService.makeRequest({
        method: 'POST',
        url,
        data: {},
        headers: this.headers,
      });

      if (response.nin) {
        const formattedData = this.formatNinResponse(response.nin);
        
        return {
          status: true,
          message: 'NIN verified successfully',
          data: formattedData,
        };
      }

      throw new UnprocessableEntityException('Could not verify NIN');
    } catch (error) {
      this.logger.error('Error verifying NIN:', error);
      throw new UnprocessableEntityException(error.response?.response?.data?.message || 'Could not verify NIN');
    }
  }

  async verifyNin(nin: string, userId: string) {
    try {
      const response = await this.verificationService.updateNinVerification(userId, nin);
      return response;
    } catch (error) {
      this.logger.error('Error getting NIN details:', error);
      throw new UnprocessableEntityException(error.response?.response?.data?.message || 'Could not retrieve NIN details');
    }
  }
} 