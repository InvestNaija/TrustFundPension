import { Injectable, Logger } from '@nestjs/common';
import { HttpRequestService } from '../../../shared/http-request/http-request.service';
import { envConfig } from '../../../core/config';
import { VerificationService } from '../../user/services/verification.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { VerifyBvnDto } from './dto/verify-bvn.dto';
import { GetBvnDetailsDto } from './dto/get-bvn-details.dto';
import { BvnDataService } from '../../user/services/bvn-data.service';

@Injectable()
export class BvnService {
  private readonly logger = new Logger(BvnService.name);
  private readonly BASE_URL = envConfig.BVN_API_URL;
  private readonly API_KEY = envConfig.BVN_API_KEY;

  constructor(
    private readonly httpRequestService: HttpRequestService,
    private readonly verificationService: VerificationService,
    private readonly bvnDataService: BvnDataService,
  ) {}

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.API_KEY}`
    };
  }

  private postHeaders() {
    return {
      Authorization: `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  private formatBvnResponse(data: any) {
    const bvnData = data || {};
    const response: any = {
      bvn: bvnData.bvn,
    };

    const phones: string[] = [];
    if (bvnData.phone) phones.push(bvnData.phone);
    if (bvnData.phone1) phones.push(bvnData.phone1);
    if (bvnData.phone2) phones.push(bvnData.phone2);
    if (bvnData.phones && Array.isArray(bvnData.phones)) {
      phones.push(...bvnData.phones);
    }
    if (phones.length > 0) {
      response.phones = [...new Set(phones)];
    }

    const emails: string[] = [];
    if (bvnData.email) emails.push(bvnData.email);
    if (bvnData.email2) emails.push(bvnData.email2);
    if (bvnData.emails && Array.isArray(bvnData.emails)) {
      emails.push(...bvnData.emails);
    }
    if (emails.length > 0) {
      response.emails = [...new Set(emails)];
    }

    return response;
  }

  async getBvnDetails(getBvnDetailsDto: GetBvnDetailsDto, userId: string) {
    try {
      const existingBvnData = await this.bvnDataService.findOne(userId);
      if (existingBvnData) {
        return {
          status: true,
          message: 'BVN details retrieved successfully from cache',
          data: existingBvnData.bvnResponse,
        };
      }

      const url = `${this.BASE_URL}/${getBvnDetailsDto.bvn}?type=premium`;
      const body = JSON.stringify({
        firstname: getBvnDetailsDto.firstName,
        lastname: getBvnDetailsDto.lastName 
      });
      const response = await this.httpRequestService.makeRequest({
        method: 'POST',
        url,
        data: body,
        headers: this.postHeaders(),
      });

      if (response.data) {
        const formattedData = this.formatBvnResponse(response.data);
        
        // Save BVN data to database
        await this.bvnDataService.create({
          userId,
          bvn: getBvnDetailsDto.bvn,
          bvnResponse: response.data
        });

        return {
          status: true,
          message: 'BVN details retrieved successfully',
          data: formattedData,
        };
      }

      throw new UnprocessableEntityException('Could not retrieve BVN details');
    } catch (error) {
      this.logger.error('Error getting BVN details:', error);
      throw new UnprocessableEntityException(error.response?.response?.data?.message || 'Could not retrieve BVN details');
    }
  }

  async verifyBvn(verifyBvnDto: VerifyBvnDto, userId: string) {
    try {
      const existingBvnData = await this.bvnDataService.findOne(userId);
      if (!existingBvnData) {
        throw new UnprocessableEntityException('BVN data not found. Please get BVN details first.');
      }

      await this.verificationService.updateBvnVerification(userId, verifyBvnDto.bvn);

      return {
        status: true,
        message: 'BVN verified successfully',
        data: existingBvnData.bvnResponse,
      };
    } catch (error) {
      this.logger.error('Error verifying BVN:', error);
      throw new UnprocessableEntityException(error.message || 'Could not verify BVN');
    }
  }
} 