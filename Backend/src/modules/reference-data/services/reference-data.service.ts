import { Injectable, Logger } from '@nestjs/common';
import { HttpRequestService } from '../../../shared/http-request/http-request.service';
import { envConfig } from '../../../core/config';

export interface ReferenceDataItem {
  Code: string;
  Name: string;
}

@Injectable()
export class ReferenceDataService {
  private readonly logger = new Logger(ReferenceDataService.name);

  constructor(private readonly httpRequestService: HttpRequestService) {}

  async getCountries(): Promise<ReferenceDataItem[]> {
    try {
      const response = await this.httpRequestService.makeRequest({
        method: 'GET',
        url: `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Codes/Countries`,
      });
      return response || [];
    } catch (error) {
      this.logger.error('Failed to fetch countries:', error);
      throw error;
    }
  }

  async getStates(): Promise<ReferenceDataItem[]> {
    try {
      const response = await this.httpRequestService.makeRequest({
        method: 'GET',
        url: `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Codes/States`,
      });
      return response || [];
    } catch (error) {
      this.logger.error('Failed to fetch states:', error);
      throw error;
    }
  }

  async getLGAs(stateCode: string): Promise<ReferenceDataItem[]> {
    try {
      const response = await this.httpRequestService.makeRequest({
        method: 'GET',
        url: `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Codes/LGA?StateCode=${stateCode}`,
      });
      return response || [];
    } catch (error) {
      this.logger.error(`Failed to fetch LGAs for state ${stateCode}:`, error);
      throw error;
    }
  }

  async getTitles(): Promise<ReferenceDataItem[]> {
    try {
      const response = await this.httpRequestService.makeRequest({
        method: 'GET',
        url: `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Codes/titles`,
      });
      return response || [];
    } catch (error) {
      this.logger.error('Failed to fetch titles:', error);
      throw error;
    }
  }

  async getMaritalStatus(): Promise<ReferenceDataItem[]> {
    try {
      const response = await this.httpRequestService.makeRequest({
        method: 'GET',
        url: `${envConfig.TRUSTFUND_SERVICE_BASE_URL}api/Codes/MaritalStatus`,
      });
      return response || [];
    } catch (error) {
      this.logger.error('Failed to fetch marital status:', error);
      throw error;
    }
  }

  async getNOKRelationships(): Promise<ReferenceDataItem[]> {
    try {
      const response = await this.httpRequestService.makeRequest({
        method: 'GET',
        url: `${envConfig.TRUSTFUND_URL}api/get_relationships.php`,
      });
      return response || [];
    } catch (error) {
      this.logger.error('Failed to fetch NOK relationships:', error);
      throw error;
    }
  }
} 