import { Injectable, Logger } from '@nestjs/common';
import { TrustFundService } from '../../third-party-services/trustfund/trustfund.service';
import { IApiResponse } from '../../../shared/types';
import {
  IEmailRequest,
  ISmsRequest,
  IContributionRequest,
  IAccountManagerRequest,
  ISummaryRequest,
  ICustomerOnboardingRequest,
} from '../../third-party-services/trustfund/types';
import {
  EmailRequestDto,
  SmsRequestDto,
  ContributionRequestDto,
  AccountManagerRequestDto,
  SummaryRequestDto,
  CustomerOnboardingRequestDto,
  GenerateReportQueryDto,
} from '../dto';

@Injectable()
export class PensionService {
  private readonly logger = new Logger(PensionService.name);

  constructor(private readonly trustFundService: TrustFundService) {}

  async sendEmail(data: EmailRequestDto): Promise<IApiResponse> {
    try {
      const emailRequest: IEmailRequest = {
        to: data.to,
        subject: data.subject,
        body: data.body,
        from: data.from,
        from_name: data.from_name,
      };
      const response = await this.trustFundService.sendEmail(emailRequest);
      return {
        status: true,
        message: 'Email sent successfully',
        data: response || {},
      };
    } catch (error) {
      this.logger.error('Error in sendEmail:', error);
      return {
        status: false,
        message: error.message || 'Failed to send email',
        data: {},
      };
    }
  }

  async sendSms(data: SmsRequestDto): Promise<IApiResponse> {
    try {
      const smsRequest: ISmsRequest = {
        username: data.username,
        password: data.password,
        msisdn: data.msisdn,
        msg: data.msg,
        sender: data.sender,
      };
      const response = await this.trustFundService.sendSms(smsRequest);
      return {
        status: true,
        message: 'SMS sent successfully',
        data: response || {},
      };
    } catch (error) {
      this.logger.error('Error in sendSms:', error);
      return {
        status: false,
        message: error.message || 'Failed to send SMS',
        data: {},
      };
    }
  }

  async getFundTypes(): Promise<IApiResponse> {
    try {
      const response = await this.trustFundService.getFundTypes();
      return {
        status: true,
        message: 'Fund types retrieved successfully',
        data: { fundTypes: response },
      };
    } catch (error) {
      this.logger.error('Error in getFundTypes:', error);
      return {
        status: false,
        message: error.message || 'Failed to get fund types',
        data: {},
      };
    }
  }

  async getLastTenContributions(data: ContributionRequestDto): Promise<IApiResponse> {
    try {
      const contributionRequest: IContributionRequest = {
        pin: data.pin,
      };
      const response = await this.trustFundService.getLastTenContributions(contributionRequest);
      return {
        status: true,
        message: 'Contributions retrieved successfully',
        data: { contributions: response },
      };
    } catch (error) {
      this.logger.error('Error in getLastTenContributions:', error);
      return {
        status: false,
        message: error.message || 'Failed to get contributions',
        data: {},
      };
    }
  }

  async getAccountManager(data: AccountManagerRequestDto): Promise<IApiResponse> {
    try {
      const managerRequest: IAccountManagerRequest = {
        rsa_number: data.rsa_number,
      };
      const response = await this.trustFundService.getAccountManager(managerRequest);
      return {
        status: true,
        message: 'Account manager details retrieved successfully',
        data: { manager: response },
      };
    } catch (error) {
      this.logger.error('Error in getAccountManager:', error);
      return {
        status: false,
        message: error.message || 'Failed to get account manager details',
        data: {},
      };
    }
  }

  async getSummary(data: SummaryRequestDto): Promise<IApiResponse> {
    try {
      const summaryRequest: ISummaryRequest = {
        pin: data.pin,
      };
      const response = await this.trustFundService.getSummary(summaryRequest);
      return {
        status: true,
        message: 'Summary retrieved successfully',
        data: response,
      };
    } catch (error) {
      this.logger.error('Error in getSummary:', error);
      return {
        status: false,
        message: error.message || 'Failed to get summary',
        data: {},
      };
    }
  }

  async customerOnboarding(data: CustomerOnboardingRequestDto): Promise<IApiResponse> {
    try {
      const onboardingRequest: ICustomerOnboardingRequest = {
        ...data,
        othernames: data.othernames || '',
        maidenName: data.maidenName || '',
        permBox: data.permBox || '',
        permanentAddress1: data.permanentAddress1 || '',
        permZip: data.permZip || '',
        employerZip: data.employerZip || '',
        employerBox: data.employerBox || '',
        nokOthername: data.nokOthername || '',
        nokZip: data.nokZip || '',
        nokEmailaddress: data.nokEmailaddress || '',
        nokBox: data.nokBox || '',
        pictureImage: data.pictureImage || '',
        formImage: data.formImage || '',
        signatureImage: data.signatureImage || '',
      };
      const response = await this.trustFundService.customerOnboarding(onboardingRequest);
      return {
        status: true,
        message: 'Customer onboarding completed successfully',
        data: response || {},
      };
    } catch (error) {
      this.logger.error('Error in customerOnboarding:', error);
      return {
        status: false,
        message: error.message || 'Failed to complete customer onboarding',
        data: {},
      };
    }
  }

  async generateReport(data: GenerateReportQueryDto): Promise<Buffer> {
    return await this.trustFundService.generateReport(data);
  }

  async generateWelcomeLetter(data: { pin: string }): Promise<Buffer> {
    return await this.trustFundService.generateWelcomeLetter(data);
  }
} 